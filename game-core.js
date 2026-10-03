(function attachCore(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.FilipinoMahjonggCore = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createCore() {
  "use strict";

  const SEATS = ["You", "Next", "Across", "West"];
  const SUIT_ORDER = ["B", "C", "D"];

  function tileRank(tile) {
    return Number.parseInt(tile.slice(0, -1), 10);
  }

  function tileSuit(tile) {
    return tile.slice(-1);
  }

  function isFlower(tile) {
    return /^F\d+$/.test(tile);
  }

  function sortTiles(tiles) {
    return [...tiles].sort((a, b) => {
      const suitDiff = SUIT_ORDER.indexOf(tileSuit(a)) - SUIT_ORDER.indexOf(tileSuit(b));
      if (suitDiff !== 0) return suitDiff;
      return tileRank(a) - tileRank(b) || a.localeCompare(b);
    });
  }

  function removeTiles(tiles, toRemove) {
    const remaining = [...tiles];
    for (const tile of toRemove) {
      const index = remaining.indexOf(tile);
      if (index === -1) return null;
      remaining.splice(index, 1);
    }
    return remaining;
  }

  function findMelds(tiles, melds = []) {
    if (tiles.length === 0) return melds;

    const sorted = sortTiles(tiles);
    const first = sorted[0];
    const triplet = [first, first, first];
    const withoutTriplet = removeTiles(sorted, triplet);
    if (withoutTriplet) {
      const result = findMelds(withoutTriplet, [...melds, triplet]);
      if (result) return result;
    }

    const rank = tileRank(first);
    const suit = tileSuit(first);
    const sequence = [`${rank}${suit}`, `${rank + 1}${suit}`, `${rank + 2}${suit}`];
    if (rank >= 1 && rank <= 7 && SUIT_ORDER.includes(suit)) {
      const withoutSequence = removeTiles(sorted, sequence);
      if (withoutSequence) {
        const result = findMelds(withoutSequence, [...melds, sequence]);
        if (result) return result;
      }
    }

    return null;
  }

  function evaluateStandardWinningShape(hand) {
    if (hand.length !== 14) {
      return {
        isWin: false,
        reason: "A Standard Winning Shape needs fourteen tiles.",
      };
    }

    const sorted = sortTiles(hand);
    const uniqueTiles = [...new Set(sorted)];
    for (const tile of uniqueTiles) {
      const pair = [tile, tile];
      const withoutPair = removeTiles(sorted, pair);
      if (!withoutPair) continue;
      const melds = findMelds(withoutPair);
      if (melds && melds.length === 4) {
        return { isWin: true, pair, melds };
      }
    }

    return {
      isWin: false,
      reason: "Only the Standard Winning Shape of four melds and one pair is modeled in MVP 1.",
    };
  }

  function createDemoRound(overrides = {}) {
    return {
      players: overrides.players || [
        { hand: [], flowers: [], melds: [], discards: [] },
        { hand: [], flowers: [], melds: [], discards: [] },
        { hand: [], flowers: [], melds: [], discards: [] },
        { hand: [], flowers: [], melds: [], discards: [] },
      ],
      wall: overrides.wall || [],
      log: overrides.log || [],
      phase: overrides.phase || "playing",
    };
  }

  function drawTile(round) {
    return round.wall.shift() || null;
  }

  function revealFlores(round, playerIndex) {
    const revealed = drawTile(round);
    if (!revealed) {
      round.phase = "draw";
      round.log.push({ type: "draw", message: "The wall is empty. The round ends in an exhaustive draw." });
      return { revealed: null, replacement: null };
    }

    if (!isFlower(revealed)) {
      round.players[playerIndex].hand.push(revealed);
      return { revealed: null, replacement: revealed };
    }

    round.players[playerIndex].flowers.push(revealed);
    const replacement = drawTile(round);
    if (replacement) {
      round.players[playerIndex].hand.push(replacement);
      round.log.push({
        type: "flores",
        message: `${SEATS[playerIndex]} reveal Flores ${revealed} and draw replacement ${replacement}.`,
      });
    } else {
      round.phase = "draw";
      round.log.push({
        type: "draw",
        message: `${SEATS[playerIndex]} reveal Flores ${revealed}, but the wall is empty. The round ends in an exhaustive draw.`,
      });
    }
    return { revealed, replacement };
  }

  function claimRank(type) {
    return { win: 0, pung: 1, chow: 2 }[type];
  }

  function priorityIndex(priority) {
    return claimRank(priority);
  }

  function claimLabel(candidate, discard) {
    if (candidate.type === "win") return `${SEATS[candidate.player]} may win on ${discard}`;
    if (candidate.type === "pung") return `${SEATS[candidate.player]} may pung ${discard}`;
    return `${SEATS[candidate.player]} may chow ${discard}`;
  }

  function blockedReason(type, currentPriority) {
    if (type === "pung" && currentPriority === "win") return "Pung waits until all Win Claims pass.";
    if (type === "chow" && currentPriority === "win") return "Chow waits until all Win Claims and Pung claims pass.";
    if (type === "chow" && currentPriority === "pung") return "Chow waits until all Pung claims pass.";
    return "This claim is blocked by Claim Priority.";
  }

  function resolveClaimWindow({ discard, currentPriority = "win", candidates = [], passed = [] }) {
    const current = priorityIndex(currentPriority);
    const relevant = candidates
      .filter((candidate) => claimRank(candidate.type) >= current)
      .sort((a, b) => claimRank(a.type) - claimRank(b.type) || a.player - b.player);
    const availableActions = relevant
      .filter((candidate) => claimRank(candidate.type) === current)
      .map((candidate) => ({ player: candidate.player, type: candidate.type, label: claimLabel(candidate, discard) }));
    const blockedActions = relevant
      .filter((candidate) => claimRank(candidate.type) > current)
      .map((candidate) => ({
        player: candidate.player,
        type: candidate.type,
        reason: blockedReason(candidate.type, currentPriority),
      }));
    const auditTrail = [
      `Claim Window opens for ${discard}.`,
      ...passed.map((pass) => `${SEATS[pass.player]} passed ${pass.type === "win" ? "Win Claim" : pass.type}.`),
      ...blockedActions.map((action) => `${SEATS[action.player]} ${action.type} blocked: ${action.reason}`),
      ...availableActions.map((action) => action.label),
    ];

    return { availableActions, blockedActions, auditTrail };
  }

  return {
    createDemoRound,
    evaluateStandardWinningShape,
    isFlower,
    resolveClaimWindow,
    revealFlores,
    sortTiles,
  };
});
