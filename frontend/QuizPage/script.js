// Update quiz progress
function updateQuizProgress() {
  const form = document.getElementById('quiz-form');
  const inputs = form.querySelectorAll('input[type="radio"]:checked');
  const answeredCount = inputs.length;
  const progress = (answeredCount / 10) * 100;
  
  document.getElementById('answered-count').textContent = `${answeredCount}/10`;
  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
}

// Global variables to store quiz results
let quizScore = 0;
let quizLevel = '';
let quizAnswers = [];
const ANALYSIS_API_URL = 'http://127.0.0.1:3000/api/analyze-game';


// Initialize form events
function initFormEvents() {
  const form = document.getElementById('quiz-form');
  const result = document.getElementById('result');
  
  // Update progress when any option is selected
  const radioInputs = form.querySelectorAll('input[type="radio"]');
  radioInputs.forEach(input => {
    input.addEventListener('change', updateQuizProgress);
  });
  
  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    let score = 0;
    quizAnswers = [];
    
    // Calculate score and collect answers
    for (let [key, value] of formData.entries()) {
      score += parseInt(value);
      quizAnswers.push({
        question: key,
        answer: value
      });
    }
    
    quizScore = score;
    
    // Determine level
    let level = "";
    let levelClass = "";
    let message = "";
    let icon = "";
    
    if (score <= 4) {
      level = "🔰 Beginner";
      levelClass = "beginner";
      message = "Great start! Every financial expert started as a beginner. Keep learning and you'll level up in no time!";
      icon = "fas fa-seedling";
    } else if (score <= 7) {
      level = "⚙️ Intermediate";
      levelClass = "intermediate";
      message = "Well done! You have solid financial knowledge. With a bit more practice, you'll reach expert level!";
      icon = "fas fa-cogs";
    } else {
      level = "🧠 Expert";
      levelClass = "expert";
      message = "Excellent! You have expert-level financial knowledge. Consider sharing your wisdom with others!";
      icon = "fas fa-brain";
    }
    
    quizLevel = level;
    
    // Update result display
    document.getElementById('score-value').textContent = score;
    document.getElementById('level-badge').className = `level-badge ${levelClass}`;
    document.getElementById('level-badge').innerHTML = `
      <div class="badge-icon"><i class="${icon}"></i></div>
      <div class="badge-text">${level}</div>
    `;
    document.getElementById('result-message').textContent = message;
    document.getElementById('result-icon').innerHTML = `
      <i class="${icon}"></i>
    `;
    
    // Show result with animation
    form.classList.add('hidden');
    result.classList.remove('hidden');
    
    // Add coin animation for good scores
    if (score >= 7) {
      addCoinAnimation();
    }

    // Automatically display AI analysis once results are shown
    showAIAnalysis();
  });
}

// Add coin animation for good scores
function addCoinAnimation() {
  const coin = document.createElement('div');
  coin.className = 'coin-animation';
  coin.innerHTML = '<i class="fas fa-coins"></i>';
  coin.style.left = '50%';
  coin.style.top = '50%';
  coin.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
  coin.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
  
  document.querySelector('.result-card').appendChild(coin);
  
  setTimeout(() => {
    coin.remove();
  }, 1000);
}

// Reset quiz
function resetQuiz() {
  const form = document.getElementById('quiz-form');
  const result = document.getElementById('result');
  
  // Reset form
  form.reset();
  
  // Reset progress
  document.getElementById('answered-count').textContent = '0/10';
  document.getElementById('quiz-progress-fill').style.width = '0%';
  
  // Hide result and show form
  result.classList.add('hidden');
  form.classList.remove('hidden');
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share results (simulated)
function shareResults() {
  const score = document.getElementById('score-value').textContent;
  const level = document.querySelector('.badge-text').textContent;
  
  // Create share text
  const shareText = `I scored ${score}/10 on the FinGen Financial Literacy Quiz and achieved the ${level} level! Test your financial knowledge at: ${window.location.href}`;
  
  // Check if Web Share API is supported
  if (navigator.share) {
    navigator.share({
      title: 'My FinGen Quiz Results',
      text: shareText,
      url: window.location.href
    })
    .catch(error => {
      console.log('Error sharing:', error);
      copyToClipboard(shareText);
    });
  } else {
    // Fallback to clipboard
    copyToClipboard(shareText);
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Results copied to clipboard! Share it with your friends.');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      alert('Failed to copy results. Please try again.');
    });
}

