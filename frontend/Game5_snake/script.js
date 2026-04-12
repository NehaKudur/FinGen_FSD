// ─── BOARD CONFIGURATION ───────────────────────────────────────────────
const SNAKES = {
  99: 78, 87: 64, 62: 44, 47: 32, 35: 22, 17: 9
};

const LADDERS = {
  4: 25, 13: 46, 33: 64, 50: 91, 57: 76, 71: 92
};

const DICE_FACES = ['⚀','⚁','⚂','⚃','⚄','⚅'];
const ANALYSIS_API_URL = 'http://127.0.0.1:3000/api/analyze-game';
let decisionLog = [];

// ─── FINANCIAL DECISIONS ───────────────────────────────────────────────
const DECISIONS = [
  {
    scenario: "Your friend asks you to lend ₹10,000. You have exactly that in savings.",
    options: [
      { text: "A) Lend it without any agreement", correct: false, effect: -40, feedback: "Lending without documentation risks losing both money and friendship!" },
      { text: "B) Politely decline and explain your savings goal", correct: true, effect: +30, feedback: "Protecting your savings is a smart financial decision!" }
    ]
  },
  {
    scenario: "You got a ₹5,000 bonus! What do you do?",
    options: [
      { text: "A) Spend it all on shopping immediately", correct: false, effect: -50, feedback: "Impulse spending hurts your long term financial health!" },
      { text: "B) Put it in a savings account or SIP", correct: true, effect: +40, feedback: "Saving bonuses builds wealth over time!" }
    ]
  },
  {
    scenario: "Your credit card bill is due tomorrow but you're short on cash.",
    options: [
      { text: "A) Pay the minimum amount due", correct: false, effect: -30, feedback: "Minimum payments lead to high interest accumulation!" },
      { text: "B) Take a small personal loan to pay in full", correct: true, effect: +20, feedback: "Avoiding credit card interest saves money long term!" }
    ]
  },
  {
    scenario: "A bank offers you a pre-approved loan of ₹2,00,000.",
    options: [
      { text: "A) Take it immediately since it's pre-approved!", correct: false, effect: -45, feedback: "Taking unnecessary loans increases your debt burden!" },
      { text: "B) Decline since you don't need it right now", correct: true, effect: +35, feedback: "Only borrow what you need — debt management is key!" }
    ]
  },
  {
    scenario: "You want to buy a new phone. It costs ₹40,000.",
    options: [
      { text: "A) Buy it on a 24-month EMI at 18% interest", correct: false, effect: -35, feedback: "High interest EMIs cost you much more than the original price!" },
      { text: "B) Save for 3 months and buy it outright", correct: true, effect: +40, feedback: "Saving before buying avoids unnecessary interest payments!" }
    ]
  },
  {
    scenario: "You missed your EMI payment this month.",
    options: [
      { text: "A) Ignore it and pay double next month", correct: false, effect: -60, feedback: "Missing EMIs severely damages your credit score!" },
      { text: "B) Call the bank immediately to explain and reschedule", correct: true, effect: +25, feedback: "Communication with lenders shows responsibility and protects your score!" }
    ]
  },
  {
    scenario: "You have ₹1,000 extra this month.",
    options: [
      { text: "A) Add it to your emergency fund", correct: true, effect: +30, feedback: "Building an emergency fund protects against unexpected expenses!" },
      { text: "B) Order food delivery every day this week", correct: false, effect: -25, feedback: "Small daily splurges add up to big financial losses!" }
    ]
  },
  {
    scenario: "A friend recommends investing all savings in a hot new crypto.",
    options: [
      { text: "A) Invest everything immediately!", correct: false, effect: -70, feedback: "Putting all eggs in one basket is extremely risky!" },
      { text: "B) Research first and invest only a small amount", correct: true, effect: +35, feedback: "Diversification and research are keys to smart investing!" }
    ]
  },
  {
    scenario: "You receive a call saying you won a lottery but need to pay ₹2,000 to claim it.",
    options: [
      { text: "A) Pay the ₹2,000 to claim your prize!", correct: false, effect: -80, feedback: "This is a classic financial scam! Never pay to receive winnings!" },
      { text: "B) Hang up — it's clearly a scam", correct: true, effect: +40, feedback: "Recognizing scams protects your hard earned money!" }
    ]
  },
  {
    scenario: "Your salary arrives. What's the first thing you do?",
    options: [
      { text: "A) Pay yourself first — save 20% immediately", correct: true, effect: +45, feedback: "The pay yourself first rule is the foundation of wealth building!" },
      { text: "B) Spend freely and save whatever is left", correct: false, effect: -30, feedback: "Saving what's left usually means saving nothing!" }
    ]
  },
  {
    scenario: "You want to apply for a home loan. Your credit score is 680.",
    options: [
      { text: "A) Apply immediately at any bank", correct: false, effect: -20, feedback: "A higher credit score means better interest rates — wait and improve first!" },
      { text: "B) Spend 6 months improving your score first", correct: true, effect: +50, feedback: "A score above 750 can save you lakhs in interest over a home loan!" }
    ]
  },
  {
    scenario: "You have 3 credit cards. What's the smart move?",
    options: [
      { text: "A) Max out all three for maximum rewards", correct: false, effect: -55, feedback: "High credit utilization severely damages your credit score!" },
      { text: "B) Keep utilization below 30% on each card", correct: true, effect: +40, feedback: "Low credit utilization is one of the biggest factors in a good credit score!" }
    ]
  }
];

