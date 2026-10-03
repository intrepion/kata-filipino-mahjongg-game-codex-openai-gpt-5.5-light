# Filipino Mahjongg Game

A dependency-free static browser game that implements the first Filipino Mahjongg MVP slice:

- Four-seat table with one human player and three concealed AI hands.
- Text tiles for legibility.
- Fresh Play Round flow with draw, discard, Flores replacement, discard history, and activity log.
- Guided Priority Demo proving that Win Claim is offered before Pung, and Pung before Next-Player Chow.
- Disabled action reasons and a claim audit trail for contested discards.

## Run

Open `index.html` directly in a browser, or serve the folder locally:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:8765/index.html
```

## Test

```sh
npm test
npm run browser:check
npm run check
```

`npm run check` runs JavaScript syntax checks, the Node rules tests, and the Playwright browser acceptance suite.

## MVP Acceptance

MVP 1 is complete when real browser evidence shows:

- Play Round starts and populates the four-seat table.
- Guided Priority Demo starts with `West may win on 3B`.
- `Across pung` and `Next chow` are disabled while Win Claim priority is unresolved.
- After passing the Win Claim, Pung becomes available and Chow remains disabled.
- After passing Pung, Next-Player Chow becomes available.