// Show AI analysis
async function showAIAnalysis() {
  const analysisDiv = document.getElementById("ai-analysis");
  const contentDiv = document.getElementById("ai-content");
  const loadingDiv = document.getElementById("ai-loading");
  
  analysisDiv.classList.remove("hidden");
  analysisDiv.style.display = 'block';
  loadingDiv.style.display = 'block';
  contentDiv.style.display = 'block';
  contentDiv.innerHTML = "";

  try {
    const response = await fetch(ANALYSIS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: 'quiz',
        summary: {
          score: quizScore,
          level: quizLevel,
          answers: quizAnswers
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const html = data.analysis ? data.analysis : renderAIAnalysis(data);
    contentDiv.innerHTML = html;
  } catch (error) {
    console.error("API Error:", error);
    contentDiv.innerHTML = generateLocalAnalysis();
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function renderAIAnalysis(aiData) {
  if (!aiData || typeof aiData !== 'object') {
    return generateLocalAnalysis();
  }

  let html = '';

  if (Array.isArray(aiData.insights)) {
    aiData.insights.forEach(insight => {
      const type = insight.type || 'tip';
      const sectionClass = type === 'good' ? 'ai-good' : type === 'bad' ? 'ai-bad' : 'ai-tip';
      html += `
        <div class="ai-section ${sectionClass}">
          <div class="ai-section-title"><i class="fas fa-robot"></i> ${insight.type ? insight.type.toUpperCase() : 'Insight'}</div>
          ${insight.text}
        </div>
      `;
    });
  }

  if (aiData.lesson) {
    html += `
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-lightbulb"></i> ${aiData.lesson.title}</div>
        ${aiData.lesson.content}
      </div>
    `;
  }

  if (aiData.summary) {
    html += `
      <div class="ai-section ai-good">
        <div class="ai-section-title"><i class="fas fa-check-circle"></i> Summary</div>
        ${aiData.summary}
      </div>
    `;
  }

  return html || generateLocalAnalysis();
}

// Generate local analysis (fallback)
function generateLocalAnalysis() {
  let analysis = '';
  
  if (quizScore <= 4) {
    analysis = `
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-seedling"></i> Your Beginner Level Analysis</div>
        You scored ${quizScore}/10, placing you at the Beginner level. This means you're just starting your financial journey, which is completely normal! Focus on building basic knowledge about budgeting, saving, and understanding different financial products.
      </div>
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-lightbulb"></i> Recommended Next Steps</div>
        1. Learn about compound interest and emergency funds<br>
        2. Start tracking your monthly expenses<br>
        3. Understand the difference between needs vs wants<br>
        4. Read beginner-friendly financial books
      </div>
    `;
  } else if (quizScore <= 7) {
    analysis = `
      <div class="ai-section ai-good">
        <div class="ai-section-title"><i class="fas fa-cogs"></i> Your Intermediate Level Analysis</div>
        Congratulations on scoring ${quizScore}/10! You have solid foundational knowledge and are ready to dive deeper into advanced financial concepts. You understand most basic principles but could benefit from learning about investments and tax planning.
      </div>
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-lightbulb"></i> Recommended Next Steps</div>
        1. Learn about different investment options (stocks, mutual funds, bonds)<br>
        2. Understand tax-saving instruments and deductions<br>
        3. Study risk management and insurance<br>
        4. Practice creating investment portfolios
      </div>
    `;
  } else {
    analysis = `
      <div class="ai-section ai-good">
        <div class="ai-section-title"><i class="fas fa-brain"></i> Your Expert Level Analysis</div>
        Excellent work! Scoring ${quizScore}/10 demonstrates expert-level financial knowledge. You have a comprehensive understanding of financial concepts and are well-equipped to make informed financial decisions.
      </div>
      <div class="ai-section ai-tip">
        <div class="ai-section-title"><i class="fas fa-lightbulb"></i> Recommended Next Steps</div>
        1. Consider advanced topics like derivatives and forex<br>
        2. Learn about financial modeling and analysis<br>
        3. Explore entrepreneurship and business finance<br>
        4. Mentor others in financial literacy
      </div>
    `;
  }
  
  return analysis;
}

// Initialize everything when page loads
window.addEventListener('load', function() {
  initFormEvents();
  updateQuizProgress();
});