/**
 * Angel Alon - Portfolio JavaScript
 * Interactive Features, Audio Synthesizer, Clipboard Actions & Aesthetic Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initBannerEyeAnimation();
  initSkillsProgress();
  initTypewriter();
  initPetals();
  initTulipWidget();
  initProjectFilters();
  initScrollSpy();
  initMobileNav();
  initThemeToggle();
  initQuickTodo();
});

function initSkillsProgress() {
  document.querySelectorAll('.skill-bubble').forEach(bubble => {
    const level = bubble.getAttribute('data-level') || '50%';
    bubble.style.setProperty('--skill-percent', level);
  });
}

/* ==========================================================================
   1. Contact Clipboard Copying & Toasts
   ========================================================================== */
const CONTACT_DATA = {
  email: 'angelalon0923@gmail.com',
  phone: '+63 968 729 1851',
  facebook: 'https://www.facebook.com/angel.alon.300289',
  instagram: 'https://www.instagram.com/not.ur.andreii/',
  github: 'https://github.com/ZephyrArtia'
};

function copyContact(type) {
  const textToCopy = CONTACT_DATA[type] || type;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      if (type === 'facebook') {
        showToast('Copied Facebook link to clipboard! 🌷');
      } else if (type === 'instagram') {
        showToast('Copied Instagram link to clipboard! 🌸');
      } else if (type === 'github') {
        showToast('Copied GitHub profile URL to clipboard! 🐙');
      } else {
        showToast(`Copied ${textToCopy} to clipboard! 🌷`);
      }
    }).catch(() => {
      fallbackCopy(textToCopy);
    });
  } else {
    fallbackCopy(textToCopy);
  }

  // Play cute chime sound
  playSynthesizedSound('bubble');
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied ${text} to clipboard! 🌷`);
  } catch (err) {
    showToast(`Contact: ${text}`);
  }
  document.body.removeChild(textArea);
}

function showToast(message, icon = 'fa-solid fa-heart') {
  const toastHub = document.getElementById('toastHub');
  if (!toastHub) return;

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;

  toastHub.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3200);
}

/* ==========================================================================
   2. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const phrases = [
    'Creative Web Developer & Digital Creator',
    'Pastel & Aesthetic UI/UX Designer',
    'Frontend Explorer & Problem Solver',
    'Crafting Delightful Web Experiences 🌷',
    'Building Responsive, Accessible Websites'
  ];

  const targetEl = document.getElementById('typedText');
  if (!targetEl) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function typeTick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      targetEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      targetEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typingSpeed = 2200; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(typeTick, typingSpeed);
  }

  typeTick();
}

/* ==========================================================================
   3. Floating Flower Petals / Sparkles Background
   ========================================================================== */
let petalsActive = true;
let petalInterval = null;

function initPetals() {
  const container = document.getElementById('particlesContainer');
  const toggleBtn = document.getElementById('petalToggleBtn');
  if (!container) return;

  const icons = ['🌸', '🌷', '✨', '🤍', '🌿', '🎀'];

  function spawnPetal() {
    if (!petalsActive) return;

    const petal = document.createElement('div');
    petal.className = 'floating-petal';
    petal.textContent = icons[Math.floor(Math.random() * icons.length)];
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${8 + Math.random() * 9}s`;
    petal.style.fontSize = `${0.9 + Math.random() * 0.9}rem`;
    petal.style.opacity = `${0.4 + Math.random() * 0.45}`;

    container.appendChild(petal);

    setTimeout(() => {
      if (petal.parentNode) {
        petal.parentNode.removeChild(petal);
      }
    }, 17000);
  }

  // Initial batch
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnPetal, i * 400);
  }

  petalInterval = setInterval(spawnPetal, 1400);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      petalsActive = !petalsActive;
      const tooltip = toggleBtn.querySelector('.gadget-tooltip');
      if (tooltip) {
        tooltip.textContent = `Petals: ${petalsActive ? 'ON' : 'OFF'}`;
      }
      if (!petalsActive) {
        container.innerHTML = '';
        showToast('Petal animations paused ✨');
      } else {
        showToast('Petals blooming again 🌸');
      }
    });
  }
}

/* ==========================================================================
   4. Tulip Garden Clicker Widget
   ========================================================================== */
