# ALTRON // Password Inspector

A single-file, client-side password generator and strength checker with a futuristic HUD-style interface.

## What it does

- **Generate** — builds a cryptographically random password from a length you choose (4–64, via slider or number box) and a mix of character pools (lowercase, uppercase, digits, punctuation). The output field stays blank until you press **Generate Password**, and clears again on **Clear**.
- **Check your own password** — a separate field where you can type or paste any password to see its strength, without ever touching the generator.
- **Strength meter** — a 5-segment bar scored on: lowercase present, uppercase present, digit present, punctuation present, length ≥ 15. Bands run Weak → Weak → Average → Strong → Very strong. Both the generator and the checker use the same scoring logic, independently.
- **Show / Copy** — each password field has its own Show button (toggles masking), placed directly under its bar. The generated password also gets a Copy button that copies to the clipboard and shows a brief confirmation.
- **Robot indicator** — a small animated robot idles with a scanning-eye/blink animation, and switches to a faster "thinking" pulse while a password is being generated.
- **HUD background** — an animated radial interface built from spinning concentric rings, tick marks, and hex outlines, rendered with SVG and CSS, styled after a sci-fi HUD look. Automatically disables its animations if the OS "reduce motion" setting is on.

## Privacy / security notes

- Everything runs **entirely in the browser tab**. No password, generated or typed, is ever sent over the network — there are no network calls in this file at all.
- Random generation uses the Web Crypto API (`crypto.getRandomValues`), not `Math.random()`, so output is suitable for real secrets.
- The strength check is a simple local rule-of-thumb (character variety + length), not a breach-database or leaked-password check. It won't catch things like reused or dictionary-based passwords.
- Nothing is stored — passwords exist only in memory in the page and disappear on refresh or Clear.

## Files

- `altron-password-inspector.html` — the entire app (HTML, CSS, and JavaScript in one file). Open it directly in any modern browser; no build step or server required.

## Usage

1. Open `altron-password-inspector.html` in a browser.
2. **To generate:** set a length, pick which character types to include (at least one must stay on), click **Generate Password**, then **Show** (under the bar) to reveal it or **Copy** to copy it.
3. **To check an existing password:** type or paste it into the "Check your own password" field and read the strength meter as you type; use **Show** underneath to reveal what you typed.

## Customizing

All values live in one HTML file:
- Colors and fonts are CSS variables at the top of the `<style>` block (`--cyan`, `--amber`, `--bg`, etc.).
- The character pools used for generation are defined in the `pools` object near the top of the `<script>` block.
- The strength scoring rules are in the `strength()` function.
- The HUD background rings, tick counts, and hex spots are generated in `buildHud()` and `buildHexField()`.
