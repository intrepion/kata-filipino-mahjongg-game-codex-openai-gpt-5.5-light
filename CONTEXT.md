# Filipino Mahjongg Game Context

## Glossary

### Filipino Mahjongg Ruleset

The canonical rules profile for this game. It represents Filipino Mahjongg rather than Chinese, Japanese, or generic Mahjong rules. Local table variants are excluded until explicitly chosen and documented.

### Local Table Variant

A rule or scoring behavior that may be used by some Filipino Mahjongg groups but is not part of the current Filipino Mahjongg Ruleset. Local table variants must be named as not yet modeled instead of silently folded into the rules.

### Teaching-First Playable Rules Game

The target first experience: a real playable Mahjongg game that prioritizes learning, correctness, and visible rule explanations over decoration or speed.

### Audit-First Table

A table presentation that keeps the current hand, discard history, claim opportunities, blocked actions, and recent rule decisions visible enough for a player to understand why the game state changed.

### Claim

A player's request to take another player's discard for a legal result such as Chow, Pung, or a winning hand.

### Claim Priority

The ordering that decides which claim is allowed when multiple players could use the same discard. Lower-priority options must not be offered as available actions until higher-priority claims have passed or expired.

### Win Claim

A Claim that uses the latest discard to complete a legal winning hand. In the MVP Claim Priority order, a Win Claim outranks Pung and Chow.

### Claim Window

The explicit period after a discard when eligible players may claim or pass according to Claim Priority. The game resolves higher-priority claims before exposing lower-priority actions.

### Chow

A claim that uses the latest discard to complete a suited sequence, when allowed by the Filipino Mahjongg Ruleset.

### Next-Player Chow

The MVP Chow boundary: only the next player in turn order may Chow a discard, and only after higher-priority Win Claims and Pung claims have passed.

### Pung

A claim that uses the latest discard to complete a triplet, when allowed by the Filipino Mahjongg Ruleset.

### Flores

Flower tiles in the Filipino Mahjongg Ruleset. Their exact handling is part of the selected rules profile and must remain explicit in the rules model.

### Automatic Flores Replacement

The MVP handling for Flores: the game reveals the Flower tile, logs the event, and draws a replacement tile without requiring a separate manual player action.

### Simple Legal AI

An opponent model that only takes legal actions and makes straightforward draw, discard, claim, and pass choices. It is not expected to play strategically well in the first version.

### Scripted Tutorial Opening

A curated early-game sequence used to expose important Filipino Mahjongg concepts, especially claim priority and blocked actions, without requiring a strong AI opponent.

### Guided Priority Demo

A scripted teaching mode that creates a contested discard scenario so the player can see Claim Priority, blocked lower-priority actions, passes, and the final allowed claim.

### Full Round

A playable unit that includes dealing, drawing, discarding, legal claims, win detection, and a round end. Scoring may be simplified at first, but the game must log how the result was reached.

### Standard Winning Shape

The MVP winning hand shape: four melds and one pair. Special winning hands are Local Table Variants until explicitly added to the Filipino Mahjongg Ruleset.

### Simple Scoring

The MVP result model that distinguishes a legal win from a non-win and explains the winning hand without attempting complete Filipino Mahjongg payout math.

### Four-Seat Table

The default table shape for the MVP: one human player and three Simple Legal AI opponents.

### Static Browser Game

The first implementation target for this empty repository: a dependency-free browser game using ordinary static files before introducing a framework.

### Concealed AI Hand

An opponent hand whose tiles are hidden from the human player. The AI player's melds, Flores, discards, and claim decisions remain visible.

### Text Tile

A legible tile representation that uses text or simple symbols instead of illustrated tile art.

### Fresh Round

The MVP session model where each page load or new game starts a new Full Round instead of restoring saved state.
