/* ============================================================
   PORTFOLIO SCRIPT — Akash Mondal
   Features: Loader, Custom Cursor, Nav, Reveal Animations,
   Skill Bars, Tabs, Project Filters, Counter, Contact Form
============================================================ */

// ─── LOADER ───────────────────────────────────────────────
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let progress = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 50;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 50);
  }
  loaderFill.style.width = progress + '%';
}, 15);

document.body.style.overflow = 'hidden';

// Fallback - auto hide after minimal time
setTimeout(() => {
  if (!loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }
}, 400);

// ─── CUSTOM CURSOR ─────────────────────────────────────────
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .tech-logo, .about-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });
});

// ─── NAVIGATION ────────────────────────────────────────────
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Sticky nav
  nav.classList.toggle('scrolled', window.scrollY > 40);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
  spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── REVEAL ANIMATIONS ─────────────────────────────────────
function initAnimations() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  
  // Make ALL visible instantly - no delays between anything
  revealElements.forEach(el => el.classList.add('visible'));

  // Trigger counters and skill bars immediately too
  initCounters();
  initSkillBars();
}

// ─── COUNTER ANIMATION ─────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.dataset.count;
        let count = 0;
        const step = target / 60;
        const update = () => {
          count += step;
          if (count < target) {
            entry.target.textContent = Math.ceil(count);
            requestAnimationFrame(update);
          } else {
            entry.target.textContent = target;
          }
        };
        update();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ─── SKILL TABS ────────────────────────────────────────────
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skill-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    skillTabs.forEach(t => t.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.tab);
    panel.classList.add('active');
    // Animate bars in the new panel
    animateBarsInPanel(panel);
  });
});

function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activePanel = document.querySelector('.skill-panel.active');
        animateBarsInPanel(activePanel);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}

function animateBarsInPanel(panel) {
  if (!panel) return;
  panel.querySelectorAll('.skill-fill').forEach(bar => {
    const width = bar.dataset.width;
    setTimeout(() => { bar.style.width = width + '%'; }, 20);
  });
}

// ─── PROJECT FILTER ────────────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = 'fadeIn 0.4s ease';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// CONTACT FORM EMAILJS INTEGRATION

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    emailjs.send("service_c2nxfsa", "template_tn2j6ln", {
      from_name: name,
      from_email: email,
      subject: subject,
      message: message
    }, "oG_6EXtL6v0YGhKAj")
    .then(function(response) {
      contactForm.reset();
      btn.innerHTML = '<span>Send Message</span>';
      btn.disabled = false;

      formSuccess.classList.add('show');
      setTimeout(() => {
        formSuccess.classList.remove('show');
      }, 4000);

    }, function(error) {
      alert("Email send failed ❌");
      console.log(error);
      btn.innerHTML = '<span>Send Message</span>';
      btn.disabled = false;
    });
  });
}

// ─── COMING SOON MODAL ────────────────────────────────────
const modal = document.getElementById('comingSoonModal');
const modalClose = document.querySelector('.modal-close');
const projectBtns = document.querySelectorAll('.proj-btn');

// Open modal when clicking "View Project"
projectBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
});

// Close modal when clicking X
if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  });
}

// Close modal when clicking outside
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// ─── PARALLAX on scroll ────────────────────────────────────
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const speed = (i + 1) * 0.08;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// ─── TYPING ANIMATION (Section tags) ─────────────────────
// Re-animate on intersection
const floatingTags = document.querySelectorAll('.floating-tag');
// Already animated via CSS — no JS needed

// ─── TILT EFFECT on project cards ────────────────────────
projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.5s ease';
    setTimeout(() => card.style.transition = '', 500);
  });
});

// ─── ABOUT CARD TILT ──────────────────────────────────────
document.querySelectorAll('.about-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    card.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ─── TECH LOGO TOOLTIP ────────────────────────────────────
document.querySelectorAll('.tech-logo').forEach(logo => {
  const title = logo.getAttribute('title');
  if (title) {
    logo.addEventListener('mouseenter', () => {
      logo.style.setProperty('--tooltip', `"${title}"`);
    });
  }
});

// ─── CSS keyframe injection ────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ─── INIT on load ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }
  }, 300);
});

// Also trigger animations immediately after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }
  }, 200);
});
