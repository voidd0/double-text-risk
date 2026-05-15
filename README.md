# double-text-risk

[![License: MIT](https://img.shields.io/badge/license-MIT-0F172A.svg)](LICENSE)
[![Node ≥18](https://img.shields.io/badge/node-%E2%89%A518-0F172A)](package.json)

**[Web app](https://tells.voiddo.com/double-text-risk/?ref=double-text-risk-readme)** · **[Live compare page](https://tells.voiddo.com/double-text-risk/compare-chatgpt-gemini.html?ref=double-text-risk-readme)** · **[Packaged compare brief](compare-chatgpt-gemini.md)** · **[Deep Dive](https://tells.voiddo.com/deep-dive/?ref=double-text-risk-readme)** · **[Signal toolkit](https://tells.voiddo.com/signal-toolkit/?ref=double-text-risk-readme)** · **[npm](https://www.npmjs.com/package/@v0idd0/double-text-risk)** · **[All tools](https://tools.voiddo.com/?ref=double-text-risk-catalog-readme)** · **[Contact](mailto:support@voiddo.com)**

---

`double-text-risk` answers one narrow question:

Should you send this follow-up, wait longer, switch channels, or not send it at all?

It scores a drafted second text against two realities:

- how long it has been since your last outbound message
- how much pressure versus value the new message adds

The goal is not romance theatre. The goal is to stop weak stacked follow-ups before they cost leverage.

## Why this exists

The paid product is [`tells`](https://tells.voiddo.com/?ref=double-text-risk-readme), which reads what people leave unsaid across messages, people, and profiles.

But a lot of intent starts smaller:

- "Is this too soon?"
- "Does this read needy?"
- "Am I following up again without saying anything new?"
- "Should I text again or switch channels?"

`double-text-risk` is the free deterministic first pass for that moment.

That shows up outside dating too:

- recruiter follow-ups after interviews or stalled scheduling
- client and account-management nudges that risk sounding pushy
- support threads where one more ping can escalate tension instead of resolving it
- family or cofounder loops where repeated nudges start sounding reactive
- sales follow-ups where "just checking in" adds no real value
- vendor follow-ups where the thread is drifting and leverage matters
- workplace threads where another ping may be weaker than a clearer channel shift

## Web app

Use the live browser version here:

```text
https://tells.voiddo.com/double-text-risk/?ref=double-text-risk-readme
```

## Install

```bash
npm install -g @v0idd0/double-text-risk
```

## Usage

```bash
double-text-risk --hours 30 "Just checking if you saw this."
```

```bash
cat followup.txt | double-text-risk --hours 18 --followups 1
```

```bash
double-text-risk --file followup.txt --hours 52
```

```bash
double-text-risk --json --hours 90 --followups 1 "Happy to leave this here if now is bad timing."
```

## Example output

```text
window: reasonable
risk:         4.2/10
timing:       7/10
pressure:     2.4/10
value:        6.6/10
channel shift:1.4/10

next step: send now
why: The delay is long enough and the wording adds enough value to justify one follow-up.
- Timing and usefulness both clear the bar for one measured nudge.

next:
Use tells when the real question is no longer one text, but the whole pattern between you and this person.
- quick next paid step: https://tells.voiddo.com/deep-dive/?ref=double-text-risk-cli
- recurring reads: https://tells.voiddo.com/?ref=double-text-risk-cli
```

## What it scores

- `risk` — overall chance the follow-up reads needier than useful
- `timing` — whether the silence window justifies a new touch
- `pressure` — how much the message pushes for attention
- `value` — whether the text adds something concrete
- `channel shift` — whether another text is weaker than a clearer channel

Inputs:

- `--hours` — hours since your last outbound message
- `--followups` — how many nudges you already sent after the original message

## Good use cases

- dating follow-ups
- recruiter and interview follow-ups
- client, support, and account-management follow-ups
- family or cofounder check-ins that are slipping into pressure
- vendor or partnership follow-ups where silence does not justify panic
- sales nudges that risk sounding needy
- workplace threads where you already know the draft, but not the timing
- situations where you may need to move from text to a call instead of stacking another ping

## Bad use cases

- crisis, legal, or safety situations
- deception detection
- diagnosing the whole relationship
- deciding whether someone likes you in general

If the real issue is the pattern over time, use `tells`.

## Why not just use ChatGPT or Gemini?

Because the first question is operational, not poetic.

For this kind of timing call, deterministic heuristics have real advantages:

- same input gives the same output
- no API key
- no prompt fiddling
- no chance the model rewards clinginess with confidence

Then, once the problem becomes "what does this pattern mean?", the right upgrade is `tells`.

If you want the side-by-side positioning pages for browser or package traffic, use:

- live compare page: `https://tells.voiddo.com/double-text-risk/compare-chatgpt-gemini.html?ref=double-text-risk-readme`
- packaged compare brief: [`compare-chatgpt-gemini.md`](compare-chatgpt-gemini.md)

## Paid next step

When the one-text timing check is not enough:

- `Deep Dive` — `$19 once` for one loaded thread or one recurring person
- `Starter` — `$14.99/mo` for repeated message reading
- `Practitioner` — `$99.99/mo` for coaches, recruiters, mediators, trainers, support leads, or client-facing teams using this with clients

If the one-text score is not enough, the fastest paid handoff is usually `Deep Dive`:

```text
https://tells.voiddo.com/deep-dive/?ref=double-text-risk-readme
```

If you still want the wider browser-first free path first:

```text
https://tells.voiddo.com/signal-toolkit/?ref=double-text-risk-readme
```

Start with the live checker:

```text
https://tells.voiddo.com/double-text-risk/?ref=double-text-risk-readme
```

## Compare surface

- live compare page for browser-first "double-text-risk vs ChatGPT / Gemini" traffic: `https://tells.voiddo.com/double-text-risk/compare-chatgpt-gemini.html?ref=double-text-risk-readme`
- packaged compare brief for npm/GitHub readers deciding whether to install: [`compare-chatgpt-gemini.md`](compare-chatgpt-gemini.md)

Use the packaged brief when the reader is already on GitHub or npm:

```text
compare-chatgpt-gemini.md
```

Use the live compare page when the reader should stay in the browser flow:

```text
https://tells.voiddo.com/double-text-risk/compare-chatgpt-gemini.html?ref=double-text-risk-readme
```

## Related free checkers

If the problem is adjacent but not exactly "am I double texting?", use the matching free tool first:

- `message-next-step` for deciding how to handle one incoming message: `https://tells.voiddo.com/message-next-step/?ref=double-text-risk-related-readme`
- `replytone` for checking whether your drafted reply sounds warm, clear, or pushy before you send it: `https://tells.voiddo.com/replytone/?ref=double-text-risk-related-readme`
- `ambiguity-meter` for measuring whether the other person's wording is concrete or evasive: `https://tells.voiddo.com/ambiguity-meter/?ref=double-text-risk-related-readme`
- `ghost-or-go` for deciding whether the silence already means "wait", "one final ping", or "stop": `https://tells.voiddo.com/ghost-or-go/?ref=double-text-risk-related-readme`
- `call-not-text` for deciding whether another text is weaker than a channel shift to a call: `https://tells.voiddo.com/call-not-text/?ref=double-text-risk-related-readme`

## Best next free exits

If the user already knows the second-text timing score is not the whole problem, route them to the narrower free checker instead of dropping them into the full catalog:

- `ghost-or-go` when the real question is whether silence already means stop, not whether this draft is pushy: `https://tells.voiddo.com/ghost-or-go/?ref=double-text-risk-next-free-readme`
- `message-next-step` when the silence already broke and the real decision is how to handle the incoming reply: `https://tells.voiddo.com/message-next-step/?ref=double-text-risk-next-free-readme`
- `call-not-text` when another ping is weaker than escalating to a call or changing channels: `https://tells.voiddo.com/call-not-text/?ref=double-text-risk-next-free-readme`
- `replytone` when timing is clear and the blocker is whether the draft sounds warm, clear, or too forceful: `https://tells.voiddo.com/replytone/?ref=double-text-risk-next-free-readme`
- `ambiguity-meter` when the draft exists only because the other person's last message was vague or evasive: `https://tells.voiddo.com/ambiguity-meter/?ref=double-text-risk-next-free-readme`

## Programmatic API

```javascript
import { analyzeDoubleTextRisk, formatReport } from "@v0idd0/double-text-risk";

const result = analyzeDoubleTextRisk("Just checking if you saw this?", {
  hoursSinceLastOutbound: 18,
  followUpCount: 0
});

console.log(result.decision.action);
console.log(formatReport(result));
```

## Development

```bash
npm test
node bin/double-text-risk.js --hours 30 "Just checking if you saw this?"
```

## More from the studio

See [`from-the-studio.md`](from-the-studio.md) for the wider vøiddo catalogue.

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