function initTulipWidget() {
  const tapBtn = document.getElementById('tulipTapBtn');
  const countEl = document.getElementById('tulipCount');
  if (!tapBtn || !countEl) return;

  let count = parseInt(localStorage.getItem('angel_tulips') || '56', 10);
  countEl.textContent = count;

  tapBtn.addEventListener('click', (e) => {
    count++;
    countEl.textContent = count;
    localStorage.setItem('angel_tulips', count);

    // Burst animation
    spawnBurstHeart(e.clientX, e.clientY);
    playSynthesizedSound('gentleChord');
    showToast(`You gave Angel a Tulip! 🌷 Total: ${count}`);
  });
}

function spawnBurstHeart(x, y) {
  const floater = document.createElement('div');
  floater.textContent = '🌷';
  floater.style.position = 'fixed';
  floater.style.left = `${x || window.innerWidth / 2}px`;
  floater.style.top = `${y || window.innerHeight / 2}px`;
  floater.style.fontSize = '2rem';
  floater.style.pointerEvents = 'none';
  floater.style.zIndex = '9999';
  floater.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
  floater.style.transform = 'translate(-50%, -50%) scale(0.6)';

  document.body.appendChild(floater);

  requestAnimationFrame(() => {
    const randomAngle = (Math.random() - 0.5) * 80;
    floater.style.transform = `translate(calc(-50% + ${randomAngle}px), -120px) scale(1.4)`;
    floater.style.opacity = '0';
  });

  setTimeout(() => {
    if (floater.parentNode) {
      floater.parentNode.removeChild(floater);
    }
  }, 1100);
}

/* ==========================================================================
   5. Procedural Web Audio API Synthesizer (Lofi & Soft Sound Effects)
   ========================================================================== */
let audioCtx = null;
let ambientOscillator = null;
let ambientGain = null;
let isAmbiencePlaying = false;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSynthesizedSound(type) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'bubble') {
    // Cute bubble pop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  } else if (type === 'gentleChord') {
    // Dreamy 3-note pastel chord (C-E-G / 523, 659, 783)
    const freqs = [523.25, 659.25, 783.99];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + idx * 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + 0.9 + idx * 0.05);
    });
  } else if (type === 'harp') {
    // Gentle ascending arpeggio
    const freqs = [440, 554.37, 659.25, 880, 1108.73];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + 0.7 + idx * 0.08);
    });
  } else if (type === 'sparkle') {
    // Magic sparkle
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900 + Math.random() * 800, now + i * 0.06);
      gain.gain.setValueAtTime(0.08, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35 + i * 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + 0.4 + i * 0.06);
    }
  }
}

// Continuous Cozy Ambient Drone
function toggleAmbience() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const musicIcon = document.getElementById('musicIcon');
  const musicTooltip = document.getElementById('musicTooltip');
  const mainPlayIcon = document.getElementById('mainPlayIcon');
  const mainPlayText = document.getElementById('mainPlayText');

  if (isAmbiencePlaying) {
    if (ambientGain) {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientOscillator) {
          try { ambientOscillator.stop(); } catch(e){}
        }
      }, 500);
    }
    isAmbiencePlaying = false;
    if (musicIcon) musicIcon.className = 'fa-solid fa-music';
    if (musicTooltip) musicTooltip.textContent = 'Lofi Ambience: OFF';
    if (mainPlayIcon) mainPlayIcon.className = 'fa-solid fa-play';
    if (mainPlayText) mainPlayText.textContent = 'Start Continuous Cozy Drone';
    showToast('Cozy Ambience paused');
  } else {
    ambientOscillator = ctx.createOscillator();
    ambientGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    ambientOscillator.type = 'triangle';
    ambientOscillator.frequency.setValueAtTime(220, ctx.currentTime); // Soft A3 note

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    ambientGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 1.2);

    ambientOscillator.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOscillator.start();
    isAmbiencePlaying = true;

    if (musicIcon) musicIcon.className = 'fa-solid fa-volume-high';
    if (musicTooltip) musicTooltip.textContent = 'Lofi Ambience: PLAYING';
    if (mainPlayIcon) mainPlayIcon.className = 'fa-solid fa-pause';
    if (mainPlayText) mainPlayText.textContent = 'Pause Cozy Drone';
    showToast('Cozy pastel ambience playing 🎶');
  }
}

