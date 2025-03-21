// Quotes sequence with fewer clicks
const quotes = [
    'LIFE’S A JUNGLE—SWING LIKE A MONKEY',
    'SOME CLIMB TREES, OTHERS JUST HANG OUT',
    'BANANAS TODAY BEAT PROMISES TOMORROW',
    'DON’T MONKEY AROUND WITH YESTERDAY—LEAP INTO NOW'
];

let currentQuote = 0;
const quoteText = document.querySelector('.quote-text');
const nextBtn = document.getElementById('next');
const enterBtn = document.getElementById('enter');
const skipBtn = document.getElementById('skip');
const profileCard = document.querySelector('.profile-card');

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorDotX = 0;
let cursorDotY = 0;

// Track if cursor is over a clickable element
let isOverClickable = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Make dot follow mouse instantly when over clickable elements
    if (isOverClickable) {
        cursorDotX = mouseX;
        cursorDotY = mouseY;
    }
});

function updateCursor() {
    // Faster follow speed for main cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    // Dot follows more quickly than the circle
    if (!isOverClickable) {
        cursorDotX += (mouseX - cursorDotX) * 0.3;
        cursorDotY += (mouseY - cursorDotY) * 0.3;
    }

    // Apply transforms with translate3d for better performance
    cursor.style.transform = `translate3d(${cursorX - cursor.offsetWidth / 2}px, ${cursorY - cursor.offsetHeight / 2}px, 0)`;
    cursorDot.style.transform = `translate3d(${cursorDotX}px, ${cursorDotY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor hover effects for interactive elements
const interactiveElements = document.querySelectorAll('button, .social-btn, .volume-control, .volume-slider, a');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        isOverClickable = true;
        cursor.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-dot-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        isOverClickable = false;
        cursor.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-dot-hover');
    });
});

// Hide cursor during scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    }, 150);
});

// Ripple effect setup
const canvas = document.getElementById('ripple-canvas');
const ctx = canvas.getContext('2d');
let ripples = [];
let animationFrameId;

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();

class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = Math.max(canvas.width, canvas.height);
        this.speed = 15;
        this.alpha = 1;
    }

    draw() {
        ctx.strokeStyle = `rgba(114, 137, 218, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    update() {
        this.radius += this.speed;
        this.alpha = Math.max(0, 1 - this.radius / this.maxRadius);
        return this.alpha > 0;
    }
}

function createRipple(x = canvas.width / 2, y = canvas.height / 2) {
    ripples.push(new Ripple(x, y));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ripples = ripples.filter(ripple => {
        ripple.draw();
        return ripple.update();
    });
    animationFrameId = requestAnimationFrame(animate);
}
animate();

// Enhanced quote animation
function setQuote(index) {
    const quote = quotes[index];
    const words = quote.split(' ');
    
    // Create ripple effect
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    createRipple(centerX, centerY);
    
    // Create a timeline for smooth transitions
    const tl = gsap.timeline();
    
    // Clear any existing animations
    gsap.killTweensOf('.word');
    gsap.killTweensOf('.word-inner');
    
    // Fade out current quote
    tl.to(quoteText, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
            // Update quote text with wrapped words
            quoteText.innerHTML = words.map(word => 
                `<span class="word"><span class="word-inner">${word}</span></span>`
            ).join(' ');
            
            // Get all word elements
            const wordElements = quoteText.querySelectorAll('.word-inner');
            
            // Initial state for words
            gsap.set(wordElements, {
                opacity: 0,
                y: 20,
                rotateX: 45
            });
            
            // Fade in quote container
            gsap.to(quoteText, {
                opacity: 1,
                duration: 0.1
            });
            
            // Animate each word
            gsap.to(wordElements, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: "back.out(1.4)",
                onComplete: () => {
                    // Add subtle floating animation to words
                    wordElements.forEach((word, i) => {
                        gsap.to(word, {
                            y: "random(-8, 8)",
                            rotateX: "random(-5, 5)",
                            duration: "random(2, 3)",
                            ease: "sine.inOut",
                            repeat: -1,
                            yoyo: true,
                            delay: i * 0.1
                        });
                    });
                }
            });
        }
    });

    // Show enter button on last quote
    if (index === quotes.length - 1) {
        setTimeout(() => {
            enterBtn.style.display = 'flex';
            gsap.fromTo(enterBtn,
                {
                    opacity: 0,
                    y: 20,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            );
        }, 1500);
    }
}

