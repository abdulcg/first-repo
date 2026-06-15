// ===== Interactive Cat – script.js =====

const cat          = document.getElementById('cat');
const catContainer = document.getElementById('cat-container');
const bubbleText   = document.getElementById('bubble-text');
const moodBadge    = document.getElementById('mood-badge');
const heartsEl     = document.getElementById('hearts');

// Eye elements for tracking
const pupilLeft   = document.getElementById('pupil-left');
const pupilRight  = document.getElementById('pupil-right');

// All eye groups
const eyeGroups = {
  normal:    document.getElementById('eyes'),
  happy:     document.getElementById('happy-eyes'),
  sleepy:    document.getElementById('sleepy-eyes'),
  surprised: document.getElementById('surprised-eyes'),
};

// Mouth elements
const mouthNormal = document.getElementById('mouth');
const mouthHappy  = document.getElementById('happy-mouth');

// ─── Reactions config ───────────────────────────────────────────────────────
const reactions = {
  pet: {
    messages: [
      'Purrrrr... 😻',
      'I love this! 💕',
      '*kneads paws happily*',
      'More please! 🥰',
    ],
    eyes:  'happy',
    mood:  'Happy 😻',
    moodClass: 'bg-pink-200 text-pink-700',
    mouth: 'happy',
  },
  feed: {
    messages: [
      'FISH! NOM NOM 🐟',
      'Delicious! 😋',
      '*chomps aggressively*',
      'Yummy in my tummy!',
    ],
    eyes:  'happy',
    mood:  'Stuffed 🍽️',
    moodClass: 'bg-yellow-200 text-yellow-700',
    mouth: 'happy',
  },
  scare: {
    messages: [
      'WHAT WAS THAT?! 😱',
      '*puffs up fur*',
      'I will destroy you!! 🙀',
      'HSSSSSS!',
    ],
    eyes:  'surprised',
    mood:  'Startled 😱',
    moodClass: 'bg-purple-200 text-purple-700',
    mouth: 'normal',
  },
  sleep: {
    messages: [
      'Zzzzzz... 😴',
      '*yawns loudly*',
      'Five more minutes...',
      'Do not disturb. 🛌',
    ],
    eyes:  'sleepy',
    mood:  'Sleepy 😴',
    moodClass: 'bg-blue-200 text-blue-700',
    mouth: 'normal',
  },
  play: {
    messages: [
      'YEET! 🧶',
      'Zoom zoom zoom!!',
      '*knocks things off table*',
      'CHAOS MODE ACTIVATED 🌀',
    ],
    eyes:  'happy',
    mood:  'Playful 🧶',
    moodClass: 'bg-green-200 text-green-700',
    mouth: 'happy',
  },
};

// ─── State tracking ──────────────────────────────────────────────────────────
let currentState  = 'idle';
let resetTimer    = null;

// ─── Main reaction function ──────────────────────────────────────────────────
function catReaction(type) {
  const r = reactions[type];
  if (!r) return;

  // Pick a random message
  const msg = r.messages[Math.floor(Math.random() * r.messages.length)];
  bubbleText.textContent = msg;

  // Switch eyes
  setEyes(r.eyes);

  // Switch mouth
  mouthNormal.style.display = r.mouth === 'normal' ? 'block' : 'none';
  mouthHappy.style.display  = r.mouth === 'happy'  ? 'block' : 'none';

  // Animate cat
  triggerAnimation(type);

  // Update mood badge
  moodBadge.textContent = r.mood;
  moodBadge.className = `px-4 py-1 rounded-full text-sm font-bold transition-all duration-500 ${r.moodClass}`;

  // Spawn hearts on pet/feed
  if (type === 'pet' || type === 'feed') spawnHearts();

  // Reset to idle after a delay (except sleep stays longer)
  clearTimeout(resetTimer);
  const delay = type === 'sleep' ? 4000 : 2500;
  resetTimer = setTimeout(resetToIdle, delay);
}