document.getElementById('soundToggleBtn')?.addEventListener('click', toggleAmbience);
document.getElementById('mainLofiToggleBtn')?.addEventListener('click', toggleAmbience);

/* ==========================================================================
   6. Project Filters
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 30);
        } else {
          card.style.display = 'none';
        }
      });

      playSynthesizedSound('bubble');
    });
  });
}

/* SafeSteps.PH Preview Switcher */
window.switchSafeStepsPreview = function(num, e) {
  if (e) e.stopPropagation();
  const imgEl = document.getElementById('safeStepsImg');
  if (!imgEl) return;
  
  imgEl.style.opacity = '0.3';
  setTimeout(() => {
    imgEl.src = num === 2 ? 'assets/safesteps_preview2.png' : 'assets/safesteps_preview1.png';
    imgEl.style.opacity = '1';
  }, 140);

  // Update button active state
  const switcher = imgEl.parentElement?.querySelector('.project-thumb-switcher');
  if (switcher) {
    const btns = switcher.querySelectorAll('.thumb-btn');
    btns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === (num - 1));
    });
  }
  playSynthesizedSound('bubble');
};

/* ==========================================================================
   7. Interactive Project Demo Modals
   ========================================================================== */
const DEMO_TEMPLATES = {
  safesteps: {
    icon: '🏝️',
    title: 'SafeSteps.PH - Cebu Tourism & Travel Safety Portal',
    content: `
      <div style="display:flex; flex-direction:column; gap:18px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <h4 style="font-size:1.15rem; color:var(--clr-text-main); margin-bottom:4px; font-weight:700;">
              SafeSteps.PH (SS.PH) – Cebu Travel Hub
            </h4>
            <p style="font-size:0.85rem; color:var(--clr-text-muted);">
              A responsive Philippine tourism portal combining curated travel destinations with emergency safety guides.
            </p>
          </div>
          <a href="https://github.com/ZephyrArtia" target="_blank" rel="noopener noreferrer" class="btn btn-pill btn-github btn-sm">
            <i class="fa-brands fa-github"></i>
            <span>GitHub @ZephyrArtia</span>
          </a>
        </div>

        <!-- Screenshot gallery / preview carousel -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:14px;">
          <div style="border-radius:14px; overflow:hidden; border:1px solid rgba(0,0,0,0.08); box-shadow:0 6px 18px rgba(0,0,0,0.06); background:#fff;">
            <img src="assets/safesteps_preview1.png" alt="SafeSteps.PH Home & Safety Portal" style="width:100%; height:190px; object-fit:cover; display:block; cursor:pointer;" onclick="window.open(this.src, '_blank')" title="Click to view full image">
            <div style="padding:10px 12px; font-size:0.82rem; font-weight:600; color:var(--clr-text-main); background:rgba(255,255,255,0.9); display:flex; justify-content:space-between; align-items:center;">
              <span><i class="fa-solid fa-map-location-dot" style="color:#0284c7; margin-right:6px;"></i> View 1: Main Portal & Guidelines</span>
              <span style="font-size:0.75rem; color:#888;">High Res ↗</span>
            </div>
          </div>
          <div style="border-radius:14px; overflow:hidden; border:1px solid rgba(0,0,0,0.08); box-shadow:0 6px 18px rgba(0,0,0,0.06); background:#fff;">
            <img src="assets/safesteps_preview2.png" alt="SafeSteps.PH Top 20 Spots & Tours" style="width:100%; height:190px; object-fit:cover; display:block; cursor:pointer;" onclick="window.open(this.src, '_blank')" title="Click to view full image">
            <div style="padding:10px 12px; font-size:0.82rem; font-weight:600; color:var(--clr-text-main); background:rgba(255,255,255,0.9); display:flex; justify-content:space-between; align-items:center;">
              <span><i class="fa-solid fa-compass" style="color:#ea580c; margin-right:6px;"></i> View 2: Top 20 Cebu Spots & Tours</span>
              <span style="font-size:0.75rem; color:#888;">High Res ↗</span>
            </div>
          </div>
        </div>

        <!-- Key Features in Philippine Tourism Project -->
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
          <div style="background:rgba(2, 132, 199, 0.08); padding:14px; border-radius:14px; border:1px solid rgba(2, 132, 199, 0.2);">
            <strong style="color:#0284c7; font-size:0.9rem; display:block; margin-bottom:4px;">
              <i class="fa-solid fa-umbrella-beach"></i> Cebu Top 20 Spots
            </strong>
            <p style="font-size:0.82rem; color:var(--clr-text-muted); line-height:1.5;">
              Showcasing Kawasan Falls, Osmeña Peak, Magellan's Cross, Bantayan Island, and Sirao Flower Garden with entrance fees & directions.
            </p>
          </div>
          <div style="background:rgba(22, 163, 74, 0.08); padding:14px; border-radius:14px; border:1px solid rgba(22, 163, 74, 0.2);">
            <strong style="color:#16a34a; font-size:0.9rem; display:block; margin-bottom:4px;">
              <i class="fa-solid fa-shield-halved"></i> Travel Safety Protocols
            </strong>
            <p style="font-size:0.82rem; color:var(--clr-text-muted); line-height:1.5;">
              Safety guidelines for tourists, emergency hotline directory (PAGASA, MDRRMO, PNP), and weather preparedness alerts.
            </p>
          </div>
          <div style="background:rgba(234, 88, 12, 0.08); padding:14px; border-radius:14px; border:1px solid rgba(234, 88, 12, 0.2);">
            <strong style="color:#ea580c; font-size:0.9rem; display:block; margin-bottom:4px;">
              <i class="fa-solid fa-route"></i> Curated Itineraries & Tours
            </strong>
            <p style="font-size:0.82rem; color:var(--clr-text-muted); line-height:1.5;">
              Top 10 recommended day tours, island hopping packages, and local culinary food crawl guides.
            </p>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.6); padding:12px 16px; border-radius:14px; border:1px solid rgba(255,255,255,0.8); flex-wrap:wrap; gap:10px;">
          <span style="font-size:0.85rem; color:var(--clr-text-muted);">
            💡 Click either screenshot above to inspect the full image in a new tab.
          </span>
          <button class="btn btn-pill btn-primary-glow btn-sm" onclick="showToast('SafeSteps.PH is ready for your adventures! 🇵🇭')">
            <i class="fa-solid fa-heart"></i>
            <span>Awesome Project!</span>
          </button>
        </div>
      </div>
    `
  },
  tulip: {
    icon: '🌷',
    title: 'Tulip Bloom Workspace - Live Interactive View',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p style="color:var(--clr-text-muted);">
          Experience the serene minimalism of the <strong>Tulip Bloom Workspace</strong>. Designed with soft clay cards, warm pastel gradients, and built-in micro-tools.
        </p>
        <div style="background:linear-gradient(135deg, #FFE4EC, #DCF4E3); padding:20px; border-radius:18px; border:1px solid rgba(255,255,255,0.8); text-align:center;">
          <h4 style="font-size:1.2rem; color:#33242A; margin-bottom:6px;">🌷 Focus Session: 25:00</h4>
          <p style="font-size:0.85rem; color:#6E5D65; margin-bottom:14px;">Breathe in, stay cozy, and craft wonders.</p>
          <div style="display:flex; justify-content:center; gap:10px;">
            <button class="btn btn-pill btn-primary-glow btn-sm" onclick="showToast('Timer started! Enjoy your focus 🌷')">Start Timer</button>
            <button class="btn btn-pill btn-mint btn-sm" onclick="showToast('Cozy break time!')">Short Break</button>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="background:rgba(255,255,255,0.7); padding:14px; border-radius:14px;">
            <strong style="color:var(--clr-pink-500); font-size:0.85rem;">🌸 Daily Habits</strong>
            <p style="font-size:0.8rem; color:var(--clr-text-muted); margin-top:4px;">✔ Drink 2L water<br>✔ Code 2 hours<br>✔ Stretch & smile</p>
          </div>
          <div style="background:rgba(255,255,255,0.7); padding:14px; border-radius:14px;">
            <strong style="color:var(--clr-mint-500); font-size:0.85rem;">🌱 Notes</strong>
            <p style="font-size:0.8rem; color:var(--clr-text-muted); margin-top:4px;">“Small steps each day bloom into beautiful gardens.”</p>
          </div>
        </div>
      </div>
    `
  },
  anime: {
    icon: '✨',
    title: 'Sakura Anime Media Vault - Concept Details',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <p style="color:var(--clr-text-muted);">
          Inspired by the aesthetic pink eye banner and cozy anime artwork! Features glowing neon-pastel glass cards and mood curation.
        </p>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px;">
          <div style="background:#FFA8BF; height:70px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:700; font-size:0.8rem;">Sakura #FFA8BF</div>
          <div style="background:#BCE7C6; height:70px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#2E944B; font-weight:700; font-size:0.8rem;">Tulip #BCE7C6</div>
          <div style="background:#E9D5FF; height:70px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:#9333EA; font-weight:700; font-size:0.8rem;">Violet #E9D5FF</div>
        </div>
        <p style="font-size:0.85rem; color:var(--clr-text-muted); line-height:1.6;">
          Each card incorporates CSS backdrop-filter blur effects, responsive CSS grid layouts, and custom hover depth perspectives.
        </p>
      </div>
    `
  },
  calc: {
    icon: '🧮',
    title: 'Pastel Glass Calculator - Interactive Toy',
    content: `
      <div style="display:flex; flex-direction:column; gap:16px; align-items:center;">
        <div style="background:rgba(255, 235, 242, 0.85); padding:18px; border-radius:22px; width:260px; box-shadow:0 10px 25px rgba(244,63,110,0.15); border:1px solid rgba(255,255,255,0.9);">
          <div id="calcDisplay" style="background:#ffffff; border-radius:12px; padding:12px; text-align:right; font-size:1.4rem; font-weight:800; color:#33242A; margin-bottom:12px; min-height:48px; border:1px solid #FFCCD9; overflow:hidden;">0</div>
          <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;">
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('C')">C</button>
            <button class="btn btn-pill btn-mint btn-sm" onclick="calcInput('/')">/</button>
            <button class="btn btn-pill btn-mint btn-sm" onclick="calcInput('*')">×</button>
            <button class="btn btn-pill btn-rose btn-sm" onclick="calcInput('-')">-</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('7')">7</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('8')">8</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('9')">9</button>
            <button class="btn btn-pill btn-rose btn-sm" onclick="calcInput('+')">+</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('4')">4</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('5')">5</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('6')">6</button>
            <button class="btn btn-pill btn-primary-glow btn-sm" onclick="calcInput('=')">=</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('1')">1</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('2')">2</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('3')">3</button>
            <button class="btn btn-pill btn-pink btn-sm" onclick="calcInput('0')">0</button>
          </div>
        </div>
      </div>
    `
  }
};

