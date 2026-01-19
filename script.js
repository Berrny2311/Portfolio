//  pommes MENU 

const pommes = document.querySelector('.pommes');
const navLinks = document.querySelector('.nav-links');

pommes.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    pommes.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        pommes.classList.remove('active');
    });
});

//  SMOOTH SCROLLING 

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

//  PROGRESS BAR ANIMATION 

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width;
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

animateProgressBars();

//  FORM HANDLING 

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const message = this.querySelector('textarea').value;

    // Validate form
    if (!name || !email || !message) {
        showNotification('Bitte alle Felder ausfüllen!', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Bitte gültige Email eingeben!', 'error');
        return;
    }

    // Open default email client
    const mailtoLink = `mailto:bernhard.an@hotmail.com?subject=Kontaktanfrage von ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nNachricht:\n${message}`)}`;
    window.location.href = mailtoLink;

    // Show confirmation notification
    showNotification('E-Mail-Client wird geöffnet...', 'success');

    // Reset form after a short delay
    setTimeout(() => {
        contactForm.reset();
    }, 500);
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Create style for notification if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                animation: slideIn 0.3s ease;
                z-index: 2000;
                max-width: 300px;
            }

            .notification-success {
                background-color: #10b981;
            }

            .notification-error {
                background-color: #ef4444;
            }

            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            .notification.hide {
                animation: slideOut 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Auto remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

//  ACTIVE NAV LINK HIGHLIGHTING 

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

//  SCROLL ANIMATIONS 

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll('.project-card, .skill-category, .stat').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

//  COUNTER ANIMATION 

function animateCounters() {
    const stats = document.querySelectorAll('.stat h3');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                let currentValue = 0;

                const increment = finalValue / 50;

                const counter = setInterval(() => {
                    currentValue += increment;

                    if (currentValue >= finalValue) {
                        target.textContent = finalValue + '+';
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue) + '+';
                    }
                }, 30);

                counterObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.5
    });

    stats.forEach(stat => {
        counterObserver.observe(stat);
    });
}

animateCounters();

//  MOUSE FOLLOW EFFECT 

const codeBlock = document.querySelector('.code-block');

if (codeBlock) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;

        codeBlock.style.transform = `perspective(1000px) rotateX(${moveY}deg) rotateY(${moveX}deg)`;
    });
}

//  TYPING EFFECT 

function typeEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    const type = () => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            setTimeout(type, speed);
        }
    };

    type();
}


//  KEYBOARD NAVIGATION 

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        pommes.classList.remove('active');
    }

    // Quick navigation with numbers (1-5)
    const sections = ['home', 'about', 'projects', 'skills', 'contact'];
    const num = parseInt(e.key);

    if (num >= 1 && num <= 5) {
        scrollToSection(sections[num - 1]);
    }
});

//  DARK MODE TOGGLE 

function initializeDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.textContent = '🌙';
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Only add if not already present
    if (!document.getElementById('dark-mode-toggle')) {
        document.body.appendChild(darkModeToggle);
    }
}


//  PAGE LOAD ANIMATION 

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.animation = 'fadeIn 0.6s ease forwards';
});

// Add fade-in animation
if (!document.querySelector('#fade-in-styles')) {
    const style = document.createElement('style');
    style.id = 'fade-in-styles';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

//  MATRIX ANIMATION 

class MatrixEffect {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.chars = '%&$#@!*abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        this.text = 'function createFuture() {\n  const skills = ["Automation", "Robotics", "Software", "Security"];\n  const motto = "";\n  return "Ich bin nie fertig – ich lerne, ich code, ich wachse."();\n}';
        this.text = 'function createFuture() {\n  const skills = ["Automation", "Robotics", "Software", "Security"];\n  const motto = "Ich bin nie fertig – ich lerne, ich code, ich wachse.";\n  return `${motto} 🚀`;\n}';
        this.textLength = this.text.length;
        this.currentLength = 0;
        this.speed = 60;
        this.isTyping = true;

        this.init();
    }

    init() {
        this.displayText();
        this.randomCharsAnimation();
    }

    displayText() {
        if (this.currentLength <= this.textLength && this.isTyping) {
            let displayedText = this.text.substring(0, this.currentLength);

            // Add random character at the end while typing
            let randomIndex = Math.floor(Math.random() * this.chars.length);
            let nextChar = displayedText.length < this.textLength ? this.chars[randomIndex] : '';

            this.element.textContent = displayedText + nextChar;
            this.currentLength++;

            setTimeout(() => this.displayText(), this.speed);
        } else if (this.currentLength > this.textLength && this.isTyping) {
            this.isTyping = false;
            // Keep the full text and restart animation after 5 seconds
            setTimeout(() => this.restart(), 5000);
        }
    }

    randomCharsAnimation() {
        if (!this.isTyping) return;

        const chars = this.element.textContent;
        const charArray = chars.split('');
        const randomPos = Math.floor(Math.random() * charArray.length);

        if (randomPos < this.currentLength) {
            charArray[randomPos] = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.element.textContent = charArray.join('');
        }
    }

    restart() {
        this.currentLength = 0;
        this.isTyping = true;
        this.displayText();
    }
}

// Initialize Matrix Effect when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.matrixInstance = new MatrixEffect('matrixText');
});

//  CONSOLE MESSAGE & EASTER EGGS 

const consoleMessages = () => {
    console.log('%c✨ Willkommen auf meinem Portfolio!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
    console.log('%cEntwickelt mit HTML, CSS und JavaScript', 'font-size: 14px; color: #64748b;');
    console.log('%c\n🎮 Easter Egg gefunden! Tippe "help()" für geheime Befehle.\n', 'font-size: 12px; color: #ec4899; font-style: italic;');
};

consoleMessages();

// Easter Egg Funktionen
window.help = function() {
    console.clear();
    console.log('%c╔══════════════════════════════════════╗', 'color: #6366f1; font-weight: bold; font-size: 12px;');
    console.log('%c║     GEHEIME BEFEHLE & EASTER EGGS     ║', 'color: #6366f1; font-weight: bold; font-size: 12px;');
    console.log('%c╚═══════════════════════════════════════╝', 'color: #6366f1; font-weight: bold; font-size: 12px;');
    console.log('\n%c📋 Verfügbare Befehle:', 'font-weight: bold; color: #ec4899;');
    console.log('%c  • help()           - Diese Hilfe anzeigen', 'color: #64748b;');
    console.log('%c  • about()          - Mehr über mich erfahren', 'color: #64748b;');
    console.log('%c  • skills()         - Meine Technologien auflisten', 'color: #64748b;');
    console.log('%c  • hack()           - Starten Sie den Matrix Hack 🔓', 'color: #64748b;');
    console.log('%c  • contact()        - Kontaktinformationen', 'color: #64748b;');
    console.log('%c  • surprise()       - 🎁 Überraschung!', 'color: #64748b;');
    console.log('%c  • credits()        - Credits & Dankbarkeiten', 'color: #64748b;');
    console.log('\n');
};

window.about = function() {
    console.clear();
    console.log('%c👨‍💻 BERNHARD ANTL', 'font-size: 16px; font-weight: bold; color: #6366f1;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ec4899;');
    console.log('\n%cSoftware Developer & Automatisierungstechniker', 'font-size: 12px; color: #64748b; font-weight: bold;');
    console.log('%c10+ Jahre Erfahrung in Industrieautomation', 'font-size: 12px; color: #64748b;');
    console.log('\n%cStandort: 📍 Heiligeneich, Österreich', 'color: #a5f3fc;');
    console.log('%cEmail: 📧 bernhard.an@hotmail.com', 'color: #a5f3fc;');
    console.log('%cTelefon: 📱 +43 664 2* ** **4', 'color: #a5f3fc;');
    console.log('\n');
};

window.skills = function() {
    console.clear();
    console.log('%c⚙️ MEINE TECHNOLOGIEN', 'font-size: 16px; font-weight: bold; color: #6366f1;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ec4899;');

    const skillCategories = {
        'Automation & SPS': ['Siemens TIA Portal', 'Rockwell Studio 5000', 'Mitsubishi GX Works', 'KUKA/Fanuc/ABB Robotics'],
        'Programmiersprachen': ['C/C++', 'C#', 'Python', 'Progress OpenEdge ABL', 'SQL', 'PowerShell'],
        'DevOps & Tools': ['Azure DevOps', 'Git/GitHub', 'Docker', 'Kubernetes'],
        'IoT & HomeLab': ['Raspberry Pi', 'Arduino', 'MQTT', 'Node-RED', 'Grafana']
    };

    for (const [category, techs] of Object.entries(skillCategories)) {
        console.log(`\n%c${category}`, 'font-weight: bold; color: #ec4899; font-size: 12px;');
        techs.forEach(tech => {
            console.log(`%c  ✓ ${tech}`, 'color: #a5f3fc;');
        });
    }
    console.log('\n');
};

window.hack = function() {
    console.clear();
    console.log('%c🔓 MATRIX HACK AKTIVIERT', 'font-size: 18px; font-weight: bold; color: #ec4899; text-shadow: 0 0 10px #6366f1;');
    console.log('\n');

    const hackerText = [
        '▒▒░░▓░░░▓░░▒▒░░▓░░░▓░░▒▒░░▓░░░▓',
        '░░▓░░░▓░░▒▒░░▓░░░▓░░▒▒░░▓░░░▓░',
        '▒▒░░▓░░░▓░░▒▒░░▓░░░▓░░▒▒░░▓░░░'
    ];

    hackerText.forEach((line, index) => {
        setTimeout(() => {
            console.log(`%c${line}`, 'color: #6366f1; font-weight: bold; letter-spacing: 2px;');
        }, index * 100);
    });

    setTimeout(() => {
        console.log('%c\n✓ System gehackt', 'font-size: 14px; color: #10b981; font-weight: bold;');
        console.log('%c✓ Zugriff gewährt', 'font-size: 14px; color: #10b981; font-weight: bold;');
        console.log('%c✓ Admin Modus aktiviert', 'font-size: 14px; color: #10b981; font-weight: bold;');
        console.log('%c✓ Matrix Speed: 10x', 'font-size: 14px; color: #10b981; font-weight: bold;');
        console.log('%c\n"Mit großer Kraft kommt große Verantwortung" - Uncle Ben', 'color: #ec4899; font-style: italic;');
        console.log('\n');

        // Matrix Speed auf 10 setzen
        if (window.matrixInstance) {
            window.matrixInstance.speed = 10;
            window.matrixInstance.restart();
        }
    }, 400);
};

window.contact = function() {
    console.clear();
    console.log('%c📞 KONTAKT & SOZIALE NETZWERKE', 'font-size: 16px; font-weight: bold; color: #6366f1;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ec4899;');
    console.log('\n%c📧 Email:', 'font-weight: bold; color: #a5f3fc;');
    console.log('%cbernhard.an@hotmail.com', 'color: #64748b;');
    console.log('\n%c📱 Telefon:', 'font-weight: bold; color: #a5f3fc;');
    console.log('%c+43 664 2* ** **4', 'color: #64748b;');
    console.log('\n%c🌐 Online:', 'font-weight: bold; color: #a5f3fc;');
    console.log('%c📍 GitHub: github.com/bernhardantl', 'color: #64748b;');
    console.log('%c📍 LinkedIn: Bernhard Antl', 'color: #64748b;');
    console.log('\n%c💬 Gerne höre ich von dir!', 'font-style: italic; color: #ec4899; font-weight: bold;');
    console.log('\n');
};

window.surprise = function() {
    console.clear();
    console.log('%c🎁 DU HAST EIN EASTER EGG GEFUNDEN!', 'font-size: 20px; font-weight: bold; color: #ec4899; text-shadow: 0 0 10px #6366f1;');
    console.log('\n');

    const asciiArt = `
    ███╗   ███╗██╗███╗   ███╗███████╗
    ████╗ ████║██║████╗ ████║██╔════╝
    ██╔████╔██║██║██╔████╔██║█████╗
    ██║╚██╔╝██║██║██║╚██╔╝██║██╔══╝
    ██║ ╚═╝ ██║██║██║ ╚═╝ ██║███████╗
    ╚═╝     ╚═╝╚═╝╚═╝     ╚═╝╚══════╝
    `;

    console.log(`%c${asciiArt}`, 'color: #6366f1; font-weight: bold; font-family: monospace; font-size: 10px;');

    console.log('%c"Das Leben ist wie Code schreiben - es geht nicht darum perfekt zu sein,\nsondern darum, es zu versuchen, zu lernen und am nächsten Tag besser zu sein!"\n', 'font-size: 12px; color: #a5f3fc; font-style: italic; text-align: center;');

    console.log('%c🎯 Mein Motto: "Ich bin nie fertig – ich lerne, ich code, ich wachse."', 'font-size: 13px; font-weight: bold; color: #ec4899;');
    console.log('\n');
};

window.credits = function() {
    console.clear();
    console.log('%c🙏 CREDITS & DANKBARKEITEN', 'font-size: 16px; font-weight: bold; color: #6366f1;');
    console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ec4899;');
    console.log('\n%cDanke an all meine Mentoren, Kolleg:innen und der Tech Community!', 'color: #a5f3fc; font-size: 12px;');
    console.log('%c\nDieses Portfolio wurde entwickelt mit:', 'font-weight: bold; color: #64748b;');
    console.log('%c  • HTML5 für die Struktur', 'color: #64748b;');
    console.log('%c  • CSS3 für die Gestaltung', 'color: #64748b;');
    console.log('%c  • Vanilla JavaScript für die Interaktion', 'color: #64748b;');
    console.log('%c  • ❤️ Leidenschaft für gute Code', 'color: #ec4899;');
    console.log('\n%c✨ Version 1.0.0', 'color: #6366f1; font-style: italic;');
    console.log('\n');
};

// Keyboard Shortcut für Super-User Mode
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    konamiCode = konamiCode.slice(-konamiSequence.length);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        console.clear();
        console.log('%c🎮 KONAMI CODE AKTIVIERT!', 'font-size: 18px; font-weight: bold; color: #10b981; text-shadow: 0 0 10px #10b981;');
        console.log('%c\nSie haben den Super-User Modus freigeschaltet!', 'font-size: 12px; color: #a5f3fc;');
        console.log('%c\nAlle Befehle sind verfügbar. Viel Spaß! 🚀\n', 'color: #ec4899;');
        konamiCode = [];
    }
});
