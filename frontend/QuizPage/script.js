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
}

// Update quiz progress
function updateQuizProgress() {
  const form = document.getElementById('quiz-form');
  const inputs = form.querySelectorAll('input[type="radio"]:checked');
  const answeredCount = inputs.length;
  const progress = (answeredCount / 10) * 100;
  
  document.getElementById('answered-count').textContent = `${answeredCount}/10`;
  document.getElementById('quiz-progress-fill').style.width = `${progress}%`;
}

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
    
    // Calculate score
    for (let [key, value] of formData.entries()) {
      score += parseInt(value);
    }
    
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

// Initialize everything when page loads
window.addEventListener('load', function() {
  initBackground();
  initFormEvents();
  updateQuizProgress();
});