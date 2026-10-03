# ADR 0003: Ship the First Rules Slice with Guided Priority

## Status

Accepted

## Context

The first implementation needs to prove that the game can model Filipino Mahjongg turn flow and contested discard behavior before adding richer scoring, persistence, or decorative presentation.

The most important player trust issue is whether the game shows actions at the right time. A lower-priority Chow appearing before higher-priority claims have passed would teach the wrong lesson and make the rules feel arbitrary.

## Decision

The MVP will detect the Standard Winning Shape of four melds and one pair. Special winning hands are excluded until explicitly added as named rules.

The initial Claim Priority order is Win Claim over Pung over Chow. Chow is limited to Next-Player Chow.

The human player will see their own concealed hand. AI players will use Concealed AI Hands, while their exposed melds, Flores, discards, and claim decisions remain visible.

The first build will include both a normal Play Round flow and a Guided Priority Demo that forces a contested discard scenario.

Tiles will begin as Text Tiles for readability. Each page load or new game will start a Fresh Round rather than restoring saved state.

## Consequences

The first coded milestone can be verified through deterministic scenarios: a full playable round and a guided claim-priority demonstration.

This intentionally leaves out special hands, full payout math, illustrated tile art, and save/resume. Those omissions keep the core rules behavior visible and correct before the game expands.

The Guided Priority Demo creates a real-world table-captain moment: the player can watch a tempting lower-priority action stay unavailable until stronger claims have passed.
