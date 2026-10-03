# ADR 0001: Build an Audit-First 2D Rules Table

## Status

Accepted

## Context

The game needs to be recognizably Filipino Mahjongg, not a generic Mahjong-themed interface. The highest-risk parts of the first version are rules correctness, claim timing, claim priority, and helping a player understand why actions are or are not available.

Filipino Mahjongg also has local table variants. If the game starts with ambiguous rules, later implementation can appear complete while quietly teaching or enforcing the wrong behavior.

## Decision

The first version will be a teaching-first playable rules game presented as a 2D browser table. The MVP will prioritize an audit-first table surface: visible hands, discard history, available and blocked claims, recent rule decisions, and a compact activity log.

The first playable milestone must support a full round: deal, draw, discard, legal claims, pass flow, win detection, and a round end. Scoring may begin simplified, but the game must log how the result was reached.

Opponents will begin as simple legal AI, with scripted tutorial openings where needed to demonstrate important Filipino Mahjongg behaviors.

## Consequences

This choice keeps the early work focused on rules clarity and player trust instead of camera, 3D table fidelity, or advanced opponent strategy.

The presentation may be less visually ambitious than a 3D parlor simulation, but it will make the game easier to verify, test, and correct against the selected Filipino Mahjongg Ruleset.

Future 3D presentation, richer character texture, and stronger AI remain possible after the rules model and audit trail are stable.
