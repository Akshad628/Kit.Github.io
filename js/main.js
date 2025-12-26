// 1. INITIALIZE LENIS SMOOTH SCROLL
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. SCROLL REVEAL OBSERVER
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Optional: Stop observing once revealed
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const elementsToReveal = document.querySelectorAll('.reveal-text, .reveal-fade, .reveal-slide-right, .reveal-slide-left');
elementsToReveal.forEach(el => revealObserver.observe(el));


// 3. NAVBAR ACTIVE STATE & CLICK LOGIC (UPDATED WITH LOGO SWAP)
const navbar = document.getElementById('navbar');
const navInner = document.getElementById('nav-inner');
const navLinks = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('section, footer');

// NEW: Select the two logo images
const logoHome = document.getElementById('logo-home');
const logoScroll = document.getElementById('logo-scroll');

function updateActiveLink() {
    let current = '';
    const navHeight = navbar.offsetHeight;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'contact';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - navHeight - 150)) {
                current = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('nav-active');
        }
    });
}

// Consolidated Scroll Handler
window.addEventListener('scroll', () => {
    // Threshold: 50px from top
    if (window.scrollY > 50) {
        // SCROLLED DOWN STATE
        navInner.classList.remove('h-24');
        navInner.classList.add('h-16');

        // Navbar becomes white glass
        navbar.classList.add('backdrop-blur-md', 'bg-white/80', 'shadow-sm');

        // LOGO SWAP: Hide Home Logo, Show Scroll Logo
        if (logoHome) logoHome.classList.replace('opacity-100', 'opacity-0');
        if (logoScroll) logoScroll.classList.replace('opacity-0', 'opacity-100');

    } else {
        // TOP (HOME) STATE
        navInner.classList.add('h-24');
        navInner.classList.remove('h-16');

        // Navbar becomes transparent
        navbar.classList.remove('backdrop-blur-md', 'bg-white/80', 'shadow-sm');

        // LOGO SWAP: Show Home Logo, Hide Scroll Logo
        if (logoHome) logoHome.classList.replace('opacity-0', 'opacity-100');
        if (logoScroll) logoScroll.classList.replace('opacity-100', 'opacity-0');
    }

    updateActiveLink();
});


// ... Keep your click handlers as they were ...

// Run on scroll
window.addEventListener('scroll', () => {
    // Glassmorphism effect
    if (window.scrollY > 50) {
        navInner.classList.remove('h-24');
        navInner.classList.add('h-16');
        navbar.classList.add('backdrop-blur-md', 'bg-white/80', 'shadow-sm');
    } else {
        navInner.classList.add('h-24');
        navInner.classList.remove('h-16');
        navbar.classList.remove('backdrop-blur-md', 'bg-white/80', 'shadow-sm');
    }

    updateActiveLink();
});

// Click Handler (Smooth Scroll with Offset)
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Offset logic so header doesn't cover title
            const headerOffset = 100;

            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(targetSection, { offset: -headerOffset });
            } else {
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

window.addEventListener('scroll', () => {
    // Shrink Navbar on Scroll
    if (window.scrollY > 50) {
        navInner.classList.remove('h-24');
        navInner.classList.add('h-16');
        navbar.classList.add('backdrop-blur-md', 'bg-white/80', 'shadow-sm');
    } else {
        navInner.classList.add('h-24');
        navInner.classList.remove('h-16');
        navbar.classList.remove('backdrop-blur-md', 'bg-white/80', 'shadow-sm');
    }

    updateActiveLink();
});

// Click Handler to fix "About" section getting hidden behind navbar
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Calculate position - header height so it doesn't get covered
            const headerOffset = 100;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            // Use Lenis for scroll if available, otherwise fallback
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(targetSection, { offset: -headerOffset });
            } else {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});

// 4. PARALLAX EFFECT FOR IMAGES
window.addEventListener('scroll', () => {
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        const speed = img.getAttribute('data-speed');
        const yPos = -(window.scrollY * speed);
        img.style.transform = `translateY(${yPos}px)`;
    });
});

