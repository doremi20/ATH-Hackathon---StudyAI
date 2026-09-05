// Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const faders = document.querySelectorAll('.fade-in');
const toast = document.getElementById('toast');

// State
let studyData = {
    problem: '',
    days: 0,
    subjects: 0,
    hours: 0,
    difficulty: 'medium',
    progress: 0,
    completedTasks: 0,
    totalTasks: 0,
    streak: 0,
    planGenerated: false
};



// Scroll Effects
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Mobile Menu
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if(mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if(icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        });
    });
}

// Navigation
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Fade in animations
function setupIntersectionObserver() {
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

    faders.forEach(fader => {
        observer.observe(fader);
    });
}

// Logic - Analyze Problem
function analyzeProblem() {
    const text = document.getElementById('problem-text').value;
    const days = parseInt(document.getElementById('input-days').value) || 10;
    const subjects = parseInt(document.getElementById('input-subjects').value) || 5;
    const hours = parseInt(document.getElementById('input-hours').value) || 4;
    const difficulty = document.getElementById('input-difficulty').value;

    if (!text && (!days || !subjects)) {
        showToast("Please provide details about your study problem.");
        return;
    }

    const btn = document.querySelector('.problem-section .btn-primary');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
    
    setTimeout(() => {
        // Save to state
        studyData = {
            ...studyData,
            problem: text,
            days: days,
            subjects: subjects,
            hours: hours,
            difficulty: difficulty,
            planGenerated: true,
            totalTasks: days * 3, // demo assumption
            completedTasks: studyData.completedTasks || 0,
            streak: studyData.streak || 1
        };
        saveData();
        
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Plan Generated';
        btn.style.background = '#38b000';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Update My Plan';
            btn.style.background = 'var(--primary-red)';
            renderDashboard();
            showToast("Study plan generated successfully!");
            document.getElementById('study-plan').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1000);

    }, 1500);
}