let currentCalcExpr = '';

window.calcInput = function(val) {
  playSynthesizedSound('bubble');
  const display = document.getElementById('calcDisplay');
  if (!display) return;

  if (val === 'C') {
    currentCalcExpr = '';
    display.textContent = '0';
  } else if (val === '=') {
    try {
      // Safe arithmetic evaluation
      const sanitized = currentCalcExpr.replace(/[^0-9+\-*/.]/g, '');
      const res = Function(`'use strict'; return (${sanitized})`)();
      display.textContent = res;
      currentCalcExpr = String(res);
      playSynthesizedSound('harp');
    } catch(e) {
      display.textContent = 'Error';
      currentCalcExpr = '';
    }
  } else {
    if (currentCalcExpr === '0' && val !== '.') currentCalcExpr = '';
    currentCalcExpr += val;
    display.textContent = currentCalcExpr;
  }
};

function openDemoModal(key) {
  const modal = document.getElementById('demoModal');
  const titleEl = document.getElementById('modalTitle');
  const iconEl = document.getElementById('modalIcon');
  const bodyEl = document.getElementById('modalBody');

  const demo = DEMO_TEMPLATES[key];
  if (!demo || !modal) return;

  titleEl.textContent = demo.title;
  iconEl.textContent = demo.icon;
  bodyEl.innerHTML = demo.content;

  modal.classList.add('active');
  playSynthesizedSound('sparkle');
}

