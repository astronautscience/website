// ============================================================
// ASTRONAUTSCIENCE.COM - Interactive Pixel Art Landing Page
// ============================================================

// ---- STAR BACKGROUND ----
const starCanvas = document.getElementById('stars-bg');
const starCtx = starCanvas.getContext('2d');
let stars = [];

function resizeStarCanvas() {
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  stars = [];
  const count = Math.floor((starCanvas.width * starCanvas.height) / 3000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * starCanvas.width,
      y: Math.random() * starCanvas.height,
      size: Math.random() < 0.85 ? 1 : 2,
      speed: 0.1 + Math.random() * 0.4,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04
    });
  }
}

function drawStars() {
  starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

  // draw planets behind stars (far away feel)
  updatePlanets();
  planets.forEach(p => drawPlanet(starCtx, p));

  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const brightness = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
    starCtx.fillStyle = `rgba(200, 200, 255, ${brightness})`;
    starCtx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
    // slow drift
    s.y += s.speed * 0.15;
    if (s.y > starCanvas.height) {
      s.y = 0;
      s.x = Math.random() * starCanvas.width;
    }
  });
  requestAnimationFrame(drawStars);
}

// ---- PLANETS ----
const planets = [];

function createPlanets() {
  planets.length = 0;
  const planetDefs = [
    { // big ringed gas giant (Saturn-like)
      radius: 28,
      color: '#e8a84c',
      color2: '#c47a2a',
      stripe: '#d4943a',
      ring: true,
      ringColor: 'rgba(210,180,140,0.5)',
      ringColor2: 'rgba(180,150,100,0.3)',
    },
    { // blue ice planet (Neptune-like)
      radius: 20,
      color: '#4a8ee6',
      color2: '#2a5eaa',
      stripe: '#5a9ef6',
      ring: false,
    },
    { // small red planet (Mars-like)
      radius: 14,
      color: '#d45a3a',
      color2: '#a83a1a',
      stripe: '#c44a2a',
      ring: false,
    },
    { // purple planet with ring
      radius: 22,
      color: '#9b68ee',
      color2: '#6b38be',
      stripe: '#8b58de',
      ring: true,
      ringColor: 'rgba(155,104,238,0.4)',
      ringColor2: 'rgba(107,56,190,0.25)',
    },
    { // tiny green moon
      radius: 9,
      color: '#4ade80',
      color2: '#22863a',
      stripe: '#3ace70',
      ring: false,
    },
    { // pink/magenta planet
      radius: 16,
      color: '#e84a8a',
      color2: '#b82a6a',
      stripe: '#d83a7a',
      ring: false,
    },
  ];

  planetDefs.forEach((def, i) => {
    planets.push({
      ...def,
      x: Math.random() * starCanvas.width,
      y: 80 + Math.random() * (starCanvas.height - 160),
      speedX: (0.08 + Math.random() * 0.15) * (Math.random() < 0.5 ? 1 : -1),
      speedY: (0.02 + Math.random() * 0.06) * (Math.random() < 0.5 ? 1 : -1),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.003 + Math.random() * 0.005,
    });
  });
}

function drawPlanet(ctx, p) {
  const r = p.radius;
  const x = Math.floor(p.x);
  const y = Math.floor(p.y + Math.sin(p.wobble) * 8);

  // draw ring behind planet (bottom half)
  if (p.ring) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.1, r * 2.2, r * 0.5, 0, 0, Math.PI);
    ctx.strokeStyle = p.ringColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.1, r * 1.8, r * 0.4, 0, 0, Math.PI);
    ctx.strokeStyle = p.ringColor2;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  // planet body with pixel-style rendering
  for (let py = -r; py <= r; py++) {
    for (let px = -r; px <= r; px++) {
      const dist = Math.sqrt(px * px + py * py);
      if (dist <= r) {
        // shading: lighter on top-left, darker on bottom-right
        const shade = (px + py) / (r * 2);
        let color;
        // horizontal stripes for gas giant effect
        if (Math.abs(py) % 6 < 2) {
          color = p.stripe;
        } else if (shade < -0.2) {
          color = p.color;
        } else {
          color = p.color2;
        }
        // edge darkening
        const edgeFade = dist / r;
        const alpha = edgeFade > 0.85 ? 1 - (edgeFade - 0.85) * 5 : 1;

        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = color;
        // use 2x2 blocks for pixelated look
        ctx.fillRect(x + px * 2, y + py * 2, 2, 2);
      }
    }
  }
  ctx.globalAlpha = 1;

  // draw ring in front of planet (top half)
  if (p.ring) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.1, r * 2.2, r * 0.5, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = p.ringColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(x, y + r * 0.1, r * 1.8, r * 0.4, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = p.ringColor2;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }
}

