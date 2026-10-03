# ADR 0004: Verify Claim Priority in the Browser

## Status

Accepted

## Context

The MVP is teaching-first, so the implementation cannot be considered complete just because the rules code passes syntax checks. The most important user-facing behavior is whether the table makes contested claims understandable.

The game also needs honest round endings. A Full Round can end either with a win or with the wall running out.

## Decision

MVP 1 is complete only after real browser evidence proves that Play Round starts and the Guided Priority Demo blocks lower-priority claims until higher-priority claims pass.

If the wall runs out before a win, the MVP will end the round as an Exhaustive Draw and explain it in the activity log.

Simple Legal AI will use Simple Claim AI: claim the first legal Win Claim, otherwise claim the first legal Pung, and pass on Chow unless a scripted tutorial scenario requires Chow.

Unavailable human actions will remain visible as disabled controls with Disabled Action Reasons.

Every Claim Window will produce a Claim Audit Trail showing priority, passes, blocked actions, and the final claim decision.

After these decisions, the design frontier is closed enough to build the first Static Browser Game slice.

## Consequences

The first implementation has a concrete acceptance gate tied to the real player experience instead of only to internal code behavior.

Disabled actions and audit logs may make the interface denser, but that density serves the teaching goal: the player should learn why a tempting claim is unavailable.

The MVP deliberately avoids advanced AI and full payout math so the claim-priority behavior can be implemented, tested, and corrected first.
