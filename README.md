# KEYFORGE — Password Generator & Strength Checker

A single-file, client-side password tool. Generate strong random passwords or check the strength of one you already have — nothing ever leaves the browser.

## Features

- **Generate passwords** with a configurable length (4–64 characters) and choice of character pools:
  - Lowercase (`a-z`)
  - Uppercase (`A-Z`)
  - Digits (`0-9`)
  - Punctuation (`!@#$…`)
  - At least one pool must stay enabled.
- **Check any password** — type or paste a password directly into the field to see its strength, no need to generate one first.
- **Show/Hide toggle** to reveal or mask the password field (masked by default).
- **Copy to clipboard** with one click.
- **Live strength meter** — a 5-segment bar plus a text label (Weak / Average / Strong / Very strong).
- **Blank by default** — the password field is always empty on page load and after clearing; nothing is pre-filled or auto-generated.

## How it works

### Generation
Passwords are generated using the browser's cryptographically secure random number generator, [`crypto.getRandomValues`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues) — **not** a non-cryptographic RNG like Python's `random` module or `Math.random()`, since those are unsafe for generating real secrets.

### Strength scoring
Scoring is rule-based and runs on whatever is in the field, whether generated or typed/pasted. One point is awarded for each of:

| Criterion | Points |
|---|---|
| Contains a lowercase letter | 1 |
| Contains an uppercase letter | 1 |
| Contains a digit | 1 |
| Contains punctuation | 1 |
| Length ≥ 15 characters | 1 |

Total score maps to a band:

| Score | Label |
|---|---|
| 1 | Weak |
| 2 | Weak |
| 3 | Average |
| 4 | Strong |
| 5 | Very strong |

**Note:** This is a generation/scoring tool only — it does **not** check passwords against breach databases or leaked-password lists.

## Privacy

Everything runs locally in the browser tab. No network requests are made, no data is sent to a server, and nothing is stored (no `localStorage`/cookies) — closing or refreshing the tab clears everything.

## Usage

1. Open `keyforge.html` in any modern browser.
2. To generate: adjust the length slider, toggle the character pools you want, and click **Forge Password**.
3. To check your own: click into the password field and type or paste a password — the strength meter updates as you type.
4. Click **Show** to reveal the password in plain text, **Copy** to copy it to your clipboard, or **Clear** to empty the field.

## Files

- `keyforge.html` — the entire app (HTML, CSS, and JS in one file). No build step or dependencies required beyond a font import from Google Fonts.