function updatePlanets() {
  planets.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.wobble += p.wobbleSpeed;

    // wrap around screen edges
    const margin = p.radius * 3;
    if (p.x < -margin) p.x = starCanvas.width + margin;
    if (p.x > starCanvas.width + margin) p.x = -margin;
    if (p.y < -margin) p.y = starCanvas.height + margin;
    if (p.y > starCanvas.height + margin) p.y = -margin;
  });
}

createPlanets();

window.addEventListener('resize', () => {
  resizeStarCanvas();
  createPlanets();
});
resizeStarCanvas();
drawStars();


// ---- PIXEL ART T-REX IN SPACE SUIT (drawn on offscreen canvas) ----
const trexEl = document.getElementById('trex-follower');

const TREX_W = 24;
const TREX_H = 22;
const TREX_SCALE = 4;

function createTrexSprite() {
  const canvas = document.createElement('canvas');
  const s = TREX_SCALE;
  canvas.width = TREX_W * s;
  canvas.height = TREX_H * s;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // color palette
  const G = '#4ade80'; // green skin
  const D = '#22863a'; // dark green (nostril)
  const W = '#ffffff'; // white (eye, teeth)
  const K = '#111111'; // pupil
  const S = '#b0b0c8'; // suit silver
  const L = '#d0d0e8'; // suit highlight
  const H = '#7b68ee'; // helmet frame purple
  const V = '#2a2a6e'; // visor glass dark
  const O = '#ff6b2b'; // orange accent
  const _ = null;      // transparent

  // 24x22 T-Rex astronaut facing RIGHT with tail extending LEFT
  const sprite = [
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,H,H,H,H,H,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,H,H,V,V,V,V,V,H,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,H,V,G,G,G,G,G,V,V,H,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,H,V,G,G,W,K,G,G,V,V,H,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,H,V,G,G,G,G,G,G,V,V,H,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,H,V,G,G,G,G,G,G,G,V,H,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,H,D,G,G,G,G,G,G,G,H,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,H,W,_,W,_,G,G,H,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,H,H,H,H,H,H,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,L,S,S,S,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,S,S,O,S,S,S,S,S,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,S,L,S,S,S,S,S,S,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,S,G,G,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,S,O,O,O,O,S,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,S,S,S,S,S,S,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,S,S,S,_,S,S,_,S,S,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,S,S,S,_,_,_,S,S,_,S,S,_,_,_,_],
    [_,_,_,_,_,_,_,S,S,S,_,_,_,_,_,S,S,_,S,S,_,_,_,_],
    [_,_,_,_,_,S,S,S,_,_,_,_,_,_,O,O,S,_,S,O,O,_,_,_],
    [_,_,_,S,S,S,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,G,G,G,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
    [_,G,G,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];

  sprite.forEach((row, y) => {
    row.forEach((color, x) => {
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * s, y * s, s, s);
      }
    });
  });

  return canvas.toDataURL();
}

// Flipped version (facing left) - mirrors the sprite programmatically
function createTrexSpriteFlipped() {
  const canvas = document.createElement('canvas');
  const s = TREX_SCALE;
  canvas.width = TREX_W * s;
  canvas.height = TREX_H * s;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // draw the right-facing sprite onto a temp canvas, then flip
  const img = new Image();
  img.src = trexRight;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);

  return canvas.toDataURL();
}

const trexRight = createTrexSprite();
const trexLeft = createTrexSpriteFlipped();
trexEl.style.backgroundImage = `url(${trexRight})`;
trexEl.style.backgroundSize = 'contain';
trexEl.style.backgroundRepeat = 'no-repeat';

