// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initLoadingScreen();
    initNavigation();
    initMatrixBackground();
    initTypingEffect();
    initEventSlider();
    initEventTabs();
    initFormValidation();
    initScrollAnimations();
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
    }
}

// Loading Screen Functionality
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Simulate loading process
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }
        }
    });
}

// Matrix Background Effect
function initMatrixBackground() {
    const matrixBg = document.getElementById('matrixBg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    matrixBg.appendChild(canvas);
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = matrixBg.offsetWidth;
        canvas.height = matrixBg.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Matrix characters
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
    
    // Draw function
    function draw() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = "rgba(10, 10, 10, 0.04)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = "#00ff41";
        ctx.font = `${fontSize}px 'Roboto Mono', monospace`;
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop if it reaches bottom or randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    // Animation loop
    setInterval(draw, 33);
}

// Typing Effect
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    const phrases = [
        "Securing IoT Devices...",
        "Encrypting Data Streams...",
        "Analyzing Network Threats...",
        "Building Secure Systems...",
        "Training Ethical Hackers..."
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        if (isPaused) return;
        
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Deleting text
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Typing text
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Determine typing speed
        let typeSpeed = isDeleting ? 50 : 100;
        
        // If word is complete
        if (!isDeleting && charIndex === currentPhrase.length) {
            isPaused = true;
            typeSpeed = 2000; // Pause at end
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                type();
            }, typeSpeed);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start typing effect
    setTimeout(type, 1000);
}

// Event Slider Functionality
function initEventSlider() {
    const sliderContainer = document.getElementById('eventsSlider');
    const prevBtn = document.getElementById('prevEvent');
    const nextBtn = document.getElementById('nextEvent');
    const eventCards = document.querySelectorAll('.event-card');
    let currentSlide = 0;
    
    // Set initial position
    updateSliderPosition();
    
    // Next button event
    nextBtn.addEventListener('click', function() {
        currentSlide = (currentSlide + 1) % eventCards.length;
        updateSliderPosition();
    });
    
    // Previous button event
    prevBtn.addEventListener('click', function() {
        currentSlide = (currentSlide - 1 + eventCards.length) % eventCards.length;
        updateSliderPosition();
    });
    
    // Auto slide
    setInterval(() => {
        currentSlide = (currentSlide + 1) % eventCards.length;
        updateSliderPosition();
    }, 5000);
    
    function updateSliderPosition() {
        const translateX = -currentSlide * 100;
        sliderContainer.style.transform = `translateX(${translateX}%)`;
    }
}

// Event Tabs Functionality
function initEventTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const eventItems = document.querySelectorAll('.event-item');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter events
            eventItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Form Validation
function initFormValidation() {
    const membershipForm = document.getElementById('membershipForm');
    
    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const studentId = document.getElementById('studentId').value;
        const interest = document.getElementById('interest').value;
        const experience = document.getElementById('experience').value;
        
        if (!fullName || !email || !studentId || !interest || !experience) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Application submitted successfully! We will contact you soon.', 'success');
        membershipForm.reset();
    });
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '1rem 1.5rem';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = '500';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        notification.style.transform = 'translateX(150%)';
        notification.style.transition = 'transform 0.3s ease';
        
        if (type === 'success') {
            notification.style.backgroundColor = '#28a745';
        } else {
            notification.style.backgroundColor = '#dc3545';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll('.mission, .vision, .team-card, .event-item, .benefit-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-element');
        observer.observe(el);
    });
    
    // Add CSS for fade animation
    const style = document.createElement('style');
    style.textContent = `
        .fade-element {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// Additional utility functions
function encryptText(text) {
    // Simple text encryption for demonstration
    return text.split('').map(char => {
        return String.fromCharCode(char.charCodeAt(0) + 5);
    }).join('');
}

function decryptText(encryptedText) {
    // Simple text decryption for demonstration
    return encryptedText.split('').map(char => {
        return String.fromCharCode(char.charCodeAt(0) - 5);
    }).join('');
}

// Terminal simulation (for future enhancements)
function initTerminal() {
    // This would be implemented for a terminal-style section
    console.log('Terminal simulation ready for implementation');
}