// 5. SERVICE CARD STACKING EFFECT
const cards = document.querySelectorAll('.service-card');
const stackObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const index = Array.from(cards).indexOf(entry.target);
        if (!entry.isIntersecting && entry.boundingClientRect.top <= 0) {
            // Card is scrolling out top
            entry.target.style.transform = `scale(${1 - (index * 0.05)}) translateY(-${index * 20}px)`;
            entry.target.style.filter = `brightness(${1 - (index * 0.1)})`;
        } else {
            // Card is active
            entry.target.style.transform = `scale(1) translateY(0)`;
            entry.target.style.filter = `brightness(1)`;
        }
    });
}, { threshold: 0, rootMargin: "-10% 0px -90% 0px" });

cards.forEach(card => stackObserver.observe(card));

// 6. ANIMATED COUNTERS
const counters = document.querySelectorAll('.counter');
const startCounters = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out quart
                const ease = 1 - Math.pow(1 - progress, 4);

                counter.innerText = Math.floor(ease * target).toLocaleString();

                if (progress < 1) requestAnimationFrame(update);
                else counter.innerText = target.toLocaleString() + "+";
            };
            requestAnimationFrame(update);
            observer.unobserve(counter);
        }
    });
};
const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));



// 7. TESTIMONIALS 3D SLIDER (SEMI-AUTOMATIC)
new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 30,
    loop: true,

    // 3D Visual Settings
    coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 2.5,
        slideShadows: false,
    },

    // PAGINATION (Dots at bottom)
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    // SEMI-AUTOMATIC BEHAVIOR
    autoplay: {
        delay: 2000,                // Slides every 2 seconds
        disableOnInteraction: false, // If user swipes, it resumes autoplaying afterwards
        pauseOnMouseEnter: true      // Pauses when mouse hovers (so they can read long text)
    }
});




// 8. SMART CHAT WIDGET LOGIC
const chatWidget = document.getElementById('ai-widget');
const chatWindow = document.getElementById('chat-window');
const chatToggle = document.getElementById('chat-toggle');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

let isOpen = false;

// A. KNOWLEDGE BASE (The Brain)
// This contains specific data from your HTML content
const botKnowledge = {
    greetings: ["hello", "hi", "hey", "start", "good morning"],
    services: ["service", "offer", "provide", "do you do", "capabilities"],
    staffing: ["staffing", "hiring", "recruit", "talent", "contract"],
    engineering: ["engineering", "digital", "react", "node", "aws", "cloud", "devops"],
    enterprise: ["enterprise", "sap", "salesforce", "erp", "business software"],
    ai: ["ai", "artificial intelligence", "data", "ml", "python", "gen ai"],
    qa: ["qa", "testing", "quality", "selenium", "cypress", "automation"],
    security: ["security", "cyber", "protection", "compliance", "pen testing"],
    careers: ["career", "job", "opening", "work", "vacancy", "hiring", "join", "resume"],
    contact: ["contact", "email", "phone", "call", "address", "location", "office", "reach"],
    about: ["about", "who are you", "company", "krisintek", "since"]
};

// 9. PRE-DEFINED RESPONSES
const botResponses = {
    default: "I'm not sure I understand specific details about that, but our team definitely does. You can email us at <span class='font-bold text-[#C8102E]'>info@krisintek.com</span> or call (703) 348 2223.",
    greeting: "Hello! I am the Krisintek AI Assistant. I can answer questions about our Services, Open Roles, or Company details. How can I help?",
    services: "We specialize in 6 core areas: Strategic Staffing, Digital Engineering, Enterprise Solutions, AI & Data Intelligence, QA Automation, and Cyber Security.",
    staffing: "We offer both Contract-to-Hire and Direct Placement staffing. We deploy high-impact talent aligned with your technical goals.",
    engineering: "Our Digital Engineering team builds scalable solutions using React, Node.js, AWS, Azure, and Kubernetes.",
    enterprise: "We streamline business processes using top-tier ERP implementations like SAP S/4HANA and Salesforce.",
    ai: "We help businesses harness the power of Python, Machine Learning, and Generative AI to drive smarter decisions.",
    qa: "Quality is our standard. We implement rigorous automated testing using Selenium, Cypress, and API Automation.",
    security: "We protect digital assets with Pen Testing, SecOps, and Compliance management.",
    careers: "We are currently hiring for: <br>1. <b>Sr. Java Engineer</b> (Remote)<br>2. <b>.NET Architect</b> (Hybrid)<br>3. <b>QA Automation</b> (On-Site)<br>You can send your resume to careers@krisintek.com.",
    contact: "You can visit us at <b>13800 Coppermine Rd, Herndon, VA</b>.<br>Phone: +1 (703) 348 2223<br>Email: info@krisintek.com",
    about: "Krisintek has been innovating since 2017. We modernize complex workflows and connect top-tier talent with world-class technology."
};