// ---- CURSOR FOLLOWING ----
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let trexX = mouseX;
let trexY = mouseY;
let lastDir = 'right';

function updateTrex() {
  const dx = mouseX - trexX;
  const dy = mouseY - trexY;
  // smooth follow with slight lag
  trexX += dx * 0.08;
  trexY += dy * 0.08;

  // flip based on direction
  if (dx > 2 && lastDir !== 'right') {
    trexEl.style.backgroundImage = `url(${trexRight})`;
    lastDir = 'right';
  } else if (dx < -2 && lastDir !== 'left') {
    trexEl.style.backgroundImage = `url(${trexLeft})`;
    lastDir = 'left';
  }

  // small bounce animation
  const dist = Math.sqrt(dx * dx + dy * dy);
  const bounce = dist > 5 ? Math.sin(Date.now() / 80) * 3 : 0;

  trexEl.style.left = (trexX - 48) + 'px';
  trexEl.style.top = (trexY - 44 + bounce) + 'px';

  requestAnimationFrame(updateTrex);
}

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener('touchmove', e => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
});

document.addEventListener('touchstart', e => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
});

updateTrex();


// ---- MYSTERY BOXES ----
const boxContainer = document.getElementById('floating-boxes-container');
const BOX_COLORS = ['#ff6b2b', '#7b68ee', '#00ffaa', '#ff4488', '#ffcc00'];

function createMysteryBoxSprite(color) {
  const canvas = document.createElement('canvas');
  const s = 4;
  canvas.width = 10 * s;
  canvas.height = 10 * s;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const C = color;
  const D = '#1a1a2e'; // dark outline
  const Q = '?';

  // simple box with ? mark
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      if (y === 0 || y === 9 || x === 0 || x === 9) {
        ctx.fillStyle = D;
        ctx.fillRect(x * s, y * s, s, s);
      } else if (y === 1 && x > 0 && x < 9) {
        ctx.fillStyle = '#ffffff33';
        ctx.fillRect(x * s, y * s, s, s);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(x * s, y * s, s, s);
      }
    }
  }

  // draw ? mark in center
  ctx.fillStyle = '#fff';
  // pixel art question mark
  const qPixels = [
    [3,3],[4,3],[5,3],[6,3],
    [6,4],
    [5,5],[4,5],
    [4,6],
    [4,8]
  ];
  qPixels.forEach(([px,py]) => {
    ctx.fillRect(px * s, py * s, s, s);
  });

  return canvas.toDataURL();
}

function spawnMysteryBox() {
  const color = BOX_COLORS[Math.floor(Math.random() * BOX_COLORS.length)];
  const box = document.createElement('div');
  box.className = 'mystery-box';

  const size = 40 + Math.random() * 24;
  box.style.width = size + 'px';
  box.style.height = size + 'px';
  box.style.left = (Math.random() * (window.innerWidth - size)) + 'px';
  box.style.top = (Math.random() * (window.innerHeight - size)) + 'px';
  box.style.backgroundImage = `url(${createMysteryBoxSprite(color)})`;
  box.style.backgroundSize = 'contain';
  box.style.backgroundRepeat = 'no-repeat';
  box.style.animationDelay = (Math.random() * 3) + 's';

  box.addEventListener('click', (e) => {
    e.stopPropagation();
    explodeConfetti(e.clientX, e.clientY, color);
    // pop animation
    box.style.transition = 'transform 0.15s, opacity 0.15s';
    box.style.transform = 'scale(1.5)';
    box.style.opacity = '0';
    setTimeout(() => {
      box.remove();
      // respawn a new box after a delay
      setTimeout(spawnMysteryBox, 1000 + Math.random() * 3000);
    }, 200);
  });

  boxContainer.appendChild(box);
}

// Spawn initial boxes
for (let i = 0; i < 5; i++) {
  setTimeout(() => spawnMysteryBox(), i * 600);
}


