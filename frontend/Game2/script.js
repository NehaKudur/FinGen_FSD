// Game Configuration
const salaryStart = 45000;
let salaryLeft = salaryStart;
let questionIndex = 0;
let timer;
let timePerQ = 60;
let timeLeft = timePerQ;
let gameSummary = [];
let correctAnswers = 0;

// WARNING: Never expose API keys in client-side code in production!
// This key should be removed or moved to a backend proxy
const AI_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

const questions = [
  {
    q: "You've made investments this year but haven't declared any under 80C. ELSS, PPF, and life insurance policies fall under this section. What's the best action to reduce your tax liability?",
    options: [
      { text: "Submit investment proofs before deadline", cost: 0, correct: true, icon: "fas fa-file-invoice-dollar", tip: "Saves you ₹0 tax" },
      { text: "Ignore and pay full tax", cost: 2500, correct: false, icon: "fas fa-times-circle", tip: "Costs you ₹2,500 in taxes" },
      { text: "Only declare cash payments", cost: 1500, correct: false, icon: "fas fa-money-bill-wave", tip: "Costs you ₹1,500 in taxes" }
    ],
    explanation: {
      correct: "Declaring all eligible investments under Section 80C can save you up to ₹46,800 in taxes annually.",
      incorrect: "Not claiming deductions means paying more tax than necessary. Always keep proper documentation."
    }
  },
  {
    q: "You live in a rented apartment and your salary structure includes HRA (House Rent Allowance). What should you do to maximize your tax benefit?",
    options: [
      { text: "Submit rent receipts and claim HRA", cost: 0, correct: true, icon: "fas fa-home", tip: "Saves you ₹0 tax" },
      { text: "Don't claim HRA", cost: 1800, correct: false, icon: "fas fa-ban", tip: "Costs you ₹1,800 in taxes" },
      { text: "Claim HRA without receipts", cost: 3000, correct: false, icon: "fas fa-exclamation-triangle", tip: "Costs you ₹3,000 in taxes" }
    ],
    explanation: {
      correct: "Properly claiming HRA with rent receipts can save up to ₹60,000/year in taxes for metro residents.",
      incorrect: "HRA is one of the most valuable tax benefits for salaried individuals - never miss claiming it with proper docs."
    }
  },
  {
    q: "You bought medical insurance for your family worth ₹25,000. You're eligible under Section 80D for a deduction. How should you handle it during tax filing?",
    options: [
      { text: "Claim under 80D with documents", cost: 0, correct: true, icon: "fas fa-shield-alt", tip: "Saves you ₹0 tax" },
      { text: "Forget to file the documents", cost: 2000, correct: false, icon: "fas fa-file-medical", tip: "Costs you ₹2,000 in taxes" },
      { text: "Claim under 80C instead", cost: 1000, correct: false, icon: "fas fa-exchange-alt", tip: "Costs you ₹1,000 in taxes" }
    ],
    explanation: {
      correct: "Health insurance premiums qualify for deduction under Section 80D (up to ₹25,000 for family coverage).",
      incorrect: "Medical insurance claims must go under 80D, not 80C. Keep premium payment receipts for documentation."
    }
  },
];

// Initialize background animation
function initBackground() {
  const bg = document.getElementById('backgroundAnimation');
  
  // Add floating coins
  for (let i = 0; i < 15; i++) {
    const coin = document.createElement('div');
    coin.className = 'floating-coin';
    coin.style.left = `${Math.random() * 100}%`;
    coin.style.animationDelay = `${Math.random() * 5}s`;
    coin.style.animationDuration = `${10 + Math.random() * 20}s`;
    bg.appendChild(coin);
  }
  
  // Add floating ghosts
  for (let i = 0; i < 5; i++) {
    const ghost = document.createElement('div');
    ghost.className = 'floating-ghost';
    ghost.innerHTML = '<i class="fas fa-ghost"></i>';
    ghost.style.left = `${Math.random() * 100}%`;
    ghost.style.animationDelay = `${Math.random() * 10}s`;
    ghost.style.animationDuration = `${20 + Math.random() * 30}s`;
    bg.appendChild(ghost);
  }
}