// C. LOGIC ENGINE
const getBotResponse = (input) => {
    const text = input.toLowerCase();

    // 1. Check Greetings
    if (botKnowledge.greetings.some(k => text.includes(k))) return botResponses.greeting;

    // 2. Check Specific Services
    if (botKnowledge.staffing.some(k => text.includes(k))) return botResponses.staffing;
    if (botKnowledge.engineering.some(k => text.includes(k))) return botResponses.engineering;
    if (botKnowledge.enterprise.some(k => text.includes(k))) return botResponses.enterprise;
    if (botKnowledge.ai.some(k => text.includes(k))) return botResponses.ai;
    if (botKnowledge.qa.some(k => text.includes(k))) return botResponses.qa;
    if (botKnowledge.security.some(k => text.includes(k))) return botResponses.security;

    // 3. General Categories
    if (botKnowledge.services.some(k => text.includes(k))) return botResponses.services;
    if (botKnowledge.careers.some(k => text.includes(k))) return botResponses.careers;
    if (botKnowledge.contact.some(k => text.includes(k))) return botResponses.contact;
    if (botKnowledge.about.some(k => text.includes(k))) return botResponses.about;

    return botResponses.default;
};

// D. UI INTERACTION
const toggleChat = () => {
    isOpen = !isOpen;
    if (isOpen) {
        chatWindow.classList.remove('invisible', 'opacity-0', 'scale-90', 'translate-y-10');
        chatWindow.classList.add('opacity-100', 'scale-100', 'translate-y-0');
        setTimeout(() => chatInput.focus(), 300);
    } else {
        chatWindow.classList.remove('opacity-100', 'scale-100', 'translate-y-0');
        chatWindow.classList.add('opacity-0', 'scale-90', 'translate-y-10');
        setTimeout(() => chatWindow.classList.add('invisible'), 300);
    }
};

chatToggle?.addEventListener('click', toggleChat);
closeChat?.addEventListener('click', toggleChat);

const addMessage = (text, sender) => {
    const div = document.createElement('div');
    div.className = `flex ${sender === 'user' ? 'justify-end' : 'items-start gap-3'} animate-fade-in-up`;

    if (sender === 'user') {
        div.innerHTML = `
            <div class="bg-[#C8102E] text-white p-4 rounded-2xl rounded-tr-none shadow-md text-sm max-w-[80%] leading-relaxed">
                ${text}
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 text-slate-600 font-bold text-[10px]">AI</div>
            <div class="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-slate-600 border border-slate-100 leading-relaxed">
                ${text}
            </div>
        `;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
};

chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage(text, 'user');
    chatInput.value = '';

    // 2. Simulate "Thinking" Delay
    // Shows "Typing..." state or just delays slightly for realism
    setTimeout(() => {
        const response = getBotResponse(text);
        addMessage(response, 'bot');
    }, 600);
});


