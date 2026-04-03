/* ============================================
   FINGEN — PORTFOLIO PANIC UNO
   script.js — Full Game Logic
   ============================================ */

'use strict';

// ===== CONSTANTS =====
const COLORS       = ['red', 'blue', 'yellow', 'green'];
const COLOR_NAMES  = { red: 'STOCKS', blue: 'BONDS', yellow: 'CRYPTO', green: 'REAL ESTATE' };
const COLOR_EMOJIS = { red: '📈', blue: '📊', yellow: '🪙', green: '🏠' };
const ACTION_ICONS = { skip: '⏭', reverse: '🔄', draw2: '💳', wild: '🃏', wildDraw4: '💥' };
const ACTION_LABELS = {
    skip:      'MKT FREEZE',
    reverse:   'REVERSAL',
    draw2:     'DEBT TRAP',
    wild:      'DIVERSIFY',
    wildDraw4: 'ECO SHOCK'
};

// ===== GAME STATE =====
let drawPile    = [];
let discardPile = [];
let playerHand  = [];
let computerHand= [];
let currentColor  = '';
let currentTurn   = 'player'; // 'player' | 'computer'
let marketMood    = 'bull';   // 'bull'  | 'bear' | 'volatile'
let moodCounter   = 0;
let hasDrawnThisTurn = false;
let pendingWild   = null;     // { draw4: bool } set when player plays wild
let gameActive    = false;

// Stats for AI feedback
let stats = {};

function resetStats() {
    stats = {
        playerWilds:   0,
        playerActions: 0,
        playerHighCards: 0,
        playerLowCards:  0,
        playerDraws:   0,
        debtTraps:     0,
        moodFlips:     0,
        turns:         0,
    };
}