// Update progress bar
function updateProgress() {
  const progress = (questionIndex / questions.length) * 100;
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${Math.round(progress)}%`;
  document.getElementById('ghost-number').textContent = `${questionIndex + 1}/${questions.length}`;
}

// Start game
function startGame() {
  document.getElementById("intro-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  salaryLeft = salaryStart;
  questionIndex = 0;
  correctAnswers = 0;
  updateSalaryDisplay();
  updateProgress();
  showQuestion();
  initBackground();
}

// Show current question
function showQuestion() {
  if (questionIndex >= questions.length) return endGame();

  timeLeft = timePerQ;
  document.getElementById("time-left").textContent = `${timeLeft}s`;
  document.getElementById("salary-update").innerHTML = "";
  document.getElementById("skip-message").innerHTML = "";
  
  // Remove any existing feedback classes
  document.getElementById("salary-update").className = "feedback-container";
  document.getElementById("skip-message").className = "skip-message";

  const currentQ = questions[questionIndex];
  document.getElementById("ghost-question").textContent = currentQ.q;
  const optionsDiv = document.getElementById("ghost-options");
  optionsDiv.innerHTML = "";

  currentQ.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `
      <div class="option-icon"><i class="${opt.icon}"></i></div>
      <div class="option-text">${opt.text}</div>
    `;
    
    // Add tooltip for desktop users
    btn.title = opt.tip;
    
    btn.onclick = () => {
      clearInterval(timer);
      handleAnswer(opt);
    };
    
    // Add hover effect that shows tip on desktop
    btn.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) { // Desktop only
        showOptionTooltip(btn, opt.tip);
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) { // Desktop only
        hideOptionTooltip();
      }
    });
    
    // Add touch feedback for mobile
    btn.addEventListener('touchstart', () => {
      if (window.innerWidth <= 768) { // Mobile only
        showOptionTooltip(btn, opt.tip);
      }
    });
    
    btn.addEventListener('touchend', () => {
      if (window.innerWidth <= 768) { // Mobile only
        setTimeout(() => hideOptionTooltip(), 2000);
      }
    });
    
    optionsDiv.appendChild(btn);
  });

  updateProgress();
  
  // Start timer
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").textContent = `${timeLeft}s`;
    
    // Visual warning when time is running out
    if (timeLeft <= 10) {
      document.getElementById("time-left").style.color = "var(--danger)";
      document.getElementById("time-left").style.animation = "pulse 0.5s infinite";
    }
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      document.getElementById("skip-message").innerHTML = `
        <i class="fas fa-hourglass-end"></i> Time's up! Don't worry — our AI mentor will explain this later.
      `;
      document.getElementById("skip-message").classList.add("skip-message");
      setTimeout(() => handleAnswer(null), 2000);
    }
  }, 1000);
}

// Show option tooltip
function showOptionTooltip(button, tip) {
  // Remove any existing tooltip
  hideOptionTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.className = 'option-tooltip';
  tooltip.textContent = tip;
  tooltip.style.position = 'fixed';
  tooltip.style.background = 'var(--surface-light)';
  tooltip.style.color = 'var(--text)';
  tooltip.style.padding = '12px 16px';
  tooltip.style.borderRadius = '10px';
  tooltip.style.border = '2px solid var(--primary)';
  tooltip.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
  tooltip.style.zIndex = '10000';
  tooltip.style.fontSize = '1rem';
  tooltip.style.width = '80%';
  tooltip.style.maxWidth = '300px';
  tooltip.style.textAlign = 'center';
  tooltip.style.top = '50%';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translate(-50%, -50%)';
  
  document.body.appendChild(tooltip);
}

// Hide option tooltip
function hideOptionTooltip() {
  const tooltip = document.querySelector('.option-tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}

// Handle answer selection
function handleAnswer(opt) {
  clearInterval(timer);
  hideOptionTooltip(); // Remove tooltip if visible
  document.getElementById("time-left").style.color = "";
  document.getElementById("time-left").style.animation = "";
  
  const q = questions[questionIndex];
  const skipped = !opt;
  const correct = skipped ? false : opt.correct;
  const cost = skipped ? 0 : opt.cost;
  
  // Show visual feedback
  const options = document.querySelectorAll('.option-btn');
  options.forEach(optionBtn => {
    optionBtn.disabled = true;
    const optionText = optionBtn.querySelector('.option-text').textContent;
    
    // Find the corresponding option object
    const optionObj = q.options.find(o => o.text === optionText);
    if (optionObj) {
      if (optionObj.correct) {
        optionBtn.classList.add('correct');
      } else if (opt && optionText === opt.text) {
        optionBtn.classList.add('incorrect');
      }
    }
  });
  
  // Update game state
  salaryLeft -= cost;
  if (correct) correctAnswers++;
  
  gameSummary.push({
    question: q.q,
    selected: skipped ? "Skipped" : opt.text,
    correct: correct,
    cost: cost,
    skipped: skipped,
    explanation: q.explanation
  });

  updateSalaryDisplay();
  
  // Show feedback message with cost information
  const feedbackDiv = document.getElementById("salary-update");
  if (!skipped) {
    if (correct) {
      feedbackDiv.innerHTML = `<i class="fas fa-check-circle"></i> Great choice! This is the optimal financial decision.`;
      feedbackDiv.className = "feedback-container feedback-positive";
      
      // Add coin animation for correct answer
      addCoinAnimation();
    } else {
      feedbackDiv.innerHTML = `<i class="fas fa-times-circle"></i> This decision costs you ₹${cost} in additional taxes.`;
      feedbackDiv.className = "feedback-container feedback-negative";
    }
  }
  
  // Move to next question
  questionIndex++;
  setTimeout(() => {
    showQuestion();
  }, 2000);
}

// Add coin animation for correct answers
function addCoinAnimation() {
  const coin = document.createElement('div');
  coin.className = 'coin-animation';
  coin.innerHTML = '<i class="fas fa-coins"></i>';
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
  coin.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
  
  document.querySelector('.game-box').appendChild(coin);
  
  setTimeout(() => {
    coin.remove();
  }, 1000);
}

// Update salary display
function updateSalaryDisplay() {
  document.getElementById("salary-left").textContent = `₹${salaryLeft}`;
  document.getElementById("salary-left").style.color = salaryLeft < salaryStart ? "var(--danger)" : "var(--success)";
}

// End game
function endGame() {
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("final-salary").textContent = `₹${salaryLeft}`;
  
  // Update final salary color based on performance
  const finalSalaryElem = document.getElementById("final-salary");
  if (salaryLeft >= salaryStart * 0.9) {
    finalSalaryElem.style.color = "var(--success)";
  } else if (salaryLeft >= salaryStart * 0.7) {
    finalSalaryElem.style.color = "var(--warning)";
  } else {
    finalSalaryElem.style.color = "var(--danger)";
  }
}

// Show AI feedback
async function showAIFeedback() {
  const feedbackDiv = document.getElementById("ai-feedback");
  const contentDiv = document.getElementById("ai-content");
  const loadingDiv = document.getElementById("ai-loading");
  
  feedbackDiv.classList.remove("hidden");
  contentDiv.innerHTML = "";
  loadingDiv.classList.remove("hidden");

  try {
    // Try to get AI analysis (commented out for safety - uncomment if you have a backend)
    // const response = await callClaudeAPI();
    // contentDiv.innerHTML = formatAIResponse(response);
    
    // For now, use local analysis
    contentDiv.innerHTML = generateLocalAnalysis();
  } catch (error) {
    console.error("API Error:", error);
    contentDiv.innerHTML = generateLocalAnalysis();
  } finally {
    loadingDiv.classList.add("hidden");
  }
}

// Call Claude API (commented out for safety)
async function callClaudeAPI() {
  const prompt = `Analyze these financial decisions from a tax planning game:
  
  Final Salary: ₹${salaryLeft}/₹${salaryStart}
  Decisions:
  ${gameSummary.map((q, i) => `
  ${i+1}. ${q.question}
     Chose: ${q.selected} ${q.correct ? 'Correct' : 'Wrong'}
     Impact: ₹${q.cost} ${q.skipped ? '(Skipped)' : ''}
  `).join('')}

  Provide professional feedback in this format:
  <good>What they did well</good>
  <bad>Key mistakes made</bad>
  <tip>3 actionable tax planning tips</tip>`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": AI_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) throw new Error(`API Error: ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
}