// 9. PRELOADER LOGIC
document.addEventListener("DOMContentLoaded", () => {
    const preloader = document.getElementById('preloader');
    const loaderText = document.getElementById('loader-text');
    const loaderBar = document.getElementById('loader-bar');
    const loaderCounter = document.getElementById('loader-counter');

    // 1. SETUP: Break "KRISINTEK" into individual letters
    const originalString = "KRISINTEK";
    loaderText.innerHTML = '';

    const spans = [];
    [...originalString].forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.classList.add('letter');
        loaderText.appendChild(span);
        spans.push(span);
    });

    // Reveal text initially
    setTimeout(() => {
        loaderText.classList.remove('translate-y-full');
    }, 100);

    // 2. LOADER LOOP
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 1;
        if (progress > 100) progress = 100;

        loaderBar.style.width = `${progress}%`;
        loaderCounter.innerText = `${progress}%`;

        // 3. AT 100% - START THE ANIMATION SEQUENCE
        if (progress === 100) {
            clearInterval(interval);

            // PHASE 1: Wait 0.8s, then Morph "KRISINTEK" -> "KITS."
            setTimeout(() => {
                // Swap letters
                spans[3].innerText = 'T';
                spans[6].innerText = 'S';
                spans[8].innerText = '.';

                // Squeeze out the extras
                const indicesToRemove = [1, 4, 5, 7];
                spans.forEach((span, index) => {
                    if (indicesToRemove.includes(index)) {
                        span.classList.add('squeeze');
                    }
                });

                // PHASE 2: Hold "KITS." for 2 seconds, then transition to Tagline
                setTimeout(() => {

                    // A. Fade out "KITS."
                    loaderText.style.transition = "opacity 0.5s ease";
                    loaderText.style.opacity = "0";

                    // B. Wait for fade out, then swap text
                    setTimeout(() => {
                        // Insert new tagline with specific styling
                        loaderText.innerHTML = `
                            <span class="text-3xl md:text-3xl font-light tracking-[0.2em] text-white uppercase">
                                Engineering <span class="text-[#C8102E] font-bold">Excellence</span>
                            </span>
                        `;

                        // Fade in the Tagline
                        loaderText.style.opacity = "1";

                        // PHASE 3: Hold Tagline for 2.5 seconds, then Open Site
                        setTimeout(() => {
                            preloader.style.transition = "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)";
                            preloader.style.transform = "translateY(-100%)";
                        }, 2000); // READ TIME: 2.5 seconds

                    }, 300); // FADE TIME: 0.5 seconds

                }, 2000); // HOLD "KITS.": 2 seconds

            }, 700); // INITIAL DELAY
        }
    }, 30);
});




//10 send message fix
function sendToGmail() {
    // 1. Get values
    const name = document.getElementById('contact-name').value;
    const message = document.getElementById('contact-message').value;

    // We don't need 'email' because Gmail automatically sends from the user's account

    // 2. Map Name to Subject
    const subject = `${name} - Website Inquiry`;

    // 3. Map Message to Body (Clean, no extra text)
    const body = message;

    // 4. Construct Link
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@krisintek.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 5. Open
    window.open(gmailUrl, '_blank');
}







// 11. TERMINAL TYPING EFFECT
const terminalContent = document.getElementById('terminal-content');
if (terminalContent) {
    const logs = [
        { text: "> ESTABLISHING SECURE CONNECTION...", color: "text-gray-400" },
        { text: "> ACCESSING NEURAL_NET_V5 [ROOT]", color: "text-white" },
        { text: "> ...", color: "text-gray-500" },
        { text: "> BYPASSING FIREWALL... SUCCESS", color: "text-green-400" },
        { text: "> LOAD MODULE: AGENTIC_AI_WORKFORCE", color: "text-white" },
        { text: "> OPTIMIZING VECTORS... 99.9%", color: "text-blue-400" },
        { text: "> SCANNING FOR VULNERABILITIES...", color: "text-gray-400" },
        { text: "> 0 THREATS DETECTED. ZERO_TRUST ACTIVE.", color: "text-green-400" },
        { text: "> INITIATING DEPLOYMENT SEQUENCE...", color: "text-[#C8102E]" },
        { text: "> WELCOME TO KRISINTEK.", color: "text-white font-bold" }
    ];

    let logIndex = 0;
    let charIndex = 0;

    function typeLog() {
        if (logIndex < logs.length) {
            const currentLog = logs[logIndex];

            // Create a new line if it's the start of a log
            if (charIndex === 0) {
                const line = document.createElement('div');
                line.className = `${currentLog.color} font-mono tracking-wide`;
                line.id = `log-${logIndex}`;
                terminalContent.appendChild(line);
            }

            // Type character
            const lineElement = document.getElementById(`log-${logIndex}`);
            lineElement.textContent += currentLog.text.charAt(charIndex);
            charIndex++;

            // Scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;

            // Check if line finished
            if (charIndex < currentLog.text.length) {
                // Random typing speed for realism (20ms to 80ms)
                setTimeout(typeLog, Math.random() * 60 + 20);
            } else {
                // Line finished, wait before next line
                charIndex = 0;
                logIndex++;
                setTimeout(typeLog, 400);
            }
        }
    }

    // Start typing after a short delay (e.g., after preloader)
    setTimeout(typeLog, 2500);
}