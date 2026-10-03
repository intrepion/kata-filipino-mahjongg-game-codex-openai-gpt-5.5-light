const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createDemoRound,
  evaluateStandardWinningShape,
  resolveClaimWindow,
  revealFlores,
} = require("../game-core");

test("Standard Winning Shape accepts four melds and one pair", () => {
  const hand = ["1B", "2B", "3B", "4B", "5B", "6B", "7C", "8C", "9C", "2D", "2D", "2D", "E", "E"];

  assert.equal(evaluateStandardWinningShape(hand).isWin, true);
  assert.deepEqual(evaluateStandardWinningShape(hand).melds, [
    ["1B", "2B", "3B"],
    ["4B", "5B", "6B"],
    ["7C", "8C", "9C"],
    ["2D", "2D", "2D"],
  ]);
});

test("Standard Winning Shape rejects special-hand-looking hands for MVP", () => {
  const hand = ["1B", "9B", "1C", "9C", "1D", "9D", "E", "S", "W", "N", "RD", "GD", "WD", "WD"];

  assert.deepEqual(evaluateStandardWinningShape(hand), {
    isWin: false,
    reason: "Only the Standard Winning Shape of four melds and one pair is modeled in MVP 1.",
  });
});

test("Automatic Flores Replacement logs the reveal and replacement", () => {
  const round = createDemoRound({
    wall: ["F1", "5B", "6B"],
    players: [{ flowers: [], hand: [] }],
  });

  const result = revealFlores(round, 0);

  assert.equal(result.revealed, "F1");
  assert.equal(result.replacement, "5B");
  assert.deepEqual(round.players[0].flowers, ["F1"]);
  assert.deepEqual(round.players[0].hand, ["5B"]);
  assert.equal(round.log.at(-1).message, "You reveal Flores F1 and draw replacement 5B.");
});

test("Claim Window blocks lower-priority Chow until Win and Pung claims pass", () => {
  const claims = resolveClaimWindow({
    discard: "3B",
    discarder: 0,
    currentPriority: "win",
    candidates: [
      { player: 1, type: "chow", tiles: ["1B", "2B"] },
      { player: 2, type: "pung", tiles: ["3B", "3B"] },
      { player: 3, type: "win", tiles: ["1B", "2B", "3B"] },
    ],
  });

  assert.deepEqual(claims.availableActions, [{ player: 3, type: "win", label: "West may win on 3B" }]);
  assert.deepEqual(claims.blockedActions, [
    {
      player: 2,
      type: "pung",
      reason: "Pung waits until all Win Claims pass.",
    },
    {
      player: 1,
      type: "chow",
      reason: "Chow waits until all Win Claims and Pung claims pass.",
    },
  ]);
});

test("Claim Window exposes Pung after Win claims pass", () => {
  const claims = resolveClaimWindow({
    discard: "3B",
    discarder: 0,
    currentPriority: "pung",
    passed: [{ player: 3, type: "win" }],
    candidates: [
      { player: 1, type: "chow", tiles: ["1B", "2B"] },
      { player: 2, type: "pung", tiles: ["3B", "3B"] },
      { player: 3, type: "win", tiles: ["1B", "2B", "3B"] },
    ],
  });

  assert.deepEqual(claims.availableActions, [{ player: 2, type: "pung", label: "Across may pung 3B" }]);
  assert.deepEqual(claims.blockedActions, [
    {
      player: 1,
      type: "chow",
      reason: "Chow waits until all Pung claims pass.",
    },
  ]);
  assert.ok(claims.auditTrail.includes("West passed Win Claim."));
});