// Render Data
function renderDashboard() {
    // 1. Dashboard Stats
    animateCounter('stat-days', studyData.days);
    animateCounter('stat-subjects', studyData.subjects);
    animateCounter('stat-target', studyData.hours);
    
    let progressPct = studyData.totalTasks > 0 ? Math.round((studyData.completedTasks / studyData.totalTasks) * 100) : 0;
    studyData.progress = progressPct;
    animateCounter('stat-completion', progressPct);

    // Update Hero Stats
    document.getElementById('hero-days-left').textContent = `${studyData.days} Days Left`;
    document.getElementById('hero-subjects').textContent = `${studyData.subjects} Subjects`;
    document.getElementById('hero-progress').textContent = `${progressPct}%`;

    // 2. AI Response
    const aiResponse = document.getElementById('ai-response');
    aiResponse.style.display = 'block';
    
    document.getElementById('response-grid').innerHTML = `
        <div class="response-item"><i class="fa-regular fa-calendar-days"></i><h4>${studyData.days} Days</h4><p>Duration</p></div>
        <div class="response-item"><i class="fa-solid fa-book"></i><h4>${studyData.subjects}</h4><p>Subjects</p></div>
        <div class="response-item"><i class="fa-regular fa-clock"></i><h4>${studyData.hours} Hrs</h4><p>Daily Study</p></div>
    `;
    
    let strategyText = "Focus on high-weightage and difficult topics first.";
    if(studyData.days < 7) strategyText = "Short duration detected! Prioritize previous year questions and rapid revision over new concepts.";
    else if(studyData.difficulty === 'hard') strategyText = "Starting from scratch. We will focus on building fundamental concepts first before deep diving.";
    
    document.getElementById('response-strategy').innerHTML = `<strong>🎯 Strategy:</strong> ${strategyText}`;

    // 3. Generate Timeline
    const timeline = document.getElementById('plan-timeline');
    timeline.innerHTML = '';
    
    for(let i=1; i<=Math.min(studyData.days, 7); i++) { // Show max 7 days for demo
        const isCompletedDay = (studyData.completedTasks / 3) >= i;
        timeline.innerHTML += `
            <div class="timeline-item ${isCompletedDay ? 'completed' : ''}">
                <div class="timeline-content">
                    <h3>Day ${i}</h3>
                    <div class="timeline-task ${studyData.completedTasks > (i-1)*3 ? 'task-completed' : ''}">
                        <input type="checkbox" class="task-checkbox" ${studyData.completedTasks > (i-1)*3 ? 'checked' : ''} onchange="toggleTask(this)">
                        <span class="task-text">Subject ${(i % studyData.subjects) + 1} - Core Concepts</span>
                    </div>
                    <div class="timeline-task ${studyData.completedTasks > (i-1)*3 + 1 ? 'task-completed' : ''}">
                        <input type="checkbox" class="task-checkbox" ${studyData.completedTasks > (i-1)*3 + 1 ? 'checked' : ''} onchange="toggleTask(this)">
                        <span class="task-text">Practice Questions & Notes</span>
                    </div>
                    <div class="timeline-task ${studyData.completedTasks > (i-1)*3 + 2 ? 'task-completed' : ''}">
                        <input type="checkbox" class="task-checkbox" ${studyData.completedTasks > (i-1)*3 + 2 ? 'checked' : ''} onchange="toggleTask(this)">
                        <span class="task-text">Revision</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 4. Priorities
    document.getElementById('priority-list').innerHTML = `
        <div class="priority-item priority-high">
            <div><div class="priority-label">High Priority</div><div class="priority-title">Subject 1 (Hard Topics)</div></div>
            <div style="color:var(--primary-red)"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        </div>
        <div class="priority-item priority-medium">
            <div><div class="priority-label">Medium Priority</div><div class="priority-title">Subject 2 (Standard)</div></div>
            <div style="color:#f77f00"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
        </div>
        <div class="priority-item priority-low">
            <div><div class="priority-label">Low Priority</div><div class="priority-title">Subject 3 (Revision)</div></div>
            <div style="color:#38b000"><i class="fa-solid fa-star"></i></div>
        </div>
    `;

    // 5. Daily Schedule
    document.getElementById('schedule-list').innerHTML = `
        <div class="schedule-item">
            <div class="schedule-time">07:00 AM</div>
            <div class="schedule-desc">Morning Revision & Quick Read</div>
        </div>
        <div class="schedule-item">
            <div class="schedule-time">09:00 AM</div>
            <div class="schedule-desc">Subject 1 Deep Dive (${Math.round(studyData.hours/2)} Hours)</div>
        </div>
        <div class="schedule-item">
            <div class="schedule-time">01:00 PM</div>
            <div class="schedule-desc">Break & Refresh</div>
        </div>
        <div class="schedule-item">
            <div class="schedule-time">03:00 PM</div>
            <div class="schedule-desc">Subject 2 Practice (${Math.round(studyData.hours/2)} Hours)</div>
        </div>
        <div class="schedule-item">
            <div class="schedule-time">08:00 PM</div>
            <div class="schedule-desc">Mock Test / Previous Year Qs</div>
        </div>
    `;

    updateProgressSection();
    generateInsights();
}

// Tasks
function toggleTask(checkbox) {
    const taskContainer = checkbox.closest('.timeline-task');
    if(checkbox.checked) {
        taskContainer.classList.add('task-completed');
        studyData.completedTasks++;
        showToast("Task completed! 🎉");
    } else {
        taskContainer.classList.remove('task-completed');
        studyData.completedTasks = Math.max(0, studyData.completedTasks - 1);
    }
    saveData();
    updateProgressSection();
    
    // Check day completion
    const dayContent = checkbox.closest('.timeline-content');
    const allChecked = Array.from(dayContent.querySelectorAll('.task-checkbox')).every(cb => cb.checked);
    if(allChecked) {
        dayContent.parentElement.classList.add('completed');
    } else {
        dayContent.parentElement.classList.remove('completed');
    }
}

// Progress
function updateProgressSection() {
    if(!studyData.planGenerated) return;

    let pct = studyData.totalTasks > 0 ? Math.round((studyData.completedTasks / studyData.totalTasks) * 100) : 0;
    pct = Math.min(100, pct);
    
    // Circular
    const circ = document.getElementById('circular-progress');
    circ.style.background = `conic-gradient(var(--primary-red) ${pct * 3.6}deg, var(--border-color) 0deg)`;
    circ.querySelector('.value-container').textContent = `${pct}%`;

    // Bars
    document.getElementById('subj-comp-text').textContent = `${Math.floor(pct/100 * studyData.subjects)} / ${studyData.subjects}`;
    document.getElementById('subj-comp-bar').style.width = `${pct}%`;
    
    document.getElementById('topic-comp-text').textContent = `${studyData.completedTasks} / ${studyData.totalTasks}`;
    document.getElementById('topic-comp-bar').style.width = `${pct}%`;

    document.getElementById('hour-comp-text').textContent = `${Math.floor(pct/100 * studyData.days * studyData.hours)} / ${studyData.days * studyData.hours}`;
    document.getElementById('hour-comp-bar').style.width = `${pct}%`;

    // Update small stats
    document.getElementById('stat-completion').textContent = pct;
    document.getElementById('hero-progress').textContent = `${pct}%`;

    // Streak
    document.getElementById('streak-days').textContent = `${studyData.streak} Days`;
    const daysList = document.querySelectorAll('.streak-calendar .day');
    daysList.forEach((day, index) => {
        if(index < studyData.streak) {
            day.classList.add('active');
        }
    });

    generateInsights();
}

function generateInsights() {
    if(!studyData.planGenerated) return;
    const container = document.getElementById('insights-container');
    container.innerHTML = '';

    let pct = studyData.totalTasks > 0 ? (studyData.completedTasks / studyData.totalTasks) * 100 : 0;

    if(pct < 30 && studyData.completedTasks > 0) {
        container.innerHTML += `<div class="insight-card warning"><div class="insight-icon">⚠️</div><p>You are currently behind your target. Consider increasing today's study time by 30-60 minutes.</p></div>`;
    } else if (pct >= 80) {
        container.innerHTML += `<div class="insight-card success"><div class="insight-icon">🎯</div><p>Excellent progress! Use your remaining time for revision and practice tests.</p></div>`;
    } else {
        container.innerHTML += `<div class="insight-card info"><div class="insight-icon">💡</div><p>You are progressing steadily. Focus on your high-priority topics today.</p></div>`;
    }

    if(studyData.streak > 3) {
        container.innerHTML += `<div class="insight-card fire"><div class="insight-icon">🔥</div><p>You've maintained a ${studyData.streak}-day study streak! Keep up the momentum.</p></div>`;
    }
}