// ─── SNAKE QUESTIONS ───────────────────────────────────────────────────
const SNAKE_QUESTIONS = [
  {
    question: "What is a CIBIL score range in India?",
    options: ["A) 0-500", "B) 300-900", "C) 100-1000", "D) 500-850"],
    correct: 1,
    explanation: "CIBIL scores in India range from 300 to 900. Above 750 is considered excellent!"
  },
  {
    question: "Which factor affects credit score the MOST?",
    options: ["A) Age", "B) Payment history", "C) Number of cards", "D) Bank balance"],
    correct: 1,
    explanation: "Payment history accounts for about 35% of your credit score — always pay on time!"
  },
  {
    question: "What is credit utilization ratio?",
    options: [
      "A) Total income vs expenses",
      "B) Amount of credit used vs total credit limit",
      "C) Number of loans vs income",
      "D) Monthly EMI vs salary"
    ],
    correct: 1,
    explanation: "Credit utilization is how much of your available credit you're using. Keep it below 30%!"
  },
  {
    question: "How long does a missed payment stay on your credit report?",
    options: ["A) 6 months", "B) 1 year", "C) 7 years", "D) Forever"],
    correct: 2,
    explanation: "Missed payments can stay on your credit report for up to 7 years — always pay on time!"
  },
  {
    question: "What does EMI stand for?",
    options: [
      "A) Equal Monthly Income",
      "B) Equated Monthly Installment",
      "C) Extra Money Investment",
      "D) Emergency Money Index"
    ],
    correct: 1,
    explanation: "EMI stands for Equated Monthly Installment — the fixed amount you pay each month for a loan!"
  },
  {
    question: "Which is the BEST credit score range to get a home loan easily?",
    options: ["A) 300-500", "B) 500-650", "C) 650-750", "D) 750-900"],
    correct: 3,
    explanation: "A score of 750-900 gets you the best interest rates and easiest loan approvals!"
  },
  {
    question: "What happens when you close an old credit card?",
    options: [
      "A) Credit score always improves",
      "B) Credit score may drop due to reduced credit history",
      "C) Nothing changes",
      "D) Bank gives you a reward"
    ],
    correct: 1,
    explanation: "Closing old cards reduces your credit history length and available credit — both can lower your score!"
  },
  {
    question: "What is a secured credit card?",
    options: [
      "A) A card with a password",
      "B) A card backed by a fixed deposit",
      "C) A card only for online shopping",
      "D) A card with no credit limit"
    ],
    correct: 1,
    explanation: "A secured credit card is backed by a fixed deposit — great for building credit from scratch!"
  }
];

