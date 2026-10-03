(function startGame(core) {
  "use strict";

  const seats = ["You", "Next", "Across", "West"];
  const state = {
    round: null,
    lastDiscard: null,
    claimWindow: null,
    demo: null,
    activePlayer: 0,
  };

  const $ = (id) => document.getElementById(id);

  function makeWall() {
    const tiles = [];
    for (const suit of ["B", "C", "D"]) {
      for (let rank = 1; rank <= 9; rank += 1) {
        for (let copy = 0; copy < 4; copy += 1) tiles.push(`${rank}${suit}`);
      }
    }
    for (const honor of ["E", "S", "W", "N", "RD", "GD", "WD"]) {
      for (let copy = 0; copy < 4; copy += 1) tiles.push(honor);
    }
    for (let flower = 1; flower <= 8; flower += 1) tiles.push(`F${flower}`);
    return tiles.sort((a, b) => a.localeCompare(b));
  }

  function newPlayer() {
    return { hand: [], flowers: [], melds: [], discards: [] };
  }

  function addLog(message, type = "info") {
    state.round.log.unshift({ message, type });
  }

  function sortPlayerHand(playerIndex) {
    state.round.players[playerIndex].hand = core.sortTiles(state.round.players[playerIndex].hand);
  }

  function drawIntoHand(playerIndex) {
    if (!state.round.wall.length) {
      state.round.phase = "draw";
      addLog("The wall is empty. The round ends in an exhaustive draw.", "draw");
      return null;
    }
    const next = state.round.wall[0];
    if (core.isFlower(next)) {
      const result = core.revealFlores(state.round, playerIndex);
      sortPlayerHand(playerIndex);
      return result.replacement;
    }
    const tile = state.round.wall.shift();
    state.round.players[playerIndex].hand.push(tile);
    sortPlayerHand(playerIndex);
    return tile;
  }

  function createRound() {
    state.round = core.createDemoRound({
      players: [newPlayer(), newPlayer(), newPlayer(), newPlayer()],
      wall: makeWall(),
      log: [],
      phase: "playing",
    });
    state.lastDiscard = null;
    state.claimWindow = null;
    state.demo = null;
    state.activePlayer = 0;
    for (let draw = 0; draw < 13; draw += 1) {
      for (let player = 0; player < 4; player += 1) drawIntoHand(player);
    }
    drawIntoHand(0);
    addLog("Fresh Round starts with one human player and three Simple Legal AI opponents.");
  }

  function startPlayRound() {
    createRound();
    addLog("Play Round is ready. Discard a tile from your hand.");
    render();
  }

  function startGuidedDemo() {
    createRound();
    state.round.players[0].hand = ["1B", "1C", "1D", "2B", "2C", "2D", "3B", "3C", "3D", "4B", "4C", "4D", "5B", "5C"];
    state.round.players[1].hand = ["1B", "2B", "4C", "5C", "6C", "7D", "8D", "9D", "E", "E", "S", "S", "N"];
    state.round.players[2].hand = ["3B", "3B", "1C", "2C", "3C", "4D", "5D", "6D", "E", "S", "W", "N", "RD"];
    state.round.players[3].hand = ["1B", "2B", "4B", "5B", "6B", "7C", "8C", "9C", "2D", "2D", "2D", "E", "E"];
    for (let player = 0; player < 4; player += 1) sortPlayerHand(player);
    state.demo = {
      discard: "3B",
      currentPriority: "win",
      passed: [],
      candidates: [
        { player: 3, type: "win", tiles: ["1B", "2B", "3B"] },
        { player: 2, type: "pung", tiles: ["3B", "3B"] },
        { player: 1, type: "chow", tiles: ["1B", "2B"] },
      ],
    };
    state.lastDiscard = { tile: "3B", player: 0 };
    state.round.players[0].discards = ["3B"];
    addLog(`West Win Claim is legal: ${describeWin([...state.round.players[3].hand, "3B"])}.`);
    openDemoClaimWindow();
    addLog("Guided Priority Demo starts: Win Claim is checked before Pung, and Chow waits behind both.");
    render();
  }

  function describeWin(hand) {
    const result = core.evaluateStandardWinningShape(hand);
    if (!result.isWin) return result.reason;
    const melds = result.melds.map((meld) => meld.join("-")).join(", ");
    return `${melds}; pair ${result.pair.join("-")}`;
  }

  function nextPlayer(playerIndex) {
    return (playerIndex + 1) % 4;
  }

  function findClaimCandidates(tile, discarder) {
    const candidates = [];
    for (let player = 1; player < 4; player += 1) {
      const winning = core.evaluateStandardWinningShape([...state.round.players[player].hand, tile]);
      if (winning.isWin) candidates.push({ player, type: "win", tiles: [tile] });
    }
    for (let player = 1; player < 4; player += 1) {
      const matches = state.round.players[player].hand.filter((handTile) => handTile === tile);
      if (matches.length >= 2) candidates.push({ player, type: "pung", tiles: [tile, tile] });
    }
    const chowPlayer = nextPlayer(discarder);
    const suit = tile.slice(-1);
    for (let lowRank = 1; lowRank <= 7; lowRank += 1) {
      const sequence = [`${lowRank}${suit}`, `${lowRank + 1}${suit}`, `${lowRank + 2}${suit}`];
      if (!sequence.includes(tile)) continue;
      const needed = sequence.filter((sequenceTile) => sequenceTile !== tile);
      if (needed.every((sequenceTile) => state.round.players[chowPlayer].hand.includes(sequenceTile))) {
        candidates.push({ player: chowPlayer, type: "chow", tiles: needed });
        break;
      }
    }
    return candidates;
  }

  function firstPriority(candidates) {
    if (candidates.some((candidate) => candidate.type === "win")) return "win";
    if (candidates.some((candidate) => candidate.type === "pung")) return "pung";
    return "chow";
  }

  function openClaimWindow(tile) {
    const candidates = findClaimCandidates(tile, 0);
    state.claimWindow = core.resolveClaimWindow({
      discard: tile,
      discarder: 0,
      currentPriority: firstPriority(candidates),
      passed: [],
      candidates,
    });
    if (!state.claimWindow.availableActions.length && !state.claimWindow.blockedActions.length) {
      addLog(`No one claims ${tile}. Next player continues.`);
      advanceAfterUnclaimedDiscard();
    } else {
      for (const entry of state.claimWindow.auditTrail) addLog(entry, "claim");
    }
  }

  function advanceAfterUnclaimedDiscard() {
    if (!state.round || state.round.phase !== "playing") return;
    runAiTurns(1);
  }

  function runAiTurns(startPlayer) {
    let player = startPlayer;
    let safety = 0;
    while (state.round.phase === "playing" && player !== 0 && safety < 18) {
      safety += 1;
      const drawn = drawIntoHand(player);
      if (!drawn) break;
      const win = core.evaluateStandardWinningShape(state.round.players[player].hand);
      if (win.isWin) {
        state.round.phase = "won";
        addLog(`${seats[player]} wins by self-draw: ${describeWin(state.round.players[player].hand)}.`, "win");
        state.claimWindow = null;
        return;
      }
      const discarded = state.round.players[player].hand.shift();
      state.round.players[player].discards.push(discarded);
      state.lastDiscard = { tile: discarded, player };
      addLog(`${seats[player]} draws ${drawn} and discards ${discarded}.`);
      player = nextPlayer(player);
    }
    state.activePlayer = 0;
    if (state.round.phase === "playing") {
      const tile = drawIntoHand(0);
      if (tile) addLog(`Your turn returns. You draw ${tile}; discard to continue.`);
    }
  }

  function openDemoClaimWindow() {
    state.claimWindow = core.resolveClaimWindow({
      discard: state.demo.discard,
      discarder: 0,
      currentPriority: state.demo.currentPriority,
      passed: state.demo.passed,
      candidates: state.demo.candidates,
    });
    for (const entry of state.claimWindow.auditTrail) addLog(entry, "claim");
  }

  function discardHumanTile(tileIndex) {
    if (!state.round || state.round.phase !== "playing") return;
    const [tile] = state.round.players[0].hand.splice(tileIndex, 1);
    state.round.players[0].discards.push(tile);
    state.lastDiscard = { tile, player: 0 };
    addLog(`You discard ${tile}.`);
    const win = core.evaluateStandardWinningShape(state.round.players[0].hand);
    if (win.isWin) {
      state.round.phase = "won";
      state.claimWindow = null;
      addLog(`You win: ${describeWin(state.round.players[0].hand)}.`, "win");
      render();
      return;
    }
    openClaimWindow(tile);
    render();
  }

  function drawForHuman() {
    if (!state.round || state.round.phase !== "playing") return;
    const tile = drawIntoHand(0);
    if (tile) addLog(`You draw ${tile}.`);
    render();
  }

  function passClaim() {
    if (!state.claimWindow) return;
    if (state.demo) {
      const activeAction = state.claimWindow.availableActions[0];
      if (activeAction) {
        state.demo.passed.push({ player: activeAction.player, type: activeAction.type });
        addLog(`${seats[activeAction.player]} passes ${activeAction.type}.`, "claim");
      }
      if (state.demo.currentPriority === "win") {
        state.demo.currentPriority = "pung";
        openDemoClaimWindow();
      } else if (state.demo.currentPriority === "pung") {
        state.demo.currentPriority = "chow";
        openDemoClaimWindow();
      } else {
        addLog("Next may now take the Chow. Claim Priority is fully resolved.", "claim");
      }
    } else {
      addLog("You pass. Claim Window remains visible as an audit record.", "claim");
    }
    render();
  }

  function tileElement(tile, className = "tile") {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = tile;
    return span;
  }

  function renderSeat(index) {
    const player = state.round.players[index];
    const el = $(`seat-${index}`);
    el.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = seats[index];
    el.append(title);

    const meta = document.createElement("div");
    meta.className = "seat-meta";
    meta.textContent = `${player.hand.length} concealed | ${player.flowers.length} Flores | ${player.discards.length} discards`;
    el.append(meta);

    const row = document.createElement("div");
    row.className = "tile-row";
    if (index === 0) {
      player.hand.forEach((tile) => row.append(tileElement(tile)));
    } else {
      player.hand.slice(0, 10).forEach(() => row.append(tileElement("?", "tile-back")));
    }
    el.append(row);

    const discards = document.createElement("div");
    discards.className = "tile-row";
    player.discards.forEach((tile) => discards.append(tileElement(tile)));
    el.append(discards);
  }

  function renderHand() {
    const hand = $("human-hand");
    hand.innerHTML = "";
    if (!state.round) return;
    state.round.players[0].hand.forEach((tile, index) => {
      const button = document.createElement("button");
      button.className = "tile-button";
      button.type = "button";
      button.textContent = tile;
      button.title = `Discard ${tile}`;
      button.addEventListener("click", () => discardHumanTile(index));
      hand.append(button);
    });
  }

  function renderClaims() {
    $("claim-title").textContent = state.claimWindow ? "Claim Window active" : "No active claim window";
    const actions = $("claim-actions");
    const blocked = $("blocked-actions");
    actions.innerHTML = "";
    blocked.innerHTML = "";
    if (!state.claimWindow) return;

    for (const action of state.claimWindow.availableActions) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action.label;
      button.addEventListener("click", () => {
        addLog(`${action.label}. The claim resolves.`, "claim");
        if (action.type === "win") state.round.phase = "won";
        state.claimWindow = null;
        render();
      });
      actions.append(button);
    }

    for (const action of state.claimWindow.blockedActions) {
      const note = document.createElement("div");
      note.className = "blocked-note";
      note.textContent = `${seats[action.player]} ${action.type} disabled: ${action.reason}`;
      blocked.append(note);
    }
  }

  function renderLog() {
    const log = $("activity-log");
    log.innerHTML = "";
    if (!state.round) return;
    state.round.log.slice(0, 24).forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = entry.message;
      log.append(item);
    });
  }

  function render() {
    $("phase-label").textContent = state.round ? state.round.phase : "Ready";
    $("wall-count").textContent = state.round ? String(state.round.wall.length) : "0";
    $("last-discard").textContent = state.lastDiscard ? state.lastDiscard.tile : "None";
    $("draw-button").disabled = !state.round || state.round.phase !== "playing";
    $("pass-button").disabled = !state.claimWindow;
    if (state.round) {
      for (let index = 0; index < 4; index += 1) renderSeat(index);
    }
    renderHand();
    renderClaims();
    renderLog();
  }

  $("play-round-button").addEventListener("click", startPlayRound);
  $("guided-demo-button").addEventListener("click", startGuidedDemo);
  $("draw-button").addEventListener("click", drawForHuman);
  $("pass-button").addEventListener("click", passClaim);
  render();
})(window.FilipinoMahjonggCore);