// Doubts Chat
function askDoubt() {
    const input = document.getElementById('doubt-input');
    const msg = input.value.trim();
    if(!msg) return;

    appendChat('user', msg);
    input.value = '';

    // Scroll to bottom
    const history = document.getElementById('chat-history');
    history.scrollTop = history.scrollHeight;

    // Simulate AI
    setTimeout(() => {
        let aiResp = "That's a great question! Based on your query, here is a simplified explanation to help you understand better.";
        
        const lowerMsg = msg.toLowerCase();
        if(lowerMsg.includes('difference') || lowerMsg.includes('vs')) {
            aiResp = "Let's break down the differences. A Republic is a system where citizens elect representatives, and there is no monarch. A Democracy means rule by the people. While they overlap, a republic focuses on a constitution protecting rights, whereas pure democracy is majority rule.";
        } else if (lowerMsg.includes('practice') || lowerMsg.includes('questions')) {
            aiResp = "Here are 3 practice questions for you:<br>1. Define the core principles of federalism.<br>2. Give a real-world example of separation of powers.<br>3. Why is an independent judiciary important?";
        }

        appendChat('ai', aiResp);
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

function quickAsk(promptStr) {
    document.getElementById('doubt-input').value = promptStr + " ";
    document.getElementById('doubt-input').focus();
}

function appendChat(type, msg) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `chat-msg ${type}-msg fade-in visible`;
    
    let icon = type === 'ai' ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';
    
    div.innerHTML = `
        <div class="avatar">${icon}</div>
        <div class="msg-content">${msg}</div>
    `;
    history.appendChild(div);
}

// Utils
function animateCounter(id, endVal) {
    const obj = document.getElementById(id);
    let startVal = 0;
    let duration = 1500;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        obj.innerHTML = Math.floor(progress * (endVal - startVal) + startVal);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

function showToast(msg) {
    toast.textContent = msg;
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupIntersectionObserver();
    if(studyData.planGenerated) {
        renderDashboard();
    }
});

// Local Storage & API
function getStorageKey() {
    const currentUser = JSON.parse(localStorage.getItem('studyai_currentUser'));
    if (currentUser && currentUser.email) {
        return currentUser.email;
    }
    return null; // Guest user
}

async function saveData() {
    const email = getStorageKey();
    if (email) {
        // Logged in user: save to DB
        try {
            await fetch('http://127.0.0.1:5000/api/study-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...studyData, user_email: email })
            });
        } catch (error) {
            console.error('Failed to save to DB:', error);
        }
    }
    // Still save to local storage as fallback/guest
    localStorage.setItem('studyAI_data_' + (email || 'guest'), JSON.stringify(studyData));
}

async function loadData() {
    const email = getStorageKey();
    
    if (email) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/study-plan?email=${encodeURIComponent(email)}`);
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    studyData = {
                        problem: data.problem || '',
                        days: data.days || 0,
                        subjects: data.subjects || 0,
                        hours: data.hours || 0,
                        difficulty: data.difficulty || 'medium',
                        progress: data.progress || 0,
                        completedTasks: data.completedTasks || 0,
                        totalTasks: data.totalTasks || 0,
                        streak: data.streak || 0,
                        planGenerated: data.planGenerated || false
                    };
                }
            }
        } catch (error) {
            console.error('Failed to load from DB:', error);
            // Fallback to local storage
            fallbackLoad(email);
        }
    } else {
        fallbackLoad('guest');
    }

    // populate inputs if plan exists
    if(studyData.planGenerated) {
        const problemText = document.getElementById('problem-text');
        const inputDays = document.getElementById('input-days');
        const inputSubjects = document.getElementById('input-subjects');
        const inputHours = document.getElementById('input-hours');
        const inputDifficulty = document.getElementById('input-difficulty');
        
        if(problemText) problemText.value = studyData.problem || '';
        if(inputDays) inputDays.value = studyData.days || '';
        if(inputSubjects) inputSubjects.value = studyData.subjects || '';
        if(inputHours) inputHours.value = studyData.hours || '';
        if(inputDifficulty) inputDifficulty.value = studyData.difficulty || 'medium';
    }
}

function fallbackLoad(emailKey) {
    const saved = localStorage.getItem('studyAI_data_' + emailKey);
    if(saved) {
        studyData = JSON.parse(saved);
    } else {
        // Reset state if no data found
        studyData = {
            problem: '', days: 0, subjects: 0, hours: 0,
            difficulty: 'medium', progress: 0, completedTasks: 0,
            totalTasks: 0, streak: 0, planGenerated: false
        };
    }
}

// Sci-Fi Canvas Background Animation
const canvas = document.getElementById('sci-fi-bg');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = {
        x: null,
        y: null,
        radius: (canvas.height/80) * (canvas.width/80)
    }

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }
            
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < mouse.radius + this.size){
                if(mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if(mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if(mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if(mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1.5;
            let directionY = (Math.random() * 2) - 1.5;
            let color = 'rgba(230, 57, 70, 0.6)'; // Cyber Blue

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = 'rgba(230, 57, 70,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((innerHeight/80) * (innerWidth/80));
        init();
    });

    window.addEventListener('mouseout', function(){
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
}

const form = document.getElementById("loginForm");
if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login Successful! Redirecting...");
                window.location.href = "/dashboard"; // Change to your main page
            } else {
                alert(data.error || "Login Failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    });
}

// Check for logged in user
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('studyai_currentUser'));
    if (currentUser && currentUser.name) {
        const avatarBtns = document.querySelectorAll('.profile-avatar img');
        avatarBtns.forEach(img => {
            img.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.name) + '&background=random';
        });
    }
});