// ─── LADDER BONUSES ────────────────────────────────────────────────────
const LADDER_BONUSES = [
  { title: "GREAT MOVE!", desc: "You paid all your bills on time this month!", effect: +60 },
  { title: "SMART SAVER!", desc: "You started a SIP investment early!", effect: +70 },
  { title: "DEBT FREE!", desc: "You cleared your credit card balance in full!", effect: +65 },
  { title: "CREDIT HERO!", desc: "You kept your credit utilization below 30%!", effect: +55 },
  { title: "WISE INVESTOR!", desc: "You diversified your investment portfolio!", effect: +75 },
  { title: "EMERGENCY FUND!", desc: "You built a 6-month emergency fund!", effect: +60 },
];

// ─── GAME STATE ────────────────────────────────────────────────────────
let playerPos = 1;
let computerPos = 1;
let playerCredit = 650;
let computerCredit = 650;
let isPlayerTurn = true;
let gameActive = true;
let timerInterval = null;
let currentCallback = null;

// ─── INIT BOARD ────────────────────────────────────────────────────────
function initBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  // Build tiles 100 → 1 in snake pattern
  const rows = [];
  for (let row = 9; row >= 0; row--) {
    const tiles = [];
    for (let col = 0; col < 10; col++) {
      const num = row % 2 === 1
        ? row * 10 + (10 - col)
        : row * 10 + col + 1;
      tiles.push(num);
    }
    rows.push(tiles);
  }

  rows.forEach(row => {
    row.forEach(num => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = `tile-${num}`;

      const numLabel = document.createElement('div');
      numLabel.className = 'tile-number';
      numLabel.textContent = num;
      tile.appendChild(numLabel);

      const emoji = document.createElement('div');
      emoji.className = 'tile-emoji';

      if (SNAKES[num]) {
        tile.classList.add('snake');
        emoji.textContent = '🐍';
      } else if (LADDERS[num]) {
        tile.classList.add('ladder');
        emoji.textContent = '🪜';
      }

      tile.appendChild(emoji);
      board.appendChild(tile);
    });
  });

  updateBoard();
}

// ─── UPDATE BOARD ──────────────────────────────────────────────────────
function updateBoard() {
  // Clear all player/computer/both classes
  document.querySelectorAll('.tile').forEach(t => {
    t.classList.remove('player', 'computer', 'both');
    const emoji = t.querySelector('.tile-emoji');
    const num = parseInt(t.id.split('-')[1]);

    // Restore snake/ladder emojis
    if (SNAKES[num]) emoji.textContent = '🐍';
    else if (LADDERS[num]) emoji.textContent = '🪜';
    else emoji.textContent = '';
  });

  if (playerPos === computerPos) {
    const tile = document.getElementById(`tile-${playerPos}`);
    tile.classList.add('both');
    tile.querySelector('.tile-emoji').textContent = '🔵🔴';
  } else {
    const pTile = document.getElementById(`tile-${playerPos}`);
    pTile.classList.add('player');
    pTile.querySelector('.tile-emoji').textContent = '🔵';

    const cTile = document.getElementById(`tile-${computerPos}`);
    cTile.classList.add('computer');
    cTile.querySelector('.tile-emoji').textContent = '🔴';
  }

  document.getElementById('playerPos').textContent = playerPos;
  document.getElementById('computerPos').textContent = computerPos;
  updateCreditUI();
}

// ─── CREDIT SCORE UI ──────────────────────────────────────────────────
function updateCreditUI() {
  updateCreditCard('player', playerCredit);
  updateCreditCard('computer', computerCredit);
}

function updateCreditCard(who, score) {
  const pct = Math.min(100, Math.max(0, ((score - 300) / 600) * 100));
  const valEl = document.getElementById(`${who}CreditVal`);
  const barEl = document.getElementById(`${who}CreditBar`);
  const statusEl = document.getElementById(`${who}Status`);

  valEl.textContent = score;

  let color, status;
  if (score >= 750) { color = '#00ff88'; status = '⭐ Excellent'; }
  else if (score >= 650) { color = '#00aaff'; status = '✅ Good'; }
  else if (score >= 500) { color = '#ffaa00'; status = '⚠️ Fair'; }
  else if (score >= 300) { color = '#ff6600'; status = '🔴 Poor'; }
  else { color = '#ff0000'; status = '💀 Critical'; }

  valEl.style.color = color;
  barEl.style.width = pct + '%';
  barEl.style.background = color;
  statusEl.textContent = status;
  statusEl.style.color = color;
}

