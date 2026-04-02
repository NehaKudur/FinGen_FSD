// ─── GAME DATA ────────────────────────────────────────────────────────────────

const PAIRS = [
  ["Savings",        "Money set aside for future use"],
  ["Debt",           "Money you owe to a lender"],
  ["Investment",     "Money used to grow wealth"],
  ["Emergency Fund", "Savings for unexpected events"],
  ["Insurance",      "Protection against financial loss"],
  ["Interest Rate",  "Cost of borrowing money (%)"],
  ["Budget",         "A plan for income & expenses"],
  ["Inflation",      "Rise in prices over time"],
];

const MAX_LIVES = 5;

const CONFETTI_COLORS = [
  '#ff6eb4','#6ee7ff','#b66cff','#fcd34d',
  '#34d399','#f87171','#60a5fa','#fb923c',
  '#a78bfa','#4ade80'
];

const INSIGHTS = {
  win: [
    "You demonstrated strong recall of core financial concepts. Understanding the link between <hi>Savings</hi>, <hi>Emergency Funds</hi>, and <hi>Investment</hi> is the foundation of long-term wealth.",
    "Great performance! Recognising that <hi>Interest Rate</hi> drives the cost of <hi>Debt</hi>, and that <hi>Inflation</hi> erodes purchasing power, shows real financial awareness.",
  ],
  lose: [
    "You stumbled on a few concepts — that is part of learning! Review how <hi>Inflation</hi> affects your <hi>Budget</hi>, and why <hi>Insurance</hi> is a key financial protection tool.",
    "Mistakes reveal gaps, not failure. Focus next on the difference between <hi>Debt</hi> and <hi>Investment</hi> — one costs you money, the other grows it.",
  ],
  finish: [
    "You covered key concepts today. Next step: explore how <hi>Interest Rate</hi> affects both <hi>Debt</hi> repayment and <hi>Investment</hi> returns simultaneously.",
    "Good session! Make sure you are solid on <hi>Emergency Funds</hi> and <hi>Insurance</hi> — they are your financial safety net before you focus on growing wealth.",
  ],
};

// ─── STATE ────────────────────────────────────────────────────────────────────

/*
 * HOW OPTION 3 WORKS:
 *
 * Every tile can be freely peeked (flipped open) at any time — no penalty.
 * The last 2 distinct tiles you click become "selected" (glowing purple border).
 * Clicking a 3rd tile deselects the oldest selected tile and selects the new one.
 * When you're confident, press Lock In → match is evaluated → lives at stake only now.
 * If wrong: only the 2 selected tiles flip back to face-down. All other peeked tiles
 * stay open as memory references until the game ends or you restart.
 */

let selectedTiles = [];   // max 2 — the pair being committed
let peekedTiles   = [];   // all other open tiles (free reference)
let lockInOpen    = false;
let matches       = 0;
let mistakes      = 0;
let score         = 0;
let lives         = MAX_LIVES;
let gameOver      = false;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function updateStats() {
  document.getElementById('mg-matches').textContent  = matches;
  document.getElementById('mg-score').textContent    = score;
  document.getElementById('mg-mistakes').textContent = mistakes;
}

function showLockInBar(show) {
  const bar = document.getElementById('mg-lockin-bar');
  if (show) {
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
  lockInOpen = show;
}

// ─── LIVES ────────────────────────────────────────────────────────────────────

function buildLives() {
  const el = document.getElementById('mg-lives');
  el.innerHTML = '';
  for (let i = 0; i < MAX_LIVES; i++) {
    const h = document.createElement('span');
    h.className = 'mg-heart ' + (i < lives ? 'active' : 'lost');
    h.textContent = '♥';
    el.appendChild(h);
  }
}

function loseLife(refEl) {
  lives--;
  buildLives();
  spawnFloatingHeart(refEl);
}

function spawnFloatingHeart(refEl) {
  const fh = document.createElement('div');
  fh.className = 'float-heart';
  fh.textContent = '♥';
  if (refEl) {
    const rect = refEl.getBoundingClientRect();
    fh.style.left = (rect.left + rect.width / 2 - 12) + 'px';
    fh.style.top  = rect.top + 'px';
  } else {
    fh.style.left = (window.innerWidth  / 2 - 12) + 'px';
    fh.style.top  = (window.innerHeight / 2) + 'px';
  }
  document.body.appendChild(fh);
  fh.addEventListener('animationend', () => fh.remove());
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function spawnConfetti() {
  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left       = Math.random() * 100 + 'vw';
      c.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      c.style.width      = (6 + Math.random() * 9) + 'px';
      c.style.height     = (6 + Math.random() * 9) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = 1.8 + Math.random() * 2;
      c.style.animationDuration = dur + 's';
      c.style.animationDelay    = (Math.random() * 0.6) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), (dur + 0.8) * 1000);
    }, i * 20);
  }
}