function closeDemoModal() {
  const modal = document.getElementById('demoModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal on escape or background click
document.getElementById('demoModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'demoModal') {
    closeDemoModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDemoModal();
});

/* ==========================================================================
   8. Interactive To-Do Pad
   ========================================================================== */
function initQuickTodo() {
  const form = document.getElementById('quickTodoForm');
  const input = document.getElementById('quickTodoInput');
  const list = document.getElementById('todoList');
  if (!form || !input || !list) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;

    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <span class="todo-check" onclick="toggleTodoItem(this)"><i class="fa-solid fa-check"></i></span>
      <span class="todo-text">${escapeHtml(val)}</span>
      <button class="todo-del" onclick="removeTodoItem(this)" aria-label="Remove item"><i class="fa-solid fa-xmark"></i></button>
    `;

    list.prepend(li);
    input.value = '';
    playSynthesizedSound('gentleChord');
    showToast('Task added to your list! 🌸');
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.toggleTodoItem = function(checkEl) {
  const item = checkEl.closest('.todo-item');
  if (item) {
    item.classList.toggle('done');
    playSynthesizedSound('bubble');
    if (item.classList.contains('done')) {
      showToast('Yay! Task completed ✨');
    }
  }
};

window.removeTodoItem = function(btnEl) {
  const item = btnEl.closest('.todo-item');
  if (item) {
    item.style.opacity = '0';
    item.style.transform = 'translateX(20px)';
    setTimeout(() => {
      item.remove();
    }, 200);
  }
};

/* ==========================================================================
   9. Contact Form Submission
   ========================================================================== */
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.senderName.value.trim();
  const email = form.senderEmail.value.trim();
  const subject = form.senderSubject.value.trim();
  const message = form.senderMessage.value.trim();

  // Create formatted mailto URL
  const recipient = 'angelalon0923@gmail.com';
  const mailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
  const mailBody = encodeURIComponent(`Hi Angel,\n\n${message}\n\nFrom: ${name} (${email})`);
  const mailtoUrl = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;

  // Launch email client
  window.location.href = mailtoUrl;

  showToast(`Thank you ${name}! Launching your email client... 🌷`);
  playSynthesizedSound('sparkle');
  form.reset();
}

/* ==========================================================================
   10. ScrollSpy & Navigation
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === `#${currentId}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const links = document.getElementById('navLinks');
  const icon = document.getElementById('menuIcon');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isShow = links.classList.toggle('show');
    if (icon) {
      icon.className = isShow ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  // Close on nav link click
  links.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      links.classList.remove('show');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   11. Theme Switcher (Pastel Bloom vs Night Velvet)
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('themeModeBtn');
  const themeIcon = document.getElementById('themeIcon');
  if (!themeBtn) return;

  // Check saved theme
  const savedTheme = localStorage.getItem('angel_theme') || 'pastel';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'pastel' ? 'dark' : 'pastel';

    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('angel_theme', newTheme);
    updateThemeIcon(newTheme);

    playSynthesizedSound('bubble');
    showToast(newTheme === 'dark' ? 'Night Sakura Velvet Mode 🌙' : 'Pastel Tulip Bloom Mode 🌷');
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   12. Interactive Animated Banner: Eye Movement & Blinking Engine
   ========================================================================== */
function initBannerEyeAnimation() {
  const canvas = document.getElementById('bannerEyeCanvas');
  const bannerFrame = document.getElementById('heroBannerFrame');
  const hintChip = document.getElementById('bannerEyeHint');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Assets to load
  const imgBase = new Image();
  const imgIrisL = new Image();
  const imgIrisR = new Image();
  const imgLashes = new Image();

  let loadedCount = 0;
  const totalImages = 4;
  function onImgLoad() {
    loadedCount++;
    if (loadedCount === totalImages) {
      startAnimationLoop();
    }
  }

  imgBase.onload = onImgLoad;
  imgIrisL.onload = onImgLoad;
  imgIrisR.onload = onImgLoad;
  imgLashes.onload = onImgLoad;

  imgBase.src = 'assets/banner_sclera_smooth.png';
  imgIrisL.src = 'assets/iris_left_clean.png';
  imgIrisR.src = 'assets/iris_right_clean.png';
  imgLashes.src = 'assets/banner_lashes.png';

  // Eye movement tracking state
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  // Idle saccade timer
  let lastMouseMoveTime = performance.now();
  let idleGazeTimer = performance.now() + 2500;

  function pickRandomGaze() {
    const glances = [
      { x: 0, y: 0 },       // Center gaze
      { x: -6, y: -1 },     // Glance upper left
      { x: 6, y: -1 },      // Glance upper right
      { x: -8, y: 1 },      // Glance left
      { x: 8, y: 1 },       // Glance right
      { x: 0, y: 2 },       // Glance slightly down
      { x: -3, y: 0 },      // Subtle soft glance
      { x: 3, y: 0 }
    ];
    const pick = glances[Math.floor(Math.random() * glances.length)];
    targetX = pick.x;
    targetY = pick.y;
  }

  // Pointer tracking
  function handlePointerMove(clientX, clientY) {
    lastMouseMoveTime = performance.now();
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;

    // Normalize coordinates relative to window
    const normX = (clientX - centerX) / (window.innerWidth * 0.5);
    const normY = (clientY - centerY) / (window.innerHeight * 0.4);

    const clampedX = Math.max(-1, Math.min(1, normX));
    const clampedY = Math.max(-1, Math.min(1, normY));

    // Maximum eye travel: ±11px horizontal, -4px to +3.5px vertical
    targetX = clampedX * 11;
    targetY = clampedY * 3.8;
  }

  window.addEventListener('mousemove', (e) => {
    handlePointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Interactive click on banner: subtle glance & sparkle sound
  function onBannerClick(e) {
    e.stopPropagation();
    pickRandomGaze();
    playSynthesizedSound('sparkle');
    showToast('The eyes are tracking your cursor! ✨');
  }

  if (bannerFrame) bannerFrame.addEventListener('click', onBannerClick);
  if (hintChip) hintChip.addEventListener('click', onBannerClick);

  // Main 60 FPS Render Loop (Iris tracks cursor with zero blinking)
  function startAnimationLoop() {
    function tick(now) {
      // 1. Natural idle glances if no cursor movement for 2.8s
      if (now - lastMouseMoveTime > 2800) {
        if (!idleGazeTimer || now > idleGazeTimer) {
          pickRandomGaze();
          idleGazeTimer = now + 1800 + Math.random() * 2600;
        }
      }

      // 2. Smooth spring / lerp damping
      currentX += (targetX - currentX) * 0.085;
      currentY += (targetY - currentY) * 0.085;

      // 3. Draw Canvas Frame
      renderCanvasFrame(currentX, currentY);

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function renderCanvasFrame(dx, dy) {
    ctx.clearRect(0, 0, 736, 224);

    // Step 1: Base face with eye sockets / sclera
    ctx.drawImage(imgBase, 0, 0, 736, 224);

    // Step 2: Draw Left Eye (Clipped iris tracking cursor)
    ctx.save();
    ctx.beginPath();
    // Upper curve
    for (let x = 135; x <= 305; x += 8) {
      const topY = 137.0 + Math.pow((x - 215.0) / 75.0, 2) * 16.0;
      if (x === 135) ctx.moveTo(x, topY);
      else ctx.lineTo(x, topY);
    }
    // Lower curve
    for (let x = 305; x >= 135; x -= 8) {
      const botY = 163.0 - Math.pow((x - 215.0) / 75.0, 2) * 5.0;
      ctx.lineTo(x, botY);
    }
    ctx.closePath();
    ctx.clip();

    // Moving left iris
    ctx.drawImage(imgIrisL, 176 + dx, 132 + dy);
    ctx.restore();

    // Step 3: Draw Right Eye (Clipped iris tracking cursor)
    ctx.save();
    ctx.beginPath();
    // Upper curve
    for (let x = 480; x <= 635; x += 8) {
      const topY = 97.0 + Math.pow((x - 555.0) / 75.0, 2) * 18.0;
      if (x === 480) ctx.moveTo(x, topY);
      else ctx.lineTo(x, topY);
    }
    // Lower curve
    for (let x = 635; x >= 480; x -= 8) {
      const botY = 126.0 - Math.pow((x - 555.0) / 75.0, 2) * 7.0;
      ctx.lineTo(x, botY);
    }
    ctx.closePath();
    ctx.clip();

    // Moving right iris
    ctx.drawImage(imgIrisR, 517 + dx, 93 + dy);
    ctx.restore();

    // Step 4: Draw eyelashes, permanent facial contours & hair bangs in front
    ctx.drawImage(imgLashes, 0, 0, 736, 224);
  }
}