// ─── LOGGING ──────────────────────────────────────────────────────────
function addLog(message, type = 'system') {
  const container = document.getElementById('logContainer');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = message;
  container.appendChild(entry);
  container.scrollTop = container.scrollHeight;
}

// ─── DICE ROLL ────────────────────────────────────────────────────────
function rollDice() {
  if (!gameActive || !isPlayerTurn) return;
  document.getElementById('rollBtn').disabled = true;

  const dice = document.getElementById('diceDisplay');
  dice.classList.add('rolling');

  let rolls = 0;
  const rollInterval = setInterval(() => {
    dice.textContent = DICE_FACES[Math.floor(Math.random() * 6)];
    rolls++;
    if (rolls >= 10) {
      clearInterval(rollInterval);
      dice.classList.remove('rolling');
      const result = Math.floor(Math.random() * 6) + 1;
      dice.textContent = DICE_FACES[result - 1];
      addLog(`🎲 You rolled a ${result}!`, 'player');
      movePlayer('player', result);
    }
  }, 80);
}

// ─── MOVE PLAYER ──────────────────────────────────────────────────────
function movePlayer(who, steps) {
  const isPlayer = who === 'player';
  let pos = isPlayer ? playerPos : computerPos;
  const newPos = Math.min(100, pos + steps);

  if (isPlayer) playerPos = newPos;
  else computerPos = newPos;

  updateBoard();
  addLog(`${isPlayer ? '🔵 You' : '🔴 Computer'} moved to tile ${newPos}`, who === 'player' ? 'player' : 'computer');

  setTimeout(() => {
    if (newPos === 100) {
      endGame(who === 'player' ? 'win' : 'lose');
      return;
    }

    if (SNAKES[newPos]) {
      addLog(`🐍 ${isPlayer ? 'You' : 'Computer'} landed on a SNAKE at tile ${newPos}!`, 'bad');
      handleSnake(who, newPos);
    } else if (LADDERS[newPos]) {
      addLog(`🪜 ${isPlayer ? 'You' : 'Computer'} landed on a LADDER at tile ${newPos}!`, 'good');
      handleLadder(who, newPos);
    } else {
      handleDecision(who);
    }
  }, 600);
}

// ─── HANDLE SNAKE ─────────────────────────────────────────────────────
function handleSnake(who, pos) {
  const isPlayer = who === 'player';
  const q = SNAKE_QUESTIONS[Math.floor(Math.random() * SNAKE_QUESTIONS.length)];

  if (isPlayer) {
    showSnakeModal(q, (correct) => {
      if (correct) {
        addLog(`✅ You answered correctly! Snake defeated! Stay at tile ${pos}!`, 'good');
      } else {
        const dest = SNAKES[pos];
        playerPos = dest;
        updateBoard();
        addLog(`❌ Wrong! Snake bites! You slid down to tile ${dest}!`, 'bad');
        playerCredit = Math.max(300, playerCredit - 50);
        updateCreditUI();
        checkGameOver();
      }
      setTimeout(() => computerTurn(), 800);
    });
  } else {
    // Computer has 60% chance of answering correctly
    const correct = Math.random() < 0.6;
    setTimeout(() => {
      if (correct) {
        addLog(`🤖 Computer answered correctly! Snake defeated! Stays at tile ${pos}!`, 'computer');
      } else {
        const dest = SNAKES[pos];
        computerPos = dest;
        updateBoard();
        addLog(`🤖 Computer answered wrong! Slid down to tile ${dest}!`, 'computer');
        computerCredit = Math.max(300, computerCredit - 50);
        updateCreditUI();
      }
      nextTurn();
    }, 1200);
  }
}