// ─── TILE CLICK ───────────────────────────────────────────────────────────────

function handleTileClick(tile) {
  if (gameOver) return;
  if (tile.classList.contains('matched')) return;

  // If already selected, clicking again deselects it (goes back to peeked)
  if (tile.classList.contains('selected')) {
    tile.classList.remove('selected');
    tile.classList.add('peeked');
    selectedTiles = selectedTiles.filter(t => t !== tile);
    peekedTiles.push(tile);
    showLockInBar(selectedTiles.length === 2);
    return;
  }

  // Flip tile open if face-down
  if (!tile.classList.contains('peeked')) {
    tile.classList.add('peeked');
    tile.querySelector('.tile-inner').textContent = tile.dataset.text;
    peekedTiles.push(tile);
  }

  // Now select it as part of the committed pair
  // If already 2 selected, bump the oldest one back to peeked
  if (selectedTiles.length === 2) {
    const bumped = selectedTiles.shift();
    bumped.classList.remove('selected');
    bumped.classList.add('peeked');
    peekedTiles.push(bumped);
  }

  // Remove from peeked pool now that it's selected
  peekedTiles = peekedTiles.filter(t => t !== tile);

  tile.classList.remove('peeked');
  tile.classList.add('selected');
  selectedTiles.push(tile);

  showLockInBar(selectedTiles.length === 2);
}

// ─── LOCK IN ──────────────────────────────────────────────────────────────────

