import { analyzeDoubleTextRisk } from "../src/index.js";

const examples = {
  measured: {
    text: "No rush. Sharing the draft here in case it helps. Happy to leave it here if now is bad timing.",
    hours: 52,
    followUps: 0
  },
  tooSoon: {
    text: "Just checking if you saw this?",
    hours: 4,
    followUps: 0
  },
  stacked: {
    text: "Following up again. Any update? Still waiting on this.",
    hours: 36,
    followUps: 2
  }
};

const upgradeOffers = [
  {
    key: "deep-dive",
    label: "Deep Dive",
    price: "$19 once",
    href: "https://tells.voiddo.com/deep-dive/?ref=double-text-risk-deep-dive",
    note: "Use when one thread or one recurring person keeps creating the same timing anxiety."
  },
  {
    key: "starter",
    label: "Starter",
    price: "$14.99/mo",
    href: "https://tells.voiddo.com/?ref=double-text-risk-starter",
    note: "Use when you keep checking real messages and drafts, not just one follow-up."
  },
  {
    key: "practitioner",
    label: "Practitioner",
    price: "$99.99/mo",
    href: "https://tells.voiddo.com/for-coaches/?ref=double-text-risk-practitioner",
    note: "Use when follow-up analysis becomes part of coaching, mediation, or client support."
  }
];

const draftInput = document.querySelector("#draft-input");
const hoursInput = document.querySelector("#hours-input");
const hoursValue = document.querySelector("#hours-value");
const followupsInput = document.querySelector("#followups-input");
const analyzeButton = document.querySelector("#analyze-button");
const clearButton = document.querySelector("#clear-button");
const windowChip = document.querySelector("#window-chip");
const counterLine = document.querySelector("#counter-line");
const decisionChip = document.querySelector("#decision-chip");
const decisionSummary = document.querySelector("#decision-summary");
const decisionReasons = document.querySelector("#decision-reasons");
const meterGrid = document.querySelector("#meter-grid");
const hintsList = document.querySelector("#hints-list");
const primaryUpgradeLink = document.querySelector("#primary-upgrade-link");
const examplePills = [...document.querySelectorAll(".example-pill")];

function metricState(name, value) {
  if (name === "value" || name === "timing") {
    return value < 5.5 ? "warning" : "normal";
  }
  return value >= 6 ? "warning" : "normal";
}

function formatWindow(windowName) {
  if (windowName === "too soon") return "too soon";
  if (windowName === "reasonable") return "reasonable window";
  if (windowName === "stale") return "stale window";
  return "early window";
}

function chooseUpgrade(result) {
  const {
    decision,
    metrics,
    inputs: { followUpCount }
  } = result;

  if (decision.action === "do not send" || metrics.risk >= 8 || followUpCount >= 2) {
    return {
      featuredKey: "deep-dive",
      summary:
        "If you are already stacking touches or second-guessing the same person, the issue is bigger than one draft. Move into a thread-level read."
    };
  }

  if (decision.action === "switch channel" || metrics.channelShift >= 6.5) {
    return {
      featuredKey: "starter",
      summary:
        "The pattern now matters more than the wording. Starter fits repeat message reads when the same dynamic keeps showing up."
    };
  }

  return {
    featuredKey: "deep-dive",
    summary:
      "If this one timing check still leaves doubt, the next paid step is not another guess. It is a deeper read of the thread or person."
  };
}

function renderMeters(metrics) {
  meterGrid.innerHTML = "";
  const order = ["risk", "timing", "pressure", "value", "channelShift"];
  const labels = {
    risk: "risk",
    timing: "timing",
    pressure: "pressure",
    value: "value",
    channelShift: "channel shift"
  };

  order.forEach((name) => {
    const value = metrics[name];
    const state = metricState(name, value);
    const card = document.createElement("article");
    card.className = `meter-card ${state}`;
    card.innerHTML = `
      <div class="meter-top">
        <span class="meter-name">${labels[name]}</span>
        <span class="meter-value">${value.toFixed(1)}/10</span>
      </div>
      <div class="meter-track" aria-hidden="true">
        <div class="meter-fill" style="width:${Math.max(4, value * 10)}%"></div>
      </div>
    `;
    meterGrid.append(card);
  });
}

function renderUpgradePath(result) {
  const upgrade = chooseUpgrade(result);
  const featured = upgradeOffers.find((offer) => offer.key === upgrade.featuredKey);
  primaryUpgradeLink.href = featured.href;
  primaryUpgradeLink.textContent =
    featured.key === "deep-dive" ? "use the $19 Deep Dive" : "move into tells Starter";

  const summaryItem = document.createElement("li");
  summaryItem.textContent = upgrade.summary;

  const paidItem = document.createElement("li");
  paidItem.textContent = `${featured.label} ${featured.price} is the best next paid step if one follow-up check is not enough.`;

  return [summaryItem, paidItem];
}

function renderResult() {
  const result = analyzeDoubleTextRisk(draftInput.value, {
    hoursSinceLastOutbound: Number(hoursInput.value),
    followUpCount: Number(followupsInput.value)
  });

  hoursValue.textContent = `${hoursInput.value}h`;
  windowChip.textContent = formatWindow(result.window);
  counterLine.textContent = `${result.counters.words} words · ${result.counters.questions} questions`;
  decisionChip.textContent = result.decision.action;
  decisionChip.dataset.verdict = result.decision.action;
  decisionSummary.textContent = result.decision.summary;

  decisionReasons.innerHTML = "";
  result.decision.reasons.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    decisionReasons.append(item);
  });

  renderMeters(result.metrics);

  hintsList.innerHTML = "";
  const hintLines = result.rewriteHints.length ? result.rewriteHints : ["No rewrite needed yet. The current timing and value profile is clean enough."];
  hintLines.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    hintsList.append(item);
  });
  renderUpgradePath(result).forEach((item) => hintsList.append(item));
}

function setExample(name) {
  const example = examples[name];
  examplePills.forEach((pill) => {
    const isActive = pill.dataset.example === name;
    pill.classList.toggle("active", isActive);
    pill.setAttribute("aria-pressed", String(isActive));
  });
  draftInput.value = example.text;
  hoursInput.value = String(example.hours);
  followupsInput.value = String(example.followUps);
  renderResult();
}

analyzeButton.addEventListener("click", renderResult);
clearButton.addEventListener("click", () => {
  draftInput.value = "";
  draftInput.focus();
});

draftInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    renderResult();
  }
});

hoursInput.addEventListener("input", renderResult);
followupsInput.addEventListener("change", renderResult);
examplePills.forEach((pill) => {
  pill.addEventListener("click", () => setExample(pill.dataset.example));
});

setExample("measured");
