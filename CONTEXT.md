# Filipino Mahjongg Game Context

## Glossary

### Filipino Mahjongg Ruleset

The canonical rules profile for this game. It represents Filipino Mahjongg rather than Chinese, Japanese, or generic Mahjong rules. Local table variants are excluded until explicitly chosen and documented.

### Teaching-First Playable Rules Game

The target first experience: a real playable Mahjongg game that prioritizes learning, correctness, and visible rule explanations over decoration or speed.

### Audit-First Table

A table presentation that keeps the current hand, discard history, claim opportunities, blocked actions, and recent rule decisions visible enough for a player to understand why the game state changed.

### Claim

A player's request to take another player's discard for a legal result such as Chow, Pung, or a winning hand.

### Claim Priority

The ordering that decides which claim is allowed when multiple players could use the same discard. Lower-priority options must not be offered as available actions until higher-priority claims have passed or expired.

### Chow

A claim that uses the latest discard to complete a suited sequence, when allowed by the Filipino Mahjongg Ruleset.

### Pung

A claim that uses the latest discard to complete a triplet, when allowed by the Filipino Mahjongg Ruleset.

### Flores

Flower tiles in the Filipino Mahjongg Ruleset. Their exact handling is part of the selected rules profile and must remain explicit in the rules model.

### Simple Legal AI

An opponent model that only takes legal actions and makes straightforward draw, discard, claim, and pass choices. It is not expected to play strategically well in the first version.

### Scripted Tutorial Opening

A curated early-game sequence used to expose important Filipino Mahjongg concepts, especially claim priority and blocked actions, without requiring a strong AI opponent.

### Full Round

A playable unit that includes dealing, drawing, discarding, legal claims, win detection, and a round end. Scoring may be simplified at first, but the game must log how the result was reached.