// ─── HANDLE LADDER ────────────────────────────────────────────────────
function handleLadder(who, pos) {
  const isPlayer = who === 'player';
  const bonus = LADDER_BONUSES[Math.floor(Math.random() * LADDER_BONUSES.length)];
  const dest = LADDERS[pos];

  if (isPlayer) {
    playerPos = dest;
    playerCredit = Math.min(900, playerCredit + bonus.effect);
    updateBoard();
    showLadderModal(bonus, dest, () => {
      addLog(`🪜 You climbed to tile ${dest}! Credit score +${bonus.effect}!`, 'good');
      updateCreditUI();
      if (playerPos === 100) { endGame('win'); return; }
      setTimeout(() => computerTurn(), 500);
    });
  } else {
    computerPos = dest;
    computerCredit = Math.min(900, computerCredit + bonus.effect);
    updateBoard();
    addLog(`🤖 Computer climbed ladder to tile ${dest}! Credit +${bonus.effect}!`, 'computer');
    updateCreditUI();
    if (computerPos === 100) { endGame('lose'); return; }
    nextTurn();
  }
}

// ─── HANDLE DECISION ──────────────────────────────────────────────────
function handleDecision(who) {
  const isPlayer = who === 'player';
  const decision = DECISIONS[Math.floor(Math.random() * DECISIONS.length)];

  if (isPlayer) {
    showDecisionModal(decision, (correct, effect, feedback) => {
      playerCredit = Math.min(900, Math.max(300, playerCredit + effect));
      updateCreditUI();
      addLog(`💳 You chose: ${correct ? '✅ Smart move' : '❌ Bad move'} (${effect > 0 ? '+' : ''}${effect} credit)`, correct ? 'good' : 'bad');
      decisionLog.push({ decision: decision.scenario, correct, effect });
      checkGameOver();
      setTimeout(() => computerTurn(), 800);
    });
  } else {
    // Computer: 70% chance of correct decision
    const correct = Math.random() < 0.7;
    const chosen = decision.options[correct ? decision.options.findIndex(o => o.correct) : decision.options.findIndex(o => !o.correct)];
    const effect = chosen ? chosen.effect : decision.options[0].effect;

    setTimeout(() => {
      computerCredit = Math.min(900, Math.max(300, computerCredit + effect));
      updateCreditUI();
      addLog(`🤖 Computer chose: ${correct ? '✅ Smart move' : '❌ Bad move'} (${effect > 0 ? '+' : ''}${effect} credit)`, 'computer');
      nextTurn();
    }, 1000);
  }
}

// ─── SHOW DECISION MODAL ──────────────────────────────────────────────
function showDecisionModal(decision, callback) {
  const modal = document.getElementById('modalBox');
  modal.className = 'modal';
  document.getElementById('modalIcon').textContent = '💳';
  document.getElementById('modalTitle').textContent = 'FINANCIAL DECISION';
  document.getElementById('modalTitle').className = 'modal-title blue';
  document.getElementById('modalDesc').textContent = decision.scenario;
  
  // Always clear and HIDE timer on normal decisions
  clearInterval(timerInterval);
  timerInterval = null;
  const tc = document.getElementById('timerContainer');
  tc.classList.add('hidden');
  tc.style.display = 'none';
  document.getElementById('timerFill').style.width = '100%';
  document.getElementById('timerText').textContent = '10';
  document.getElementById('continueBtn').classList.add('hidden');

  const optionsEl = document.getElementById('decisionOptions');
  optionsEl.innerHTML = '';

  decision.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'decision-btn';
    btn.textContent = opt.text;
    btn.onclick = () => {
      document.querySelectorAll('.decision-btn').forEach(b => b.style.pointerEvents = 'none');
      btn.classList.add(opt.correct ? 'correct' : 'wrong');

      // If wrong, highlight correct answer
      if (!opt.correct) {
        document.querySelectorAll('.decision-btn').forEach(b => {
          const optData = decision.options.find(o => o.text === b.textContent);
          if (optData && optData.correct) b.classList.add('correct');
        });
      }

      document.getElementById('modalDesc').textContent = opt.feedback;
      const cont = document.getElementById('continueBtn');
      cont.classList.remove('hidden');
      cont.onclick = () => {
        closeModal();
        callback(opt.correct, opt.effect, opt.feedback);
      };
    };
    optionsEl.appendChild(btn);
  });

  document.getElementById('decisionModal').classList.remove('hidden');
}

