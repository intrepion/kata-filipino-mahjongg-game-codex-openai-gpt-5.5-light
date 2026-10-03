# ADR 0002: Make Rules Ambiguity and Claim Priority Visible

## Status

Accepted

## Context

The game needs a playable Filipino Mahjongg rules profile, but Filipino Mahjongg has local table variants. A first implementation can become misleading if it silently treats one table's custom as universal.

Claim timing is also central to trust. If a lower-priority action appears before higher-priority claims have passed, the game invites the player to make a move that may not actually be available.

## Decision

The first implementation will encode a coherent Filipino Mahjongg Ruleset and explicitly label unmodeled Local Table Variants instead of silently including them.

Flores will use Automatic Flores Replacement: the game reveals the Flower tile, records it in the activity log, and draws a replacement tile without requiring a separate manual player action.

Each discard will enter an explicit Claim Window. Higher-priority claims will resolve before lower-priority claim buttons appear.

The MVP will use Simple Scoring: legal win detection and hand explanation first, with complete payout math deferred until the rules model is stable.

The table will start as a Four-Seat Table with one human and three Simple Legal AI opponents.

Because the repository is empty, the first coded milestone will be a Static Browser Game rather than a framework application.

## Consequences

The game will be clearer to learn and easier to test, especially around contested discards and blocked claims.

Some table traditions and payout details will be intentionally absent from the MVP. They must be added later as named changes to the Filipino Mahjongg Ruleset rather than as hidden behavior.

The static implementation keeps the first milestone small and directly launchable, but a later framework migration may be worthwhile if the UI or test surface grows beyond what static files can comfortably support.