// Format AI response
function formatAIResponse(text) {
  return text
    .replace(/<good>(.*?)<\/good>/gs, `
      <div class="ai-section ai-good">
        <div class="ai-section-title"><i class="fas fa-thumbs-up"></i> What You Did Well</div>
        $1
      </div>
    `)
    .replace(/<bad>(.*?)<\/bad>/gs, `
      <div class="ai-section ai-bad">
        <div class="ai-section-title"><i class="fas fa-exclamation-triangle"></i> Areas for Improvement</div>
        $1
      </div>
    `)
    .replace(/<tip>(.*?)<\/tip>/gs, `
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-lightbulb"></i> Actionable Financial Tips</div>
        $1
      </div>
    `)
    .replace(/\n/g, '<br>');
}

// Generate local analysis (fallback)
function generateLocalAnalysis() {
  const totalLoss = salaryStart - salaryLeft;
  const performance = correctAnswers / questions.length;
  
  let analysis = '';
  
  // Performance summary
  analysis += `
    <div class="ai-section ${performance >= 0.7 ? 'ai-good' : 'ai-bad'}">
      <div class="ai-section-title"><i class="fas fa-chart-line"></i> Performance Summary</div>
      You answered ${correctAnswers} out of ${questions.length} questions correctly.<br>
      You lost ₹${totalLoss} in potential tax savings.
    </div>
  `;
  
  // Question-specific feedback
  gameSummary.forEach((q, i) => {
    if (!q.correct && !q.skipped) {
      analysis += `
        <div class="ai-section ai-bad">
          <div class="ai-section-title"><i class="fas fa-ghost"></i> Ghost ${i+1} Mistake</div>
          ${q.explanation.incorrect}
        </div>
      `;
    }
  });
  
  // Tips
  analysis += `
    <div class="ai-section ai-tip">
      <div class="ai-section-title"><i class="fas fa-lightbulb"></i> Top 3 Tax-Saving Strategies</div>
      1. <strong>Maximize Section 80C:</strong> Invest up to ₹1.5 lakh in ELSS, PPF, or life insurance<br>
      2. <strong>Claim HRA Properly:</strong> Submit rent receipts to save up to ₹60,000/year<br>
      3. <strong>Health Insurance Deduction:</strong> Claim up to ₹25,000 under Section 80D for family coverage
    </div>
  `;
  
  return analysis;
}

// Initialize background on load
window.addEventListener('load', initBackground);