const PRESSURE_PHRASES = [
  "just checking",
  "following up",
  "bumping this",
  "did you see this",
  "any update",
  "still waiting",
  "circling back",
  "quick reminder",
  "checking in again",
  "pinging"
];

const HARD_PRESSURE_PHRASES = [
  "need an answer",
  "why haven't you",
  "haven't heard back",
  "asap",
  "urgent",
  "please respond",
  "respond today"
];

const SOFTENER_PHRASES = [
  "no rush",
  "when you have a minute",
  "if easier",
  "feel free to say no",
  "happy to leave it here",
  "totally fine if not",
  "whenever works",
  "closing the loop"
];

const VALUE_PHRASES = [
  "here's the link",
  "sharing the draft",
  "sent the file",
  "attached",
  "i can send",
  "i can make this easier",
  "happy to answer",
  "one question"
];

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function countMatches(text, phrases) {
  return phrases.reduce((count, phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const hits = text.match(regex);
    return count + (hits ? hits.length : 0);
  }, 0);
}

function describeWindow(hoursSinceLastOutbound) {
  if (hoursSinceLastOutbound < 12) {
    return "too soon";
  }
  if (hoursSinceLastOutbound < 24) {
    return "early";
  }
  if (hoursSinceLastOutbound < 72) {
    return "reasonable";
  }
  return "stale";
}

function buildDecision(metrics, options) {
  const reasons = [];
  let action = "wait";
  let summary =
    "The timing or wording still creates more pressure than value, so another nudge is likely to read as needier than intended.";

  if (metrics.risk >= 8.5 || (options.followUpCount >= 2 && options.hoursSinceLastOutbound < 72)) {
    action = "do not send";
    summary =
      "This follow-up would probably read as stacked pressure rather than useful signal.";
    reasons.push("Multiple follow-ups without enough time gap usually lower leverage.");
  } else if (metrics.channelShift >= 6.5) {
    action = "switch channel";
    summary =
      "If this matters after this much silence, another text is weaker than a clearer channel or a clean close.";
    reasons.push("The silence window is long enough that text is no longer the strongest move.");
  } else if (metrics.risk <= 4.5 && metrics.timing >= 6 && metrics.value >= 5) {
    action = "send now";
    summary = "The delay is long enough and the wording adds enough value to justify one follow-up.";
    reasons.push("Timing and usefulness both clear the bar for one measured nudge.");
  } else {
    reasons.push("The message needs more time or less pressure before it helps.");
  }

  if (metrics.pressure >= 6) {
    reasons.push("Pressure language is doing too much of the work.");
  }
  if (metrics.value < 5) {
    reasons.push("The message asks for attention without adding much new value.");
  }
  if (metrics.timing < 5) {
    reasons.push("The silence window is still short for a clean second touch.");
  }

  return {
    action,
    summary,
    reasons: [...new Set(reasons)].slice(0, 3)
  };
}

function buildRewriteHints(metrics, options) {
  const hints = [];

  if (metrics.pressure >= 6) {
    hints.push("Cut phrases like 'just checking' or 'any update' unless the timing already justifies them.");
  }
  if (metrics.value < 5) {
    hints.push("Add one concrete reason this message is worth opening now.");
  }
  if (metrics.timing < 5) {
    hints.push("Wait longer before sending so the wording does not have to overcompensate.");
  }
  if (options.followUpCount >= 1) {
    hints.push("Keep the next touch shorter than the last one and avoid repeating the same ask.");
  }
  if (metrics.channelShift >= 6.5) {
    hints.push("If the stakes are real, switch to a clearer channel or close the loop cleanly.");
  }

  return [...new Set(hints)].slice(0, 4);
}

export function analyzeDoubleTextRisk(input, options = {}) {
  const text = String(input || "").trim();
  if (!text) {
    throw new Error("double-text-risk needs follow-up text");
  }

  const hoursSinceLastOutbound = Number(options.hoursSinceLastOutbound ?? 24);
  const followUpCount = Number(options.followUpCount ?? 0);
  if (!Number.isFinite(hoursSinceLastOutbound) || hoursSinceLastOutbound < 0) {
    throw new Error("hoursSinceLastOutbound must be a non-negative number");
  }
  if (!Number.isFinite(followUpCount) || followUpCount < 0) {
    throw new Error("followUpCount must be a non-negative number");
  }

  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const questions = (text.match(/\?/g) || []).length;
  const exclamations = (text.match(/!/g) || []).length;

  const pressureHits = countMatches(lower, PRESSURE_PHRASES);
  const hardPressureHits = countMatches(lower, HARD_PRESSURE_PHRASES);
  const softenerHits = countMatches(lower, SOFTENER_PHRASES);
  const valueHits = countMatches(lower, VALUE_PHRASES);

  const timing =
    hoursSinceLastOutbound < 12
      ? 2 + hoursSinceLastOutbound * 0.18
      : hoursSinceLastOutbound < 24
        ? 4.2 + (hoursSinceLastOutbound - 12) * 0.12
        : hoursSinceLastOutbound < 72
          ? 6 + (hoursSinceLastOutbound - 24) * 0.035
          : 7.8;

  const pressure = clamp(
    2 +
      pressureHits * 1.3 +
      hardPressureHits * 1.8 +
      followUpCount * 1.2 +
      questions * 0.45 +
      exclamations * 0.5 -
      softenerHits * 0.9
  );
  const value = clamp(3 + valueHits * 1.5 + softenerHits * 0.55 - pressureHits * 0.35);
  const channelShift = clamp(
    hoursSinceLastOutbound >= 96 ? 6.8 + Math.min(2, followUpCount * 0.4) : 1 + followUpCount * 0.4
  );
  const risk = clamp(
    6.5 +
      pressure * 0.45 +
      followUpCount * 0.9 -
      value * 0.4 -
      timing * 0.55 +
      (words.length > 35 ? 0.7 : 0)
  );

  const metrics = {
    risk: round1(risk),
    timing: round1(clamp(timing)),
    pressure: round1(pressure),
    value: round1(value),
    channelShift: round1(channelShift)
  };

  return {
    window: describeWindow(hoursSinceLastOutbound),
    inputs: {
      hoursSinceLastOutbound,
      followUpCount
    },
    metrics,
    decision: buildDecision(metrics, { hoursSinceLastOutbound, followUpCount }),
    rewriteHints: buildRewriteHints(metrics, { hoursSinceLastOutbound, followUpCount }),
    counters: {
      words: words.length,
      questions
    }
  };
}

export function formatReport(result) {
  const lines = [
    `window: ${result.window}`,
    `risk:         ${result.metrics.risk}/10`,
    `timing:       ${result.metrics.timing}/10`,
    `pressure:     ${result.metrics.pressure}/10`,
    `value:        ${result.metrics.value}/10`,
    `channel shift:${result.metrics.channelShift}/10`,
    "",
    `next step: ${result.decision.action}`,
    `why: ${result.decision.summary}`
  ];

  for (const reason of result.decision.reasons) {
    lines.push(`- ${reason}`);
  }

  if (result.rewriteHints.length) {
    lines.push("", "rewrite hints:");
    result.rewriteHints.forEach((hint, index) => {
      lines.push(`${index + 1}. ${hint}`);
    });
  }

  lines.push(
    "",
    "next:",
    "Use tells when the real question is no longer one text, but the whole pattern between you and this person.",
    "- quick next paid step: https://tells.voiddo.com/deep-dive/?ref=double-text-risk-cli",
    "- recurring reads: https://tells.voiddo.com/?ref=double-text-risk-cli"
  );

  return lines.join("\n");
}
