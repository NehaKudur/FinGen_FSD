// js/main.js

// Create floating coins
function createFloatingCoins() {
    const container = document.getElementById('floatingCoins');
    const coins = ['💰', '💵', '💎', '💳', '📈', '🏦', '💼', '🪙'];
    
    for (let i = 0; i < 25; i++) {
      const coin = document.createElement('div');
      coin.className = 'coin';
      coin.innerHTML = coins[Math.floor(Math.random() * coins.length)];
      coin.style.left = `${Math.random() * 100}%`;
      coin.style.fontSize = `${Math.random() * 20 + 15}px`;
      coin.style.animationDelay = `${Math.random() * 20}s`;
      coin.style.animationDuration = `${Math.random() * 10 + 15}s`;
      container.appendChild(coin);
    }
  }
  
  // Parallax scrolling effect
  function initParallax() {
    const bgLayer = document.getElementById('bgLayer');
    const parallaxBg = document.getElementById('parallaxBg');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      const zoom = 1 + scrolled * 0.0003;
      
      bgLayer.style.transform = `translate3d(0, ${rate}px, 0) scale(${zoom})`;
    });
    
    // Initial animation on load
    setTimeout(() => {
      parallaxBg.style.opacity = '1';
      parallaxBg.style.transition = 'opacity 2s ease';
    }, 300);
  }
  
  // Animate progress bars on scroll
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.getAttribute('data-progress') || '75';
          setTimeout(() => {
            progressBar.style.width = `${targetWidth}%`;
          }, 300);
        }
      });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
  }
  
  // Initialize everything when page loads
  document.addEventListener('DOMContentLoaded', () => {
    createFloatingCoins();
    initParallax();
    initProgressBars();
    
    // Add hover effect to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  });
  
  // Dynamic background color shift (optional)
  let hue = 270; // Starting purple hue
  
  function updateBackgroundHue() {
    hue = (hue + 0.1) % 360;
    document.documentElement.style.setProperty('--primary', `hsl(${hue}, 76%, 53%)`);
    requestAnimationFrame(updateBackgroundHue);
  }
  
  // Uncomment to enable dynamic hue shifting
  // requestAnimationFrame(updateBackgroundHue);