// ─── SHOW SNAKE MODAL ─────────────────────────────────────────────────
function showSnakeModal(q, callback) {
  const modal = document.getElementById('modalBox');
  modal.className = 'modal snake-modal';
  document.getElementById('modalIcon').textContent = '🐍';
  document.getElementById('modalTitle').textContent = 'SNAKE CHALLENGE!';
  document.getElementById('modalTitle').className = 'modal-title red';
  document.getElementById('modalDesc').textContent = q.question;
  document.getElementById('continueBtn').classList.add('hidden');

  // Show and reset timer
  clearInterval(timerInterval);
  timerInterval = null;
  const timerContainer = document.getElementById('timerContainer');
  timerContainer.classList.remove('hidden');
  timerContainer.style.display = 'block';
  document.getElementById('timerFill').style.width = '100%';
  document.getElementById('timerText').textContent = '10';

  const optionsEl = document.getElementById('decisionOptions');
  optionsEl.innerHTML = '';

  let answered = false;

  const buttons = [];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'decision-btn';
    btn.textContent = opt;
    buttons.push(btn);
    btn.onclick = () => {
      if (answered) return;
      answered = true;
      clearInterval(timerInterval);

      document.querySelectorAll('.decision-btn').forEach(b => b.style.pointerEvents = 'none');
      const correct = i === q.correct;
      btn.classList.add(correct ? 'correct' : 'wrong');

      // Always highlight correct answer
      buttons[q.correct].classList.add('correct');

      document.getElementById('modalDesc').textContent = q.explanation;
      const cont = document.getElementById('continueBtn');
      cont.classList.remove('hidden');
      cont.onclick = () => {
        closeModal();
        callback(correct);
      };
    };
    optionsEl.appendChild(btn);
  });

  document.getElementById('decisionModal').classList.remove('hidden');

  // Fresh 10 second timer
  let timeLeft = 10;
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('timerText').textContent = timeLeft;
    document.getElementById('timerFill').style.width = (timeLeft * 10) + '%';

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) {
        answered = true;
        document.querySelectorAll('.decision-btn').forEach(b => b.style.pointerEvents = 'none');
        // Highlight correct answer on timeout
        buttons[q.correct].classList.add('correct');
        document.getElementById('modalDesc').textContent = '⏱ Time is up! ' + q.explanation;
        const cont = document.getElementById('continueBtn');
        cont.classList.remove('hidden');
        cont.onclick = () => {
          closeModal();
          callback(false);
        };
      }
    }
  }, 1000);
}

// ─── SHOW LADDER MODAL ────────────────────────────────────────────────
function showLadderModal(bonus, dest, callback) {
  const modal = document.getElementById('modalBox');
  modal.className = 'modal ladder-modal';
  document.getElementById('modalIcon').textContent = '🪜';
  document.getElementById('modalTitle').textContent = bonus.title;
  document.getElementById('modalTitle').className = 'modal-title green';
  document.getElementById('modalDesc').textContent = `${bonus.desc}\n\nYou climb to tile ${dest}! Credit Score +${bonus.effect}!`;
  
  // Hide timer completely
  clearInterval(timerInterval);
  timerInterval = null;
  const tc = document.getElementById('timerContainer');
  tc.classList.add('hidden');
  tc.style.display = 'none';
  
  document.getElementById('decisionOptions').innerHTML = '';

  const cont = document.getElementById('continueBtn');
  cont.classList.remove('hidden');
  cont.onclick = () => {
    closeModal();
    callback();
  };

  document.getElementById('decisionModal').classList.remove('hidden');
}

// ─── CLOSE MODAL ──────────────────────────────────────────────────────
function closeModal() {
  document.getElementById('decisionModal').classList.add('hidden');
  clearInterval(timerInterval);
}