// ===== DECK BUILDER =====
function buildDeck() {
    const deck = [];
    let uid = 0;

    COLORS.forEach(color => {
        // Numbers 1–9 × 2
        for (let n = 1; n <= 9; n++) {
            for (let k = 0; k < 2; k++) {
                deck.push({ id: uid++, color, type: 'number', value: n });
            }
        }
        // Action cards × 2
        ['skip', 'reverse', 'draw2'].forEach(action => {
            for (let k = 0; k < 2; k++) {
                deck.push({ id: uid++, color, type: action, value: 20 });
            }
        });
    });

    // Wild × 4 and Wild Draw 4 × 4
    for (let k = 0; k < 4; k++) {
        deck.push({ id: uid++, color: 'wild', type: 'wild',      value: 50 });
        deck.push({ id: uid++, color: 'wild', type: 'wildDraw4', value: 50 });
    }

    return deck;
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ===== INIT =====
function initGame() {
    drawPile  = shuffle(buildDeck());
    discardPile   = [];
    playerHand    = [];
    computerHand  = [];
    currentTurn   = 'player';
    marketMood    = 'bull';
    moodCounter   = 0;
    hasDrawnThisTurn = false;
    pendingWild   = null;
    gameActive    = true;
    resetStats();

    // Deal 7 cards each
    for (let i = 0; i < 7; i++) {
        playerHand.push(drawPile.pop());
        computerHand.push(drawPile.pop());
    }

    // Starting discard — must be a number card
    let startCard;
    while (true) {
        startCard = drawPile.pop();
        if (startCard.type === 'number') break;
        drawPile.unshift(startCard); // put back at bottom
    }
    discardPile.push(startCard);
    currentColor = startCard.color;

    // Clear log
    document.getElementById('log-entries').innerHTML = '';
    addLog('system', '🎮', 'Game started! Your turn. Select a glowing card to play it.');

    updateMoodDisplay();
    renderAll();
}

// ===== PLAYABILITY =====
function topCard() {
    return discardPile[discardPile.length - 1];
}

function canPlay(card) {
    if (card.color === 'wild') return true;
    const top = topCard();
    if (card.color === currentColor) return true;
    if (card.type === 'number' && top.type === 'number' && card.value === top.value) return true;
    if (card.type !== 'number' && card.type === top.type) return true;
    return false;
}

function hasPlayable(hand) {
    return hand.some(c => canPlay(c));
}

// ===== PLAY CARD =====
function playCard(card, handIndex, isPlayer) {
    // Remove from hand and add to discard
    const hand = isPlayer ? playerHand : computerHand;
    hand.splice(handIndex, 1);
    discardPile.push(card);

    // Update active colour (non-wild cards set it immediately)
    if (card.color !== 'wild') currentColor = card.color;

    // Track stats
    stats.turns++;
    moodCounter++;
    if (moodCounter >= 4) { moodCounter = 0; advanceMood(); }

    if (isPlayer) {
        if (card.type === 'wild' || card.type === 'wildDraw4') stats.playerWilds++;
        if (['skip','reverse','draw2','wildDraw4'].includes(card.type)) stats.playerActions++;
        if (card.type === 'number' && card.value >= 7) stats.playerHighCards++;
        if (card.type === 'number' && card.value <= 3) stats.playerLowCards++;
    }

    // Log
    const label = cardLabel(card);
    const icon  = card.color !== 'wild' ? COLOR_EMOJIS[card.color] : ACTION_ICONS[card.type];
    addLog(isPlayer ? 'player' : 'computer',
           icon,
           `${isPlayer ? 'You' : 'Computer'} played ${label}`);

    // Wild cards: pause and ask player for colour (or AI picks)
    if (card.type === 'wild' || card.type === 'wildDraw4') {
        if (isPlayer) {
            pendingWild = { draw4: card.type === 'wildDraw4' };
            showColorModal();
            return; // wait for colour selection
        } else {
            const chosen = aiChooseColor();
            currentColor = chosen;
            addLog('event', '🔄', `DIVERSIFY! Computer switches to ${COLOR_NAMES[chosen]}`);
            if (card.type === 'wildDraw4') {
                dealCards(playerHand, 4);
                stats.playerDraws += 4;
                stats.debtTraps++;
                addLog('event', '💥', `ECONOMIC SHOCK! You draw 4 cards and lose your turn!`);
                finishTurn(false, true);  // opponent (player) loses turn
                return;
            }
            finishTurn(false, false);
            return;
        }
    }

    // Effect of non-wild action cards
    let skipOpponent = false;
    switch (card.type) {
        case 'skip':
            skipOpponent = true;
            addLog('event', '⏭', isPlayer
                ? 'MARKET FREEZE! Computer loses its turn.'
                : 'MARKET FREEZE! You lose your turn!');
            break;

        case 'reverse':
            // In 2-player, reverse = skip for the opponent
            skipOpponent = true;
            advanceMood();
            stats.moodFlips++;
            addLog('event', '🔄', 'MARKET REVERSAL! Mood flipped!');
            break;

        case 'draw2':
            skipOpponent = true;
            stats.debtTraps++;
            if (isPlayer) {
                dealCards(computerHand, 2);
                addLog('event', '💳', 'DEBT TRAP! Computer draws 2 cards and loses a turn.');
            } else {
                dealCards(playerHand, 2);
                stats.playerDraws += 2;
                addLog('event', '💳', 'DEBT TRAP! You draw 2 liability cards and lose a turn!');
            }
            break;
    }

    updatePortfolios();
    if (checkWin()) return;
    finishTurn(isPlayer, skipOpponent);
}

// Helper: give cards from drawPile to a hand
function dealCards(hand, count) {
    for (let i = 0; i < count; i++) {
        if (drawPile.length === 0) reshuffleDeck();
        if (drawPile.length === 0) break;
        hand.push(drawPile.pop());
    }
}

// Advance turns
function finishTurn(isPlayer, skipOpponent) {
    hasDrawnThisTurn = false;

    // skipOpponent = the other side loses their turn, so same side plays again
    if (skipOpponent) {
        currentTurn = isPlayer ? 'player' : 'computer';
    } else {
        currentTurn = isPlayer ? 'computer' : 'player';
    }

    renderAll();

    if (currentTurn === 'computer') {
        setTimeout(computerTurn, 1400);
    }
}

// ===== DRAW CARD (player action) =====
function drawCard() {
    if (!gameActive || currentTurn !== 'player') return;
    if (hasDrawnThisTurn) {
        addLog('system', '⚠️', 'Already drew this turn. Play the card or pass.');
        return;
    }
    if (drawPile.length === 0) reshuffleDeck();
    if (drawPile.length === 0) { addLog('system', '⚠️', 'Draw pile is empty!'); return; }

    const card = drawPile.pop();
    playerHand.push(card);
    stats.playerDraws++;
    hasDrawnThisTurn = true;

    addLog('player', '📥', 'You drew a card from the market.');

    if (canPlay(card)) {
        addLog('system', '💡', 'The drawn card can be played — click it!');
    } else {
        document.getElementById('pass-btn').disabled = false;
        addLog('system', '💡', 'Card cannot be played. Click PASS TURN to continue.');
    }

    updatePortfolios();
    renderAll();
}

// ===== PASS TURN =====
function passTurn() {
    if (!gameActive || currentTurn !== 'player' || !hasDrawnThisTurn) return;
    hasDrawnThisTurn = false;
    document.getElementById('pass-btn').disabled = true;
    addLog('system', '⏭', 'You passed your turn.');
    currentTurn = 'computer';
    renderAll();
    setTimeout(computerTurn, 1400);
}

// ===== COMPUTER AI =====
function computerTurn() {
    if (!gameActive || currentTurn !== 'computer') return;

    const playable = computerHand
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => canPlay(card));

    if (playable.length === 0) {
        // Draw one card
        if (drawPile.length === 0) reshuffleDeck();
        if (drawPile.length > 0) {
            const drawn = drawPile.pop();
            computerHand.push(drawn);
            addLog('computer', '📥', 'Computer drew a card.');

            if (canPlay(drawn)) {
                setTimeout(() => {
                    const idx = computerHand.length - 1;
                    playCard(computerHand[idx], idx, false);
                }, 900);
            } else {
                addLog('computer', '⏭', 'Computer passed its turn.');
                currentTurn = 'player';
                hasDrawnThisTurn = false;
                renderAll();
            }
        }
        return;
    }

    // AI strategy
    let chosen = null;

    // 1. If player has ≤3 cards → prefer Wild+4
    if (playerHand.length <= 3) {
        chosen = playable.find(p => p.card.type === 'wildDraw4') || null;
    }
    // 2. If player has ≤4 cards → prefer Draw2 / Skip
    if (!chosen && playerHand.length <= 4) {
        chosen = playable.find(p => ['draw2','skip'].includes(p.card.type)) || null;
    }
    // 3. Bull market → play highest number
    if (!chosen && marketMood === 'bull') {
        const nums = playable.filter(p => p.card.type === 'number');
        if (nums.length) chosen = nums.reduce((a, b) => a.card.value >= b.card.value ? a : b);
    }
    // 4. Bear market → play lowest number
    if (!chosen && marketMood === 'bear') {
        const nums = playable.filter(p => p.card.type === 'number');
        if (nums.length) chosen = nums.reduce((a, b) => a.card.value <= b.card.value ? a : b);
    }
    // 5. Fallback: random playable card
    if (!chosen) {
        chosen = playable[Math.floor(Math.random() * playable.length)];
    }

    // Small UNO check for computer
    if (computerHand.length - 1 === 1) {
        addLog('computer', '📣', 'Computer calls UNO!');
        document.getElementById('computer-uno').classList.remove('hidden');
        setTimeout(() => document.getElementById('computer-uno').classList.add('hidden'), 2500);
    }

    playCard(chosen.card, chosen.index, false);
}