// ─── Eye switcher ────────────────────────────────────────────────────────────
function setEyes(state) {
  Object.entries(eyeGroups).forEach(([key, el]) => {
    el.style.display = key === state ? 'block' : 'none';
  });
}

// ─── CSS animation trigger ───────────────────────────────────────────────────
function triggerAnimation(state) {
  cat.classList.remove('state-pet', 'state-feed', 'state-scare', 'state-sleep', 'state-play');
  // Force reflow so re-adding the class restarts animation
  void cat.offsetWidth;
  cat.classList.add(`state-${state}`);
}

// ─── Reset to idle ───────────────────────────────────────────────────────────
function resetToIdle() {
  bubbleText.textContent = randomIdleMessage();
  setEyes('normal');
  mouthNormal.style.display = 'block';
  mouthHappy.style.display  = 'none';
  cat.classList.remove('state-pet', 'state-feed', 'state-scare', 'state-sleep', 'state-play');
  moodBadge.textContent  = 'Curious 🐱';
  moodBadge.className    = 'px-4 py-1 rounded-full text-sm font-bold transition-all duration-500 bg-orange-200 text-orange-700';
}

function randomIdleMessage() {
  const idle = [
    '...meow?',
    '*stares into void*',
    'I see you. 👀',
    'Pet me. NOW.',
    '...mrrrow',
  ];
  return idle[Math.floor(Math.random() * idle.length)];
}

// ─── Spawn floating hearts ───────────────────────────────────────────────────
function spawnHearts() {
  const emojis = ['❤️', '💕', '💖', '💗', '🩷'];
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'heart';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      heart.style.left = `${20 + Math.random() * 60}%`;
      heart.style.top  = `${30 + Math.random() * 30}%`;
      heartsEl.appendChild(heart);
      // Remove after animation
      heart.addEventListener('animationend', () => heart.remove());
    }, i * 120);
  }
}

// ─── Click on the cat itself ─────────────────────────────────────────────────
catContainer.addEventListener('click', () => {
  const clickReactions = ['pet', 'play', 'scare'];
  catReaction(clickReactions[Math.floor(Math.random() * clickReactions.length)]);
});

// ─── Hover – eyes follow cursor ──────────────────────────────────────────────
catContainer.addEventListener('mousemove', (e) => {
  if (currentState !== 'idle') return;   // don't override a reaction

  const rect   = cat.getBoundingClientRect();
  const svgW   = rect.width;
  const svgH   = rect.height;

  // Mouse position relative to SVG center (normalized -1 to 1)
  const mx = ((e.clientX - rect.left) / svgW - 0.5) * 2;
  const my = ((e.clientY - rect.top)  / svgH - 0.5) * 2;

  // Max pupil offset in SVG units
  const maxOffset = 3;

  // Left pupil base: cx=82, cy=90  |  Right pupil base: cx=118, cy=90
  const lx = 82  + mx * maxOffset;
  const ly = 90  + my * maxOffset;
  const rx = 118 + mx * maxOffset;
  const ry = 90  + my * maxOffset;

  pupilLeft.setAttribute('cx', lx);
  pupilLeft.setAttribute('cy', ly);
  pupilRight.setAttribute('cx', rx);
  pupilRight.setAttribute('cy', ry);
});

// Reset pupils when mouse leaves
catContainer.addEventListener('mouseleave', () => {
  pupilLeft.setAttribute('cx', '82');
  pupilLeft.setAttribute('cy', '90');
  pupilRight.setAttribute('cx', '118');
  pupilRight.setAttribute('cy', '90');
});

// ─── Keyboard support (accessibility) ────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const map = { p: 'pet', f: 'feed', s: 'scare', z: 'sleep', l: 'play' };
  if (map[e.key]) catReaction(map[e.key]);
});

// ─── Init ─────────────────────────────────────────────────────────────────────
setEyes('normal');
