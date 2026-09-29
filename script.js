const pools = {
    lc: "abcdefghijklmnopqrstuvwxyz",
    uc: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    dig: "0123456789",
    punc: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
  };
  const active = { lc: true, uc: true, dig: true, punc: true };

  const lenSlider = document.getElementById('lenSlider');
  const lenInput = document.getElementById('lenInput');
  const lenPill = document.getElementById('lenPill');
  const pwOut = document.getElementById('pwOut');
  const genBtn = document.getElementById('genBtn');
  const genBtnText = document.getElementById('genBtnText');
  const clearBtn = document.getElementById('clearBtn');
  const showBtn = document.getElementById('showBtn');
  const copyBtn = document.getElementById('copyBtn');
  const genToast = document.getElementById('genToast');
  const strengthText = document.getElementById('strengthText');
  const segs = [1,2,3,4,5].map(n => document.getElementById('seg'+n));
  const statusDot = document.getElementById('statusDot');
  const statusTitle = document.getElementById('statusTitle');
  const statusSub = document.getElementById('statusSub');
  const entropyVal = document.getElementById('entropyVal');
  const crackTime = document.getElementById('crackTime');

  const checkInput = document.getElementById('checkInput');
  const checkShowBtn = document.getElementById('checkShowBtn');
  const checkClearBtn = document.getElementById('checkClearBtn');
  const checkStrengthText = document.getElementById('checkStrengthText');
  const csegs = [1,2,3,4,5].map(n => document.getElementById('cseg'+n));

  const breachBox = document.getElementById('breachBox');
  const breachIcon = document.getElementById('breachIcon');
  const breachTitle = document.getElementById('breachTitle');
  const breachSub = document.getElementById('breachSub');
  const breachBtn = document.getElementById('breachBtn');

  let pwVisible = false;
  let checkVisible = false;

  function paintSlider(){
    const pct = ((lenSlider.value - 4) / (64 - 4)) * 100;
    lenSlider.style.setProperty('--fill', pct + '%');
  }

  function setLength(val){
    val = Math.max(4, Math.min(64, parseInt(val, 10) || 4));
    lenSlider.value = val;
    lenInput.value = val;
    lenPill.textContent = val;
    paintSlider();
    updateEntropyPreview();
  }
  lenSlider.addEventListener('input', () => setLength(lenSlider.value));
  lenInput.addEventListener('input', () => setLength(lenInput.value));

  function poolSize(){
    let n = 0;
    Object.keys(active).forEach(k => { if (active[k]) n += pools[k].length; });
    return n;
  }
  function updateEntropyPreview(){
    const size = poolSize();
    const len = parseInt(lenInput.value, 10) || 0;
    if (!size) { entropyVal.textContent = '—'; crackTime.textContent = ''; return; }
    if (!pwOut.value) {
      const bits = Math.round(len * Math.log2(size));
      entropyVal.textContent = bits;
      crackTime.textContent = 'estimated for ' + len + ' chars';
    }
  }

  function setStatus(mode, title, sub){
    statusDot.classList.toggle('thinking', mode === 'thinking');
    document.getElementById('statusIcon').innerHTML = mode === 'thinking'
      ? '<circle cx="12" cy="12" r="8" stroke="#ffb454" stroke-width="2.5" stroke-dasharray="12 8" stroke-linecap="round" fill="none"/>'
      : '<path d="M20 6L9 17l-5-5" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    document.querySelector('#statusDot svg').setAttribute('stroke', mode === 'thinking' ? '#ffb454' : '#4ade80');
    statusTitle.textContent = title;
    statusSub.textContent = sub;
  }

  document.querySelectorAll('.toggle').forEach(t => {
    const flip = () => {
      const key = t.dataset.set;
      const count = Object.values(active).filter(Boolean).length;
      if (active[key] && count === 1) return;
      active[key] = !active[key];
      t.classList.toggle('active', active[key]);
      t.setAttribute('aria-checked', active[key]);
      updateEntropyPreview();
    };
    t.addEventListener('click', flip);
    t.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  function securePassword(length, pool) {
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    let out = "";
    for (let i = 0; i < length; i++) out += pool[bytes[i] % pool.length];
    return out;
  }

  function strength(password) {
    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!-\/:-@\[-`{-~]/.test(password)) score++;
    if (password.length >= 15) score++;
    const labels = ["Weak", "Weak", "Average", "Strong", "Very strong"];
    const colors = ["#ff6b8a", "#ff6b8a", "#ffb454", "#45e8d4", "#7df7a2"];
    const idx = Math.max(0, score - 1);
    return { label: labels[idx], color: colors[idx], filled: score };
  }

  function renderStrength(password, segments, label){
    if (!password) {
      segments.forEach(s => { s.style.background = 'rgba(255,255,255,0.08)'; s.style.boxShadow = 'none'; });
      label.textContent = '—';
      label.style.color = 'var(--muted)';
      label.style.borderColor = 'var(--line)';
      label.style.background = 'rgba(255,255,255,0.06)';
      return;
    }
    const { label: text, color, filled } = strength(password);
    segments.forEach((s, i) => {
      s.style.background = i < filled ? color : 'rgba(255,255,255,0.08)';
      s.style.boxShadow = i < filled ? `0 0 12px ${color}66` : 'none';
    });
    label.textContent = text;
    label.style.color = color;
    label.style.borderColor = color + '55';
    label.style.background = color + '14';
  }

  function updateTips(pw){
    const checks = {
      lc: /[a-z]/.test(pw),
      uc: /[A-Z]/.test(pw),
      dig: /[0-9]/.test(pw),
      punc: /[!-\/:-@\[-`{-~]/.test(pw),
      len: pw.length >= 15
    };
    document.querySelectorAll('#tips li').forEach(li => {
      const ok = checks[li.dataset.tip];
      li.classList.toggle('done', !!ok && pw.length > 0);
      li.querySelector('.tick').textContent = (!!ok && pw.length > 0) ? '✓' : '–';
    });
  }

  /* ---------- Breach alert system ----------
     Tier 1 (offline, instant): screen against a built-in list of the most
     commonly breached passwords + obvious sequences. Zero network.
     Tier 2 (online, opt-in): Have I Been Pwned k-anonymity lookup. Only the
     first 5 chars of the SHA-1 hash are sent; the password never leaves. */
  const COMMON_PASSWORDS = new Set([
    "123456", "123456789", "12345678", "12345", "1234567", "1234567890",
    "qwerty", "qwerty123", "password", "password1", "password123", "123123",
    "admin", "letmein", "welcome", "monkey", "dragon", "football", "abc123",
    "111111", "000000", "654321", "jesus", "superman", "michael", "princess",
    "qazwsx", "trustno1", "sunshine", "master", "shadow", "ashley", "bailey",
    "passw0rd", "hunter", "loveme", "whatever", "starwars", "solo", "freedom",
    "charlie", "aa123456", "donald", "flower", "maggie", "ginger", "pepper"
  ]);

  function isCommonLocal(pw) {
    const low = pw.toLowerCase();
    if (COMMON_PASSWORDS.has(low)) return "found in the top-breached password list";
    if (/^(.)\1{3,}$/.test(pw)) return "a single character repeated";
    if (/^(1234+|abcd+|qwer+|asdf+|zxcv+)/.test(low)) return "a simple keyboard sequence";
    return null;
  }

  function setBreach(state, title, subHTML, icon) {
    breachBox.className = "breach is-" + state;
    breachTitle.textContent = title;
    breachSub.innerHTML = subHTML;
    if (icon) breachIcon.textContent = icon;
  }

  function resetBreach() {
    setBreach("idle", "Breach check idle",
      "Type a password — offline screening runs instantly. Use online verify for real breach data.", "🛡️");
    breachBtn.disabled = false;
    breachBtn.textContent = "Verify online breach exposure";
  }

  function refreshLocalBreach(pw) {
    if (!pw) { resetBreach(); return "idle"; }
    const reason = isCommonLocal(pw);
    if (reason) {
      setBreach("breached", "⛔ Breach alert — change it now",
        "This password is <b>" + reason + "</b>. It is cracked in seconds. Do not use it anywhere.", "🚨");
      return "breached";
    }
    setBreach("idle", "No common-pattern hit",
      "Passed the offline screen. <b>Not a guarantee</b> — hit verify below to check real breach data.", "🔍");
    return "idle";
  }

  async function sha1Hex(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-1", data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  async function hibpCount(password) {
    const hash = await sha1Hex(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 9000);
    try {
      const res = await fetch("https://api.pwnedpasswords.com/range/" + prefix, { signal: ctrl.signal });
      if (!res.ok) throw new Error("HIBP HTTP " + res.status);
      const body = await res.text();
      for (const line of body.split("\n")) {
        const parts = line.trim().split(":");
        if (parts[0] === suffix) return parseInt(parts[1].replace(/,/g, ""), 10) || 0;
      }
      return 0;
    } finally {
      clearTimeout(timer);
    }
  }

  breachBtn.addEventListener("click", async () => {
    const pw = checkInput.value;
    if (!pw) {
      setBreach("error", "Nothing to check", "Type or paste a password first, then verify.", "⚠️");
      return;
    }
    if (refreshLocalBreach(pw) === "breached") return; // no need to burn a request
    if (!window.crypto || !crypto.subtle) {
      setBreach("error", "Secure context required",
        "Online verify needs <b>https://</b> or <b>localhost</b> for SHA-1 hashing. Offline screening above still applies.", "⚠️");
      return;
    }
    breachBtn.disabled = true;
    breachBtn.textContent = "Checking…";
    setBreach("checking", "Checking breach database…",
      "Hashing locally, querying HIBP with a 5-char prefix only.", "⏳");
    try {
      const count = await hibpCount(pw);
      if (count > 0) {
        setBreach("breached", "⛔ Found in " + count.toLocaleString() + " breaches",
          "This exact password appears <b>" + count.toLocaleString() + " times</b> in known leaks. Stop using it everywhere.", "🚨");
      } else {
        setBreach("safe", "✅ Not found in breaches",
          "No HIBP record for this password. Still prefer a long, unique, generated one.", "✅");
      }
    } catch (e) {
      setBreach("error", "Check failed — offline?",
        "Could not reach the breach API (" + (e.name === "AbortError" ? "timed out" : "network error") + "). Offline screening still applies; try again later.", "⚠️");
    } finally {
      breachBtn.disabled = false;
      breachBtn.textContent = "Verify online breach exposure";
    }
  });

  function resetOutput(){
    pwOut.value = "";
    pwVisible = false;
    pwOut.type = "password";
    showBtn.textContent = "Show";
    renderStrength("", segs, strengthText);
    entropyVal.textContent = '—';
    crackTime.textContent = '';
    updateEntropyPreview();
    setStatus('idle', 'Ready to generate', 'Pick a mix below and hit generate.');
  }

  function generate() {
    let pool = "";
    Object.keys(active).forEach(k => { if (active[k]) pool += pools[k]; });
    if (!pool) return;
    resetOutput();
    genBtn.disabled = true;
    genBtnText.textContent = 'Forging…';
    setStatus('thinking', 'Forging password…', 'Pulling entropy from your device.');

    setTimeout(() => {
      const length = parseInt(lenInput.value, 10);
      const pw = securePassword(length, pool);
      pwOut.value = pw;
      pwVisible = false;
      pwOut.type = "password";
      showBtn.textContent = "Show";
      renderStrength(pw, segs, strengthText);
      const bits = Math.round(length * Math.log2(pool.length));
      entropyVal.textContent = bits;
      crackTime.textContent = bits >= 80 ? 'excellent — hard to brute-force' : bits >= 60 ? 'solid for most accounts' : 'consider a longer length';
      setStatus('idle', 'Fresh password ready', length + ' chars · ' + strength(pw).label.toLowerCase() + ' · click copy.');
      genBtn.disabled = false;
      genBtnText.textContent = 'Generate password';
    }, 450);
  }

  genBtn.addEventListener('click', generate);
  clearBtn.addEventListener('click', resetOutput);

  showBtn.addEventListener('click', () => {
    if (!pwOut.value) return;
    pwVisible = !pwVisible;
    pwOut.type = pwVisible ? "text" : "password";
    showBtn.textContent = pwVisible ? "Hide" : "Show";
  });

  copyBtn.addEventListener('click', async () => {
    if (!pwOut.value) return;
    try { await navigator.clipboard.writeText(pwOut.value); }
    catch(e){
      pwOut.select(); document.execCommand('copy');
    }
    genToast.classList.add('show');
    copyBtn.textContent = 'Copied ✓';
    setTimeout(() => { genToast.classList.remove('show'); copyBtn.textContent = 'Copy'; }, 1300);
  });

  checkInput.addEventListener('input', () => {
    renderStrength(checkInput.value, csegs, checkStrengthText);
    updateTips(checkInput.value);
    refreshLocalBreach(checkInput.value);
  });
  checkShowBtn.addEventListener('click', () => {
    checkVisible = !checkVisible;
    checkInput.type = checkVisible ? "text" : "password";
    checkShowBtn.textContent = checkVisible ? "Hide" : "Show";
  });
  checkClearBtn.addEventListener('click', () => {
    checkInput.value = "";
    checkVisible = false;
    checkInput.type = "password";
    checkShowBtn.textContent = "Show";
    renderStrength("", csegs, checkStrengthText);
    updateTips("");
    resetBreach();
  });

  resetOutput();
  renderStrength("", csegs, checkStrengthText);
  updateTips("");
  resetBreach();
  paintSlider();