function aiChooseColor() {
    const counts = { red: 0, blue: 0, yellow: 0, green: 0 };
    computerHand.forEach(c => { if (counts[c.color] !== undefined) counts[c.color]++; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

// ===== WILD COLOUR SELECTION =====
function showColorModal() {
    document.getElementById('color-modal').classList.remove('hidden');
}

function selectWildColor(color) {
    document.getElementById('color-modal').classList.add('hidden');
    currentColor = color;

    const isDraw4 = pendingWild?.draw4;
    pendingWild = null;

    addLog('player', '🃏', `DIVERSIFY! You switch to ${COLOR_NAMES[color]}`);

    if (isDraw4) {
        dealCards(computerHand, 4);
        stats.debtTraps++;
        addLog('event', '💥', `ECONOMIC SHOCK! Computer draws 4 cards!`);
    }

    updatePortfolios();
    if (checkWin()) return;

    // Wild+4: opponent (computer) loses turn → player goes again
    // Wild: opponent (computer) takes turn
    hasDrawnThisTurn = false;
    currentTurn = isDraw4 ? 'player' : 'computer';
    renderAll();

    if (currentTurn === 'computer') {
        setTimeout(computerTurn, 1400);
    }
}

// ===== UNO CALL =====
function callUno() {
    if (!gameActive) return;
    if (playerHand.length === 1) {
        addLog('player', '📣', 'UNO! You declared UNO!');
        const badge = document.getElementById('player-uno');
        badge.classList.remove('hidden');
        setTimeout(() => badge.classList.add('hidden'), 3000);
    } else {
        addLog('system', '⚠️', 'You can only call UNO with exactly 1 card left!');
    }
}

// ===== MARKET MOOD =====
function advanceMood() {
    const cycle = ['bull', 'bear', 'volatile'];
    marketMood = cycle[(cycle.indexOf(marketMood) + 1) % 3];
    updateMoodDisplay();
}

function updateMoodDisplay() {
    const info = {
        bull:     { emoji: '📈', text: 'BULL MARKET', tip: 'High-value assets (7-9) earn bonus', cls: 'mood-bull' },
        bear:     { emoji: '📉', text: 'BEAR MARKET', tip: 'Safe, low-risk assets (1-3) preferred', cls: 'mood-bear' },
        volatile: { emoji: '🌀', text: 'VOLATILE',    tip: 'Action cards carry maximum impact!',   cls: 'mood-volatile' },
    }[marketMood];

    document.querySelector('.mood-emoji').textContent = info.emoji;
    document.getElementById('mood-text').textContent  = info.text;
    document.getElementById('mood-tip').textContent   = info.tip;
    document.getElementById('mood-display').className = `mood-indicator ${info.cls}`;
}

// ===== PORTFOLIO VALUES =====
function updatePortfolios() {
    const pVal = Math.max(0, 100000 - playerHand.length   * 5000);
    const cVal = Math.max(0, 100000 - computerHand.length * 5000);
    document.getElementById('player-portfolio').textContent   = `₹${pVal.toLocaleString('en-IN')}`;
    document.getElementById('computer-portfolio').textContent = `₹${cVal.toLocaleString('en-IN')}`;
}

// ===== WIN CHECK =====
function checkWin() {
    if (playerHand.length   === 0) { endGame('player');   return true; }
    if (computerHand.length === 0) { endGame('computer');  return true; }
    return false;
}

function endGame(winner) {
    gameActive = false;
    const win = winner === 'player';

    document.getElementById('gameover-title').textContent  = win ? '🏆 PORTFOLIO LIQUIDATED!' : '📉 MARKET CRASH!';
    const resultEl = document.getElementById('gameover-result');
    resultEl.textContent  = win ? 'YOU WIN!' : 'COMPUTER WINS';
    resultEl.className    = `gameover-result ${win ? 'win' : 'lose'}`;

    document.getElementById('ai-feedback').textContent   = generateFeedback(win);
    document.getElementById('gameover-stats').innerHTML  = `
        <div>🃏 Wilds Played: ${stats.playerWilds}</div>
        <div>⚡ Actions Used: ${stats.playerActions}</div>
        <div>📥 Cards Drawn: ${stats.playerDraws}</div>
        <div>🔄 Mood Flips: ${stats.moodFlips}</div>
    `;

    document.getElementById('gameover-modal').classList.remove('hidden');
}

function generateFeedback(playerWon) {
    const diversified  = stats.playerWilds   >= 2;
    const aggressive   = stats.playerActions >= 3;
    const overDrawer   = stats.playerDraws   >= 8;
    const highRisk     = stats.playerHighCards > stats.playerLowCards;
    const lowRisk      = stats.playerLowCards  > stats.playerHighCards;

    if (playerWon) {
        if (diversified && aggressive) {
            return "Outstanding portfolio management! Your aggressive use of action cards combined with smart asset diversification (Wild cards) mirrors the strategy of top fund managers — balance offense with adaptability. In real finance, this translates to actively rebalancing your portfolio while managing downside risk.";
        }
        if (diversified) {
            return "Strong instinct for diversification! Frequently shifting asset classes via Wild cards demonstrates awareness that no single asset class performs best in all conditions. In real investing, spreading risk across stocks, bonds, and alternative assets is the foundation of resilient wealth-building.";
        }
        if (aggressive) {
            return "Effective use of action cards — you disrupted the opponent's portfolio at critical moments. However, in real finance, aggressive debt-trapping strategies (high-yield, high-risk moves) can backfire during market downturns. Balance your aggression with a safe-haven allocation.";
        }
        return "Solid, consistent play. You read the market mood well and made steady decisions. In real finance, disciplined, low-emotion decision-making is often more profitable than flashy trades. Continue building this foundation.";
    } else {
        if (overDrawer) {
            return "You drew too many cards, suggesting a reactive rather than proactive financial strategy. In investing, waiting for the 'perfect' moment often means missing opportunities entirely. Focus on playing cards earlier — in finance this means deploying capital before the window closes.";
        }
        if (highRisk && marketMood !== 'bull') {
            return "You favoured high-risk, high-value assets even during Bear and Volatile market phases — a classic timing error. Real financial losses often occur when investors hold aggressive positions through downturns instead of rotating into safer assets. Market awareness is everything.";
        }
        if (lowRisk) {
            return "Your conservative, low-risk approach kept your portfolio stable, but it wasn't enough to outpace the computer. In finance, overly safe strategies during Bull markets leave returns on the table. Learn to shift from defence to offence when market conditions favour growth.";
        }
        return "Tough round! The computer managed its assets more efficiently. Focus on identifying playable cards sooner, using action cards strategically, and diversifying with Wilds when you're stuck. In real finance: liquidity, agility, and timing are the three keys to surviving market pressure.";
    }
}

// ===== RESHUFFLE =====
function reshuffleDeck() {
    if (discardPile.length <= 1) return;
    const top = discardPile.pop();
    drawPile   = shuffle(discardPile);
    discardPile = [top];
    addLog('system', '🔀', 'Discard pile reshuffled into draw pile.');
}

// ===== RENDER =====
function renderAll() {
    renderPlayerHand();
    renderComputerHand();
    renderDiscardPile();
    renderColorDisplay();
    updatePortfolios();
    updateCounts();
    updateTurnIndicator();
}

function cardLabel(card) {
    if (card.type === 'number')    return `${COLOR_NAMES[card.color]} Lv.${card.value}`;
    if (card.color !== 'wild')     return `${COLOR_NAMES[card.color]} ${ACTION_LABELS[card.type]}`;
    return ACTION_LABELS[card.type];
}

function buildCardEl(card, index, isPlayerCard) {
    const el  = document.createElement('div');
    const ccls = card.color === 'wild' ? 'card-wild' : `card-${card.color}`;
    const playable = isPlayerCard && canPlay(card) && currentTurn === 'player' && gameActive;
    const disabled = isPlayerCard && !canPlay(card);

    el.className = `card ${ccls} ${disabled ? 'card-disabled' : ''} ${playable ? 'card-playable' : ''}`;

    if (card.type === 'number') {
        el.innerHTML = `
            <div class="card-corner tl">${card.value}</div>
            <div class="card-number">${card.value}</div>
            <div class="card-subtype">${COLOR_NAMES[card.color]}</div>
            <div class="card-corner br">${card.value}</div>
        `;
    } else {
        const icon  = ACTION_ICONS[card.type]  || '?';
        const label = ACTION_LABELS[card.type] || card.type;
        const sub   = card.color !== 'wild' ? `<div class="card-subtype">${COLOR_NAMES[card.color]}</div>` : '';
        el.innerHTML = `
            <div class="card-action-icon">${icon}</div>
            <div class="card-action-label">${label}</div>
            ${sub}
        `;
    }

    if (isPlayerCard && playable) {
        el.title   = `Play: ${cardLabel(card)}`;
        el.onclick = () => handleCardClick(card, index);
    } else if (isPlayerCard && disabled) {
        el.title = 'Cannot play — wrong colour/type';
    }

    return el;
}

function handleCardClick(card, index) {
    if (!gameActive || currentTurn !== 'player') return;
    if (!canPlay(card)) return;

    // UNO reminder
    if (playerHand.length === 2) {
        addLog('system', '💡', 'Tip: If this is your last card, call UNO first!');
    }

    playCard(card, index, true);
}

function renderPlayerHand() {
    const container = document.getElementById('player-hand');
    container.innerHTML = '';
    playerHand.forEach((card, i) => container.appendChild(buildCardEl(card, i, true)));
    document.getElementById('player-card-count').textContent = playerHand.length;

    const badge = document.getElementById('player-uno');
    if (playerHand.length === 1 && gameActive) badge.classList.remove('hidden');
    else badge.classList.add('hidden');
}

function renderComputerHand() {
    const container = document.getElementById('computer-hand');
    container.innerHTML = '';
    const show = Math.min(computerHand.length, 15);
    for (let i = 0; i < show; i++) {
        const el = document.createElement('div');
        el.className = 'card card-back';
        el.innerHTML = '<div class="card-back-inner">💼</div>';
        container.appendChild(el);
    }
    document.getElementById('computer-card-count').textContent = computerHand.length;
}

function renderDiscardPile() {
    const container = document.getElementById('discard-pile');
    container.innerHTML = '';
    if (discardPile.length > 0) {
        container.appendChild(buildCardEl(topCard(), -1, false));
    }
}

function renderColorDisplay() {
    document.getElementById('color-indicator').className = `color-indicator color-${currentColor}`;
    document.getElementById('color-name').textContent    = COLOR_NAMES[currentColor] || currentColor.toUpperCase();
}

function updateCounts() {
    document.getElementById('draw-count').textContent = `${drawPile.length} cards`;
}

function updateTurnIndicator() {
    const el = document.getElementById('turn-indicator');
    const passBtn = document.getElementById('pass-btn');

    if (!gameActive) {
        el.textContent = 'GAME OVER';
        el.className   = 'turn-indicator';
        passBtn.disabled = true;
        return;
    }

    if (currentTurn === 'player') {
        el.innerHTML = '<span class="turn-arrow">▶</span> YOUR TURN — PLAY A CARD OR DRAW FROM PILE';
        el.className = 'turn-indicator';
        passBtn.disabled = !hasDrawnThisTurn;
    } else {
        el.innerHTML = '<span class="turn-arrow">⏳</span> COMPUTER IS TRADING...';
        el.className = 'turn-indicator computer-turn';
        passBtn.disabled = true;
    }
}

// ===== LOG =====
function addLog(type, icon, msg) {
    const container = document.getElementById('log-entries');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}-log`;
    entry.innerHTML = `<span class="log-icon">${icon}</span> ${msg}`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

// ===== RESTART =====
function restartGame() {
    document.getElementById('gameover-modal').classList.add('hidden');
    document.getElementById('color-modal').classList.add('hidden');
    initGame();
}

// ===== BOOT =====
window.addEventListener('DOMContentLoaded', initGame);