// Enhanced parallax effect with rotation
let parallaxTimeout;
document.addEventListener('mousemove', (e) => {
    if (!parallaxTimeout) {
        parallaxTimeout = setTimeout(() => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
            const rotateX = moveY * 0.5;
            const rotateY = -moveX * 0.5;
            
            gsap.to('.quote-section', {
                x: moveX,
                y: moveY,
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 1,
                ease: "power2.out"
            });
            
            // Add depth effect to words
            gsap.to('.word', {
                z: "random(-100, 100)",
                duration: 1,
                ease: "power2.out",
                stagger: {
                    amount: 0.3,
                    from: "random"
                }
            });
            
            parallaxTimeout = null;
        }, 10);
    }
});

// Enhanced button hover effects
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            y: -2,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
        
        // Animate the icon
        const icon = btn.querySelector('i');
        gsap.to(icon, {
            x: 3,
            scale: 1.1,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Reset icon
        const icon = btn.querySelector('i');
        gsap.to(icon, {
            x: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Add magnetic effect to buttons
document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) * 0.2;
        const deltaY = (y - centerY) * 0.2;
        
        gsap.to(btn, {
            x: deltaX,
            y: deltaY,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Add glow effect based on mouse position
        const angle = Math.atan2(y - centerY, x - centerX);
        const distance = Math.min(Math.hypot(x - centerX, y - centerY) * 0.5, 20);
        
        gsap.to(btn, {
            boxShadow: `${Math.cos(angle) * distance}px ${Math.sin(angle) * distance}px 20px rgba(114, 137, 218, 0.4)`,
            duration: 0.3
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            boxShadow: 'none',
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Initialize background video
const bgVideo = document.getElementById('bg-video');

// Initialize first quote
setQuote(0);
setTimeout(() => createRipple(), 500); // Initial ripple after page load

// Next button click handler
nextBtn.addEventListener('click', () => {
    if (currentQuote < quotes.length - 1) {
        currentQuote++;
        setQuote(currentQuote);
    }
});

// Skip button handler
skipBtn.addEventListener('click', () => {
    currentQuote = quotes.length - 1;
    setQuote(currentQuote);
});

// Enter button handler
enterBtn.addEventListener('click', () => {
    // Create final ripple effect
    createRipple();
    
    // Fade out quote elements
    gsap.to([quoteText, nextBtn, enterBtn, skipBtn], {
        duration: 0.5,
        opacity: 0,
        y: -20,
        stagger: 0.1,
        ease: 'power2.in',
        onComplete: () => {
            quoteText.style.display = 'none';
            nextBtn.style.display = 'none';
            enterBtn.style.display = 'none';
            skipBtn.style.display = 'none';
        }
    });
    
    // Start background video with fade
    bgVideo.classList.remove('hidden');
    bgVideo.play().catch(err => console.log('Video autoplay failed:', err));
    gsap.to(bgVideo, {
        duration: 1,
        opacity: 0.5,
        ease: 'power2.inOut'
    });
    
    showProfileCard();
    
    // Start background music
    const bgMusic = new Audio('audio.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.play().catch(err => console.log('Audio autoplay failed:', err));
    
    // Setup volume control
    const volumeControl = document.querySelector('.volume-control');
    const volumeBtn = document.querySelector('.volume-btn');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeSliderFill = document.querySelector('.volume-slider-fill');
    const volumeSliderHandle = document.querySelector('.volume-slider-handle');
    const volumeIcon = volumeBtn.querySelector('i');

    let isDragging = false;
    let currentVolume = 1;
    let isMuted = false;

    function updateVolumeUI(volume) {
        const percentage = volume * 100;
        volumeSliderFill.style.width = `${percentage}%`;
        volumeSliderHandle.style.left = `${percentage}%`;

        // Update icon based on volume level
        volumeIcon.className = 'fas';
        if (volume === 0) {
            volumeIcon.classList.add('fa-volume-mute');
        } else if (volume < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    function setVolume(volume) {
        currentVolume = Math.max(0, Math.min(1, volume));
        updateVolumeUI(currentVolume);
        
        // Update audio/video volume
        if (bgVideo) bgVideo.volume = currentVolume;
        if (bgMusic) bgMusic.volume = currentVolume;
    }

    volumeBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        setVolume(isMuted ? 0 : currentVolume || 1);
    });

    volumeSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = volumeSlider.getBoundingClientRect();
        const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        setVolume(volume);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = volumeSlider.getBoundingClientRect();
            const volume = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(volume);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Mouse wheel volume control
    volumeControl.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setVolume(currentVolume + delta);
    });
});

// Add magnetic effect to social buttons
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const moveX = (x - centerX) / 8;
        const moveY = (y - centerY) / 8;
        
        gsap.to(btn, {
            x: moveX,
            y: moveY,
            duration: 0.3,
            ease: "power2.out"
        });
        
        // Move icon slightly more for depth effect
        const icon = btn.querySelector('i');
        gsap.to(icon, {
            x: moveX * 1.2,
            y: moveY * 1.2,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.8)"
        });
        
        const icon = btn.querySelector('i');
        gsap.to(icon, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.8)"
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    initCanvas();
    createRipple();
});

// Initialize background video
bgVideo.addEventListener('loadeddata', () => {
    bgVideo.muted = true;
    bgVideo.play().catch(err => console.log('Video autoplay failed:', err));
});

bgVideo.addEventListener('error', (e) => {
    console.error('Video error:', e);
});

bgVideo.addEventListener('canplay', () => {
    bgVideo.muted = true; // Ensure video is muted for autoplay
});

function showProfileCard() {
    // Create a timeline for the transition
    const tl = gsap.timeline();
    
    // Fade out quote section with quick 3D effect
    tl.to('.quote-section', {
        opacity: 0,
        scale: 0.9,
        rotateX: -15,
        y: -30,
        duration: 0.4,
        ease: "power2.inOut"
    });
    
    // Hide snow effect
    tl.to('#snow-canvas', {
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut"
    }, "-=0.3");
    
    // Show and enhance background video
    tl.add(() => {
        bgVideo.classList.add('visible');
        // Create ripple effect
        createRipple(window.innerWidth / 2, window.innerHeight / 2);
    }, "-=0.1");
    
    // Show profile card with epic entrance
    tl.add(() => {
        profileCard.style.visibility = 'visible';
        
        // Prepare card elements for animation
        gsap.set('.profile-picture', { scale: 0.5, opacity: 0, y: 20 });
        gsap.set('.profile-name', { opacity: 0, y: 15 });
        gsap.set('.profile-quote', { opacity: 0, y: 10 });
        gsap.set('.social-btn', { opacity: 0, x: -15 });
    }, "-=0.2");
    
    // Animate card and its elements
    tl.to(profileCard, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.4)"
    })
    .to('.profile-picture', {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
    }, "-=0.2")
    .to('.profile-name', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.4)"
    }, "-=0.2")
    .to('.profile-quote', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "back.out(1.4)"
    }, "-=0.2")
    .to('.social-btn', {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "back.out(1.4)"
    }, "-=0.2");
    
    // Add hover effect to card
    profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        gsap.to('.card-content', {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.3,
            ease: "power2.out"
        });
    });
    
    profileCard.addEventListener('mouseleave', () => {
        gsap.to('.card-content', {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.8)"
        });
    });
}