// ─── COMPUTER TURN ────────────────────────────────────────────────────
function computerTurn() {
  if (!gameActive) return;
  isPlayerTurn = false;
  document.getElementById('turnIndicator').textContent = 'COMPUTER TURN';
  document.getElementById('rollBtn').disabled = true;

  addLog('🤖 Computer is thinking...', 'computer');

  setTimeout(() => {
    const result = Math.floor(Math.random() * 6) + 1;
    document.getElementById('diceDisplay').textContent = DICE_FACES[result - 1];
    addLog(`🎲 Computer rolled a ${result}!`, 'computer');
    movePlayer('computer', result);
  }, 1500);
}

// ─── NEXT TURN ────────────────────────────────────────────────────────
function nextTurn() {
  if (!gameActive) return;
  isPlayerTurn = true;
  document.getElementById('turnIndicator').textContent = 'YOUR TURN';
  document.getElementById('rollBtn').disabled = false;
  addLog('🔵 Your turn! Roll the dice!', 'player');
}

// ─── CHECK GAME OVER ──────────────────────────────────────────────────
function checkGameOver() {
  if (playerCredit <= 300) {
    addLog('💀 Your credit score is critically low! GAME OVER!', 'bad');
    endGame('gameover');
  }
}

// ─── END GAME ─────────────────────────────────────────────────────────
function endGame(result) {
  gameActive = false;
  clearInterval(timerInterval);

  const endScreen = document.getElementById('endScreen');
  endScreen.classList.remove('hidden');

  const icon = document.getElementById('endIcon');
  const title = document.getElementById('endTitle');
  const subtitle = document.getElementById('endSubtitle');

  if (result === 'win') {
    icon.textContent = '🏆';
    title.textContent = 'YOU WIN!';
    title.className = 'end-title win';
    subtitle.textContent = `You reached tile 100! Final credit score: ${playerCredit}`;
    addLog('🏆 YOU WIN! Congratulations!', 'good');
  } else if (result === 'lose') {
    icon.textContent = '😢';
    title.textContent = 'COMPUTER WINS!';
    title.className = 'end-title lose';
    subtitle.textContent = `Computer reached tile 100 first! Your credit score: ${playerCredit}`;
    addLog('😢 Computer reached 100 first! Better luck next time!', 'bad');
  } else {
    icon.textContent = '💀';
    title.textContent = 'GAME OVER!';
    title.className = 'end-title gameover';
    subtitle.textContent = `Your credit score dropped to ${playerCredit}! Financial crisis!`;
    addLog('💀 GAME OVER! Credit score too low!', 'bad');
  }

  getAIAnalysis(result);
}

// ─── AI ANALYSIS ──────────────────────────────────────────────────────
async function getAIAnalysis(result) {
  document.getElementById('aiText').textContent = 'Analyzing your credit decisions...';

  try {
    const response = await fetch(ANALYSIS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameId: 'game5',
        summary: {
          result,
          finalCreditScore: playerCredit,
          goodDecisions: decisionLog.filter(d => d.correct).length,
          badDecisions: decisionLog.filter(d => !d.correct).length,
          totalDecisions: decisionLog.length,
          decisions: decisionLog
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    document.getElementById('aiText').innerHTML = renderAIAnalysis(data);
  } catch (err) {
    console.error('AI analysis failed:', err);
    document.getElementById('aiText').textContent =
      "Great effort! Focus on paying bills on time and keeping your credit utilization low to build a strong credit score. Every good financial decision today builds a better tomorrow!";
  }
}

function renderAIAnalysis(aiData) {
  if (!aiData || typeof aiData !== 'object') {
    return 'No analysis available.';
  }

  let html = '';

  if (Array.isArray(aiData.insights)) {
    aiData.insights.forEach(insight => {
      const cls = insight.type === 'good' ? 'ai-good' : insight.type === 'bad' ? 'ai-bad' : 'ai-feedback-title';
      html += `<div class="${cls}">${insight.text}</div>`;
    });
  }

  if (aiData.lesson) {
    html += `<div class="ai-feedback-lesson"><strong>${aiData.lesson.title}</strong><br>${aiData.lesson.content}</div>`;
  }

  if (aiData.summary) {
    html += `<div class="ai-feedback-summary"><strong>Summary:</strong> ${aiData.summary}</div>`;
  }

  return html || 'No analysis available.';
}

// ─── START ────────────────────────────────────────────────────────────
initBoard();