# ALTRON Password Inspector

A password generator + strength checker with a sci-fi aurora look. No backend, no build tools, no installs — just open it in a browser.

## Why

Most password generator sites look the same, and half of them you don't fully trust with what you type. This one is offline-first: generating and scoring happen 100% in your browser tab. The only thing that ever touches the network is the opt-in breach check — and even that never sends your password (see below).

## What's in it

**Generate a password**
Pick a length (drag the slider or type a number, 4 to 64), choose the character mix — lowercase, uppercase, digits, symbols — and hit Generate Password. The field starts empty and stays that way until you generate something, so there's no default password sitting there on load. Show reveals it, Copy grabs it, Clear wipes it.

**Inspect your own**
Separate card for passwords you already have. Type or paste one in and the strength meter, checklist, and offline breach screen all update live. Show/Clear here are fully separate from the generator, so pasting never touches what you generated.

**Breach alert**
Two tiers:
- *Offline screen (instant, no network)* — every keystroke is checked against a built-in list of the most commonly breached passwords, plus repeated-character and keyboard-sequence patterns.
- *Online verify (opt-in)* — the "Verify online breach exposure" button queries Have I Been Pwned via k-anonymity: the password is SHA-1 hashed locally and only the first 5 hash characters are sent. A hit shows how many times it appears in known leaks.

**Entropy readout**
The status card shows estimated bits of entropy for your length + character mix, with a plain-English verdict after generating.

## How strength is scored

One point each for: lowercase, uppercase, digits, symbols, length ≥ 15. Out of 5, mapped to Weak / Weak / Average / Strong / Very strong. Quick sanity check, not an audit — pair it with the breach check above for passwords you actually reuse.

## Files

Keep all three together in the same folder, then double-click `index.html` (or drag it into a browser tab):

- `index.html` — markup only
- `styles.css` — all styling
- `script.js` — generation, scoring, breach logic

Note: online breach verify needs internet plus a secure context (`https://` or `localhost`) for hashing. Opened via `file://` it works in most browsers; if yours blocks it you'll get a clear error and the offline screen still works.

## Poking around the code

- Colors/fonts are CSS variables at the top of `styles.css` — reskin from there. Breach-alert styles live in the `Breach alert` section at the bottom.
- Character sets are in the `pools` object at the top of `script.js`.
- Scoring is in `strength()` — easy to swap for something stricter (zxcvbn, entropy-based, whatever).
- Breach logic is `COMMON_PASSWORDS` / `isCommonLocal()` (offline) and `hibpCount()` (online). Tweak the list or timeout there.

Generation uses `crypto.getRandomValues()`, not `Math.random()` — worth keeping if you fork this, since `Math.random()` isn't safe for anything you care about protecting.