function lockIn() {
  if (selectedTiles.length !== 2) return;

  const [tileA, tileB] = selectedTiles;
  const isMatch = tileA.dataset.group === tileB.dataset.group;

  showLockInBar(false);

  if (isMatch) {
    // ── Correct ──
    matches++;
    score += 10;

    tileA.classList.remove('selected');
    tileB.classList.remove('selected');
    tileA.classList.add('matched');
    tileB.classList.add('matched');

    // Remove from peeked list if they were there
    peekedTiles = peekedTiles.filter(t => t !== tileA && t !== tileB);
    selectedTiles = [];

    updateStats();

    if (matches === PAIRS.length) {
      setTimeout(() => endGame('win'), 500);
    }

  } else {
    // ── Wrong ──
    mistakes++;
    score = Math.max(0, score - 5);
    updateStats();

    // Add red flash to all non-matched tiles
    document.querySelectorAll('.tile').forEach(tile => {
      if (!tile.classList.contains('matched')) {
        tile.classList.add('wrong-flash');
      }
    });

    loseLife(tileA);

    setTimeout(() => {
      // Flip all non-matched tiles back to face-down
      document.querySelectorAll('.tile').forEach(tile => {
        if (!tile.classList.contains('matched')) {
          tile.classList.remove('selected', 'peeked', 'wrong-flash');
          tile.querySelector('.tile-inner').textContent = '?';
        }
      });
      selectedTiles = [];
      peekedTiles = [];

      if (lives <= 0) {
        endGame('lose');
      }
    }, 700);
  }
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function buildChips() {
  const el = document.getElementById('mod-chips');
  el.innerHTML = '';
  PAIRS.forEach(p => {
    const ch = document.createElement('span');
    ch.className = 'mg-learnt-chip';
    ch.textContent = p[0];
    el.appendChild(ch);
  });
}

function buildInsight(result) {
  const pool = INSIGHTS[result] || INSIGHTS.finish;
  const raw  = pool[Math.floor(Math.random() * pool.length)];
  const el   = document.getElementById('mod-insight');
  el.innerHTML = raw.replace(/<hi>(.*?)<\/hi>/g, '<span class="hi">$1</span>');
}

/*
 * ── AI API INTEGRATION (add your key here) ──────────────────────────────────
 *
 * Replace buildInsight() with this async version once you have an API key:
 *
 * async function buildInsight(result) {
 *   const el = document.getElementById('mod-insight');
 *   el.textContent = 'Generating your financial insight...';
 *
 *   const prompt = `You are FinGen, a gamified financial literacy AI coach.
 * A player just completed Financial Mahjong using a strategic Lock In mechanic.
 * Results: Matches: ${matches}/${PAIRS.length}, Mistakes: ${mistakes}, Score: ${score}, Result: ${result}.
 * Concepts covered: Savings, Debt, Investment, Emergency Fund, Insurance, Interest Rate, Budget, Inflation.
 * Write a short 2-3 sentence personalised financial literacy insight. Be encouraging and practical.`;
 *
 *   try {
 *     const res = await fetch("https://api.anthropic.com/v1/messages", {
 *       method: "POST",
 *       headers: {
 *         "Content-Type": "application/json",
 *         "x-api-key": "YOUR_API_KEY_HERE",
 *         "anthropic-version": "2023-06-01"
 *       },
 *       body: JSON.stringify({
 *         model: "claude-sonnet-4-20250514",
 *         max_tokens: 300,
 *         messages: [{ role: "user", content: prompt }]
 *       })
 *     });
 *     const data = await res.json();
 *     el.textContent = data.content.map(b => b.text || '').join('');
 *   } catch(e) {
 *     buildInsightFallback(result);
 *   }
 * }
 * ────────────────────────────────────────────────────────────────────────────
 */

function openModal(result) {
  document.getElementById('mod-matches').textContent  = matches;
  document.getElementById('mod-score').textContent    = score;
  document.getElementById('mod-mistakes').textContent = mistakes;

  if (result === 'win') {
    document.getElementById('modal-badge').textContent  = '🏆';
    document.getElementById('modal-title').innerHTML    = 'You Matched<br>Everything!';
    spawnConfetti();
  } else if (result === 'lose') {
    document.getElementById('modal-badge').textContent  = '💸';
    document.getElementById('modal-title').innerHTML    = 'Out of Lives!<br>Keep Practicing';
  } else {
    document.getElementById('modal-badge').textContent  = '📊';
    document.getElementById('modal-title').innerHTML    = 'Session<br>Summary';
  }

  buildChips();
  buildInsight(result);
  document.getElementById('mg-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('mg-overlay').classList.add('hidden');
}

function endGame(result) {
  gameOver = true;
  showLockInBar(false);
  openModal(result);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

function initGame() {
  matches       = 0;
  mistakes      = 0;
  score         = 0;
  lives         = MAX_LIVES;
  gameOver      = false;
  selectedTiles = [];
  peekedTiles   = [];
  lockInOpen    = false;

  updateStats();
  closeModal();
  showLockInBar(false);
  buildLives();

  const flat = [];
  PAIRS.forEach(p => {
    flat.push({ text: p[0], group: p[0] });
    flat.push({ text: p[1], group: p[0] });
  });
  const shuffled = shuffle(flat);

  const board = document.getElementById('mg-board');
  board.innerHTML = '';

  shuffled.forEach(t => {
    const tile  = document.createElement('div');
    tile.className     = 'mg-tile';
    tile.dataset.group = t.group;
    tile.dataset.text  = t.text;

    const inner = document.createElement('div');
    inner.className    = 'tile-inner';
    inner.textContent  = '?';

    tile.appendChild(inner);
    tile.addEventListener('click', () => handleTileClick(tile));
    board.appendChild(tile);
  });
}

// ─── EVENT LISTENERS ──────────────────────────────────────────────────────────

document.getElementById('mg-lockin-btn').addEventListener('click', lockIn);
document.getElementById('mg-restart').addEventListener('click', initGame);
document.getElementById('mg-finish').addEventListener('click', () => endGame('finish'));
document.getElementById('mod-close').addEventListener('click', closeModal);
document.getElementById('mod-replay').addEventListener('click', initGame);

// ─── START ────────────────────────────────────────────────────────────────────

initGame();