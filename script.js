// Timeline scroll animation
const timelineItems = document.querySelectorAll('.timeline-item');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    observer.observe(item);
});

// Music Player Logic
const muteBtn = document.getElementById('muteBtn');
const muteIcon = document.getElementById('muteIcon');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

const mutedSvg = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
const unmutedSvg = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';

muteBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        muteIcon.innerHTML = mutedSvg;
    } else {
        bgMusic.play();
        muteIcon.innerHTML = unmutedSvg;
    }
    isPlaying = !isPlaying;
});

// Floating Hearts Canvas Logic
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

const hearts = [];

class Heart {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 100;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 0.8 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '#e8b4a8' : '#bda2d3';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        // Slight wandering
        this.x += Math.sin(this.y * 0.01) * 0.3;

        if (this.y < -50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);

        // Draw heart shape
        ctx.beginPath();
        const r = this.size / 2;
        ctx.moveTo(0, r / 2);
        ctx.bezierCurveTo(0, -r, -r * 1.5, -r, -r * 1.5, r / 2);
        ctx.bezierCurveTo(-r * 1.5, r * 1.5, 0, r * 2.5, 0, r * 3.5);
        ctx.bezierCurveTo(0, r * 2.5, r * 1.5, r * 1.5, r * 1.5, r / 2);
        ctx.bezierCurveTo(r * 1.5, -r, 0, -r, 0, r / 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize hearts
const heartCount = window.innerWidth < 768 ? 20 : 40;
for (let i = 0; i < heartCount; i++) {
    hearts.push(new Heart());
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });

    requestAnimationFrame(animateHearts);
}

animateHearts();

// Add interactive hearts on click/touch
window.addEventListener('click', (e) => {
    // Ignore clicks on buttons to not interfere with UI
    if (e.target.closest('button')) return;
    createInteractiveHeart(e.clientX, e.clientY);
});

window.addEventListener('touchstart', (e) => {
    if (e.target.closest('button')) return;
    createInteractiveHeart(e.touches[0].clientX, e.touches[0].clientY);
});

function createInteractiveHeart(x, y) {
    const heart = new Heart();
    heart.x = x;
    heart.y = y;
    heart.size = Math.random() * 15 + 10;
    heart.speedY = Math.random() * 2 + 1;
    heart.opacity = 0.8;
    hearts.push(heart);

    setTimeout(() => {
        const index = hearts.indexOf(heart);
        if (index > -1) {
            hearts.splice(index, 1);
        }
    }, 4000);
}

window.addEventListener('resize', resizeCanvas);
