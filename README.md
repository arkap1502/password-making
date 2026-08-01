# ALTRON Password Inspector

A little password generator + strength checker I built with a sci-fi HUD look, done as one self-contained HTML file. No backend, no build tools, no installs — just open it in a browser.

## Why

Most password generator sites you find online look the same and half of them you don't fully trust with what you type into them. This one runs 100% in your browser tab. Nothing you generate or type ever leaves the page — open dev tools and check the network tab if you don't believe me, there's nothing to see because there are no requests being made.

## What's in it

**Generate a password**
Pick a length (drag the slider or just type a number, 4 to 64), choose which character types you want in the mix — lowercase, uppercase, digits, punctuation — and hit Generate Password. The field starts empty and stays that way until you actually generate something, so there's no default password sitting there when you load the page. Show reveals it, Copy grabs it for your clipboard, Clear wipes it.

**Check a password you already have**
Separate box below the generator. Type or paste a password in and watch the strength meter update live. Same Show/Clear buttons, kept totally separate from the generator so pasting something here never touches what you generated above.

**The little robot**
Sits up top next to the title, blinks and looks around when idle, then does a faster "thinking" animation while a password is being generated. Purely decorative, but it makes the wait (half a second, on purpose, so it doesn't feel instant/fake) feel like something's actually happening.

**The background**
Animated HUD-style rings spinning at different speeds, tick marks, some hex outlines, a pulsing core in the middle — all SVG and CSS, no images. Turns itself off if your OS has reduced motion turned on.

## How strength is scored

Nothing fancy — one point each for: has a lowercase letter, has an uppercase letter, has a digit, has punctuation, is 15+ characters long. That's out of 5, mapped to Weak / Weak / Average / Strong / Very strong. It's a quick sanity check, not a real security audit — it won't know if your password is "Password123!" and has been in every breach dump since 2019. For that you'd want something like Have I Been Pwned.

## Files

- `altron-password-inspector.html` — everything. Just double-click it or drag it into a browser tab.

## Poking around the code

- Colors/fonts are CSS variables right at the top of the `<style>` tag if you want to reskin it.
- The character sets for generation are in the `pools` object near the top of the `<script>` tag.
- The scoring logic is in the `strength()` function — easy to swap for something stricter (zxcvbn, entropy-based scoring, whatever) if you want more than the quick 5-point check.
- The background rings/hex bits get built in `buildHud()` and `buildHexField()` — change the numbers in `ringDefs` if you want more or fewer rings, different speeds, etc.

Generation itself uses `crypto.getRandomValues()`, not `Math.random()` — worth keeping if you ever fork this, since `Math.random()` isn't safe for anything you actually care about protecting.
