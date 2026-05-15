import assert from "node:assert/strict";
import { analyzeDoubleTextRisk } from "./src/index.js";

const tooSoon = analyzeDoubleTextRisk("Just checking if you saw this?", {
  hoursSinceLastOutbound: 4,
  followUpCount: 0
});
assert.equal(tooSoon.window, "too soon");
assert.equal(tooSoon.decision.action, "wait");
assert.ok(tooSoon.metrics.risk >= 5);

const cleanNudge = analyzeDoubleTextRisk(
  "No rush. Sharing the draft here in case it helps. Happy to leave it here if now is bad timing.",
  {
    hoursSinceLastOutbound: 52,
    followUpCount: 0
  }
);
assert.equal(cleanNudge.window, "reasonable");
assert.equal(cleanNudge.decision.action, "send now");
assert.ok(cleanNudge.metrics.value >= 5.5);

const stacked = analyzeDoubleTextRisk("Following up again. Any update? Still waiting on this.", {
  hoursSinceLastOutbound: 36,
  followUpCount: 2
});
assert.equal(stacked.decision.action, "do not send");
assert.ok(stacked.metrics.pressure >= 7);

const stale = analyzeDoubleTextRisk(
  "Checking in again in case this got buried. Happy to close the loop either way.",
  {
    hoursSinceLastOutbound: 120,
    followUpCount: 1
  }
);
assert.equal(stale.window, "stale");
assert.equal(stale.decision.action, "switch channel");
assert.ok(stale.metrics.channelShift >= 6.5);

console.log("double-text-risk tests passed");