// ---- CONFETTI EXPLOSION ----
function explodeConfetti(x, y, baseColor) {
  const colors = ['#ff6b2b', '#7b68ee', '#00ffaa', '#ff4488', '#ffcc00', '#fff', baseColor];
  const count = 25 + Math.floor(Math.random() * 15);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti';

    const size = 3 + Math.floor(Math.random() * 6);
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';

    document.body.appendChild(particle);

    // physics
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
    const velocity = 3 + Math.random() * 6;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 3; // upward bias
    let px = x;
    let py = y;
    let gravity = 0.15;
    let opacity = 1;
    let rotation = Math.random() * 360;
    let rotSpeed = (Math.random() - 0.5) * 15;

    function animateParticle() {
      vx *= 0.98;
      vy += gravity;
      px += vx;
      py += vy;
      opacity -= 0.015;
      rotation += rotSpeed;

      particle.style.left = px + 'px';
      particle.style.top = py + 'px';
      particle.style.opacity = opacity;
      particle.style.transform = `rotate(${rotation}deg)`;

      if (opacity > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        particle.remove();
      }
    }
    requestAnimationFrame(animateParticle);
  }
}


// ---- CLICK ANYWHERE RIPPLE ----
document.addEventListener('click', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = (e.clientX - 40) + 'px';
  ripple.style.top = (e.clientY - 40) + 'px';
  document.body.appendChild(ripple);

  // small confetti burst on any click
  explodeConfetti(e.clientX, e.clientY, '#7b68ee');

  setTimeout(() => ripple.remove(), 600);
});

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = (touch.clientX - 40) + 'px';
  ripple.style.top = (touch.clientY - 40) + 'px';
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});


// ---- GAME CARD CLICK ----
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    explodeConfetti(e.clientX, e.clientY, '#00ffaa');
  });
});


// ---- PIXEL ART GAME ICONS ----
function drawPixelIcon(canvasId, pixelData, palette, bgColor) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const s = 4; // each pixel = 4x4
  if (bgColor) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  pixelData.forEach((row, y) => {
    row.forEach((colorIdx, x) => {
      if (colorIdx !== 0 && palette[colorIdx]) {
        ctx.fillStyle = palette[colorIdx];
        ctx.fillRect(x * s, y * s, s, s);
      }
    });
  });
}

// FossilCraft icon: blocky T-Rex
drawPixelIcon('icon-fossilcraft', [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,0,0],
  [0,0,0,0,1,1,2,1,1,1,1,0],
  [0,0,0,0,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,1,1,1,1,3,3,0],
  [0,0,0,0,0,1,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,4,0,0,0],
  [0,0,1,1,1,1,1,1,0,0,0,0],
  [0,1,1,0,1,1,0,1,1,0,0,0],
  [0,1,0,0,1,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
], {
  1: '#4ade80', // green body
  2: '#ffffff', // eye
  3: '#ffffff', // teeth
  4: '#22863a', // arm
});

// Banana Kingdom icon: banana with crown
drawPixelIcon('icon-banana', [
  [0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,1,3,3,3,1,0,0,0,0],
  [0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,2,2,0,0,0,0,0],
  [0,0,0,0,2,2,2,2,0,0,0,0],
  [0,0,0,2,2,2,2,2,0,0,0,0],
  [0,0,2,2,2,4,2,2,0,0,0,0],
  [0,0,2,2,4,2,2,0,0,0,0,0],
  [0,0,2,2,2,2,2,0,0,0,0,0],
  [0,0,0,2,2,2,0,0,0,0,0,0],
  [0,0,0,0,5,5,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
], {
  1: '#ffcc00', // crown gold
  2: '#ffcc00', // banana yellow
  3: '#ff4444', // crown jewels
  4: '#c8a200', // banana shadow
  5: '#8b6914', // stem
});

// Dino Explorer icon: blocky compass / explorer binoculars with dino
drawPixelIcon('icon-dinoexplorer', [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,2,2,2,2,1,0,0,0],
  [0,0,1,2,3,2,2,3,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,4,4,2,2,1,0,0],
  [0,0,0,1,2,2,2,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,5,5,0,0,0,0,0],
  [0,0,0,0,5,5,5,5,0,0,0,0],
  [0,0,0,5,0,5,5,0,5,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
], {
  1: '#7b68ee', // compass rim purple
  2: '#1a1a4e', // compass face dark
  3: '#ff6b2b', // N/S markers
  4: '#00ffaa', // needle green
  5: '#4ade80', // dino body below
});
