/* ═══════════════════════════════════════════════════════════════
   BIRTHDAY SURPRISE — Main Script
   Particles · Audio · Animations · Interactions
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ───── STATE ───── */
  let audioCtx = null;
  let isPlaying = false;
  let melodyInterval = null;
  let chordInterval = null;
  let padGain = null;
  let started = false;

  /* ───── DOM REFS ───── */
  const introOverlay = document.getElementById('intro-overlay');
  const enterBtn = document.getElementById('enterBtn');
  const particleCanvas = document.getElementById('particleCanvas');
  const cursorCanvas = document.getElementById('cursorCanvas');
  const pCtx = particleCanvas.getContext('2d');
  const cCtx = cursorCanvas.getContext('2d');
  const vinyl = document.getElementById('vinyl');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const musicPlayer = document.getElementById('musicPlayer');
  const smileBtn = document.getElementById('smileBtn');
  const hiddenMessage = document.getElementById('hiddenMessage');

  /* ═══════════════════════════════════════════════ */
  /*  CANVAS SETUP                                   */
  /* ═══════════════════════════════════════════════ */
  function resizeCanvases() {
    const dpr = window.devicePixelRatio || 1;
    for (const c of [particleCanvas, cursorCanvas]) {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  /* ═══════════════════════════════════════════════ */
  /*  PARTICLE SYSTEM                                */
  /* ═══════════════════════════════════════════════ */
  const particles = [];
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W();
      this.y = -20 - Math.random() * 100;
      this.size = 6 + Math.random() * 8;
      this.speedY = 0.4 + Math.random() * 0.8;
      this.speedX = -0.3 + Math.random() * 0.6;
      this.rotation = Math.random() * 360;
      this.rotSpeed = -1 + Math.random() * 2;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.01 + Math.random() * 0.02;
    }
    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y > H() + 30) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${345 + Math.random() * 15}, 80%, ${72 + Math.random() * 10}%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  class Heart {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W();
      this.y = H() + 20 + Math.random() * 100;
      this.size = 8 + Math.random() * 14;
      this.speedY = -(0.3 + Math.random() * 0.6);
      this.speedX = -0.2 + Math.random() * 0.4;
      this.opacity = 0.15 + Math.random() * 0.35;
      this.wobble = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY;
      this.wobble += 0.015;
      this.x += this.speedX + Math.sin(this.wobble) * 0.4;
      if (this.y < -40) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = `rgba(232, 83, 109, ${this.opacity})`;
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.2, -s, s * 0.1, 0, s);
      ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.2, 0, s * 0.35);
      ctx.fill();
      ctx.restore();
    }
  }

  class Sparkle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W();
      this.y = Math.random() * H();
      this.size = 1.5 + Math.random() * 2.5;
      this.life = 0;
      this.maxLife = 120 + Math.random() * 180;
      this.opacity = 0;
    }
    update() {
      this.life++;
      const t = this.life / this.maxLife;
      this.opacity = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1;
      this.opacity *= 0.6;
      if (this.life >= this.maxLife) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#F5D6A8';
      ctx.shadowColor = '#F5D6A8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Lantern {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = Math.random() * W();
      this.y = initial ? Math.random() * H() : H() + 60;
      this.size = 14 + Math.random() * 10;
      this.speedY = -(0.15 + Math.random() * 0.3);
      this.drift = -0.15 + Math.random() * 0.3;
      this.opacity = 0.15 + Math.random() * 0.25;
      this.glowPhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY;
      this.x += this.drift + Math.sin(Date.now() * 0.0005 + this.glowPhase) * 0.15;
      if (this.y < -60) this.reset();
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const glow = 0.6 + 0.4 * Math.sin(Date.now() * 0.002 + this.glowPhase);
      ctx.globalAlpha = this.opacity * glow;
      /* lantern body */
      ctx.fillStyle = '#FFDAB9';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.45, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      /* warm glow */
      ctx.globalAlpha = this.opacity * glow * 0.3;
      ctx.fillStyle = '#FFE5D0';
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* Spawn particles */
  for (let i = 0; i < 25; i++) particles.push(new Petal());
  for (let i = 0; i < 15; i++) particles.push(new Heart());
  for (let i = 0; i < 35; i++) particles.push(new Sparkle());
  for (let i = 0; i < 8; i++) particles.push(new Lantern());

  function animateParticles() {
    pCtx.clearRect(0, 0, W(), H());
    for (const p of particles) {
      p.update();
      p.draw(pCtx);
    }
    requestAnimationFrame(animateParticles);
  }

  /* ═══════════════════════════════════════════════ */
  /*  CURSOR SPARKLE TRAIL                           */
  /* ═══════════════════════════════════════════════ */
  const cursorTrail = [];
  let mouseX = -100, mouseY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    for (let i = 0; i < 2; i++) {
      cursorTrail.push({
        x: mouseX + (Math.random() - 0.5) * 10,
        y: mouseY + (Math.random() - 0.5) * 10,
        size: 2 + Math.random() * 3,
        life: 0,
        maxLife: 30 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.5,
      });
    }
  });

  function animateCursor() {
    cCtx.clearRect(0, 0, W(), H());
    for (let i = cursorTrail.length - 1; i >= 0; i--) {
      const p = cursorTrail[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const t = 1 - p.life / p.maxLife;
      if (t <= 0) { cursorTrail.splice(i, 1); continue; }
      cCtx.save();
      cCtx.globalAlpha = t * 0.7;
      cCtx.fillStyle = `hsl(${340 + Math.random() * 20}, 80%, 75%)`;
      cCtx.shadowColor = 'rgba(255, 182, 211, 0.6)';
      cCtx.shadowBlur = 6;
      cCtx.beginPath();
      cCtx.arc(p.x, p.y, p.size * t, 0, Math.PI * 2);
      cCtx.fill();
      cCtx.restore();
    }
    requestAnimationFrame(animateCursor);
  }

  /* ═══════════════════════════════════════════════ */
  /*  WEB AUDIO — Procedural Ambient Piano           */
  /* ═══════════════════════════════════════════════ */
  function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    /* Master */
    const master = audioCtx.createGain();
    master.gain.value = 0.25;
    master.connect(audioCtx.destination);

    /* Reverb-like delay */
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.35;
    const fb = audioCtx.createGain();
    fb.gain.value = 0.3;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(master);

    /* Pad synth gain */
    padGain = audioCtx.createGain();
    padGain.gain.value = 0.06;
    padGain.connect(master);
    padGain.connect(delay);

    /* Note frequencies */
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
      A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
      F5: 698.46, G5: 783.99,
      C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
    };

    function playNote(freq, startTime, duration, vol = 0.12) {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      /* soft envelope */
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(vol, startTime + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(g);
      g.connect(master);
      g.connect(delay);
      osc.start(startTime);
      osc.stop(startTime + duration);
    }

    function playChord(freqs, startTime, duration) {
      freqs.forEach((f) => playNote(f, startTime, duration, 0.05));
    }

    /* Ambient pad (sustained oscillators) */
    function startPad() {
      const padFreqs = [261.63, 329.63, 392.0]; /* C major */
      padFreqs.forEach((f) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(padGain);
        osc.start();
      });
    }

    /* Melody sequences */
    const melodies = [
      [notes.E4, notes.G4, notes.C5, notes.B4, notes.A4, notes.G4, notes.E4, notes.D4],
      [notes.C4, notes.E4, notes.G4, notes.A4, notes.G4, notes.F4, notes.E4, notes.C4],
      [notes.G4, notes.A4, notes.B4, notes.C5, notes.D5, notes.C5, notes.B4, notes.G4],
      [notes.F4, notes.A4, notes.C5, notes.E5, notes.D5, notes.C5, notes.A4, notes.F4],
      [notes.C4, notes.D4, notes.E4, notes.G4, notes.A4, notes.G4, notes.E4, notes.C4],
    ];

    const chords = [
      [notes.C3, notes.E3, notes.G3],     /* C */
      [notes.A3, notes.C4, notes.E4],     /* Am */
      [notes.F3, notes.A3, notes.C4],     /* F */
      [notes.G3, notes.B3, notes.D4],     /* G */
      [notes.E3, notes.G3, notes.B3],     /* Em */
    ];

    let melodyIdx = 0;

    function scheduleMelody() {
      const now = audioCtx.currentTime;
      const seq = melodies[melodyIdx % melodies.length];
      seq.forEach((note, i) => {
        playNote(note, now + i * 0.55, 0.7, 0.10);
      });
      melodyIdx++;
    }

    let chordIdx = 0;
    function scheduleChord() {
      const now = audioCtx.currentTime;
      playChord(chords[chordIdx % chords.length], now, 3.5);
      chordIdx++;
    }

    startPad();
    scheduleMelody();
    scheduleChord();
    melodyInterval = setInterval(scheduleMelody, 4500);
    chordInterval = setInterval(scheduleChord, 4000);
    isPlaying = true;
    updatePlayPauseUI();
  }

  function toggleAudio() {
    if (!audioCtx) { initAudio(); return; }
    if (audioCtx.state === 'running') {
      audioCtx.suspend();
      isPlaying = false;
      clearInterval(melodyInterval);
      clearInterval(chordInterval);
    } else {
      audioCtx.resume();
      isPlaying = true;
      /* restart intervals */
      const notes = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0,
        A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
        C3: 130.81, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
      };
      /* We keep it simple — just resume context */
    }
    updatePlayPauseUI();
  }

  function updatePlayPauseUI() {
    if (isPlaying) {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      vinyl.classList.add('spinning');
    } else {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      vinyl.classList.remove('spinning');
    }
  }

  function playChimeEffect() {
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const master = audioCtx.destination;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, now + i * 0.1);
      g.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
      osc.connect(g);
      g.connect(master);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.7);
    });
  }

  /* ═══════════════════════════════════════════════ */
  /*  TYPING ANIMATION                               */
  /* ═══════════════════════════════════════════════ */
  function typeText(element, text, speed = 45) {
    return new Promise((resolve) => {
      let i = 0;
      element.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      element.appendChild(cursor);

      function type() {
        if (i < text.length) {
          const char = text[i];
          element.insertBefore(document.createTextNode(char), cursor);
          i++;
          setTimeout(type, speed);
        } else {
          setTimeout(() => {
            cursor.remove();
            resolve();
          }, 800);
        }
      }
      type();
    });
  }

  /* ═══════════════════════════════════════════════ */
  /*  GSAP SCROLL ANIMATIONS                        */
  /* ═══════════════════════════════════════════════ */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    /* Birthday Heading */
    const heading = document.getElementById('birthdayHeading');
    gsap.to(heading, {
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#birthday-title',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      onComplete: () => {
        /* Type subtitle */
        const sub = document.getElementById('birthdaySubtitle');
        typeText(sub, 'You deserve love that stays, a heart that heals, and happiness that never leaves. 💖', 40);
        /* Animate decoration */
        gsap.to('.birthday-decoration', { opacity: 1, duration: 1, delay: 0.5 });
      }
    });

    /* Sparkles around title */
    gsap.to('#titleSparkles', {
      scrollTrigger: {
        trigger: '#birthday-title',
        start: 'top 80%',
        onEnter: () => createTitleSparkles(),
      }
    });

    /* Polaroids & Scrapbook notes */
    document.querySelectorAll('.polaroid, .scrapbook-note').forEach((p, i) => {
      gsap.to(p, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: i * 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: p,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
      /* initial state */
      gsap.set(p, { y: 60 });
    });

    /* Message Cards */
    document.querySelectorAll('.message-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.9,
        delay: i * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
      gsap.set(card, { x: i % 2 === 0 ? -40 : 40 });
    });

    /* Smile section */
    gsap.from('.smile-title', {
      opacity: 0, y: 30, duration: 1,
      scrollTrigger: { trigger: '#smile-section', start: 'top 75%' }
    });

    gsap.from('.smile-btn', {
      opacity: 0, scale: 0.8, duration: 0.8, delay: 0.3,
      ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '#smile-section', start: 'top 70%' }
    });

    /* Final scene messages */
    gsap.to('#finalMsg1', {
      opacity: 1, y: 0, duration: 1.2,
      scrollTrigger: {
        trigger: '#finalMsg1',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    gsap.to('#finalMsg2', {
      opacity: 1, y: 0, duration: 1.5, delay: 0.5,
      scrollTrigger: {
        trigger: '#finalMsg2',
        start: 'top 85%',
        toggleActions: 'play none none none',
        onEnter: () => {
          document.getElementById('finalGlow').classList.add('active');
          /* Final confetti burst */
          setTimeout(() => {
            fireConfetti();
          }, 1500);
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════ */
  /*  SPARKLES AROUND TITLE                          */
  /* ═══════════════════════════════════════════════ */
  function createTitleSparkles() {
    const container = document.getElementById('titleSparkles');
    for (let i = 0; i < 20; i++) {
      const sp = document.createElement('div');
      sp.className = 'sparkle';
      sp.style.left = Math.random() * 100 + '%';
      sp.style.top = Math.random() * 100 + '%';
      sp.style.animationDelay = Math.random() * 3 + 's';
      sp.style.animationDuration = 2 + Math.random() * 2 + 's';
      container.appendChild(sp);
    }
  }

  /* ═══════════════════════════════════════════════ */
  /*  CONFETTI                                       */
  /* ═══════════════════════════════════════════════ */
  function fireConfetti() {
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 10001 };
    const colors = ['#FF6B9D', '#FFB6D3', '#E8536D', '#FFDAB9', '#FFE5D0', '#F5D6A8', '#ffffff'];

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        particleCount: Math.floor(200 * particleRatio),
        colors: colors,
        ...opts,
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }

  function fireHeartsExplosion() {
    /* Confetti with heart shapes */
    const heart = confetti.shapeFromText({ text: '💖', scalar: 2 });
    const flower = confetti.shapeFromText({ text: '🌸', scalar: 2 });

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 15,
          spread: 160,
          startVelocity: 35,
          shapes: [heart, flower],
          scalar: 2,
          zIndex: 10001,
          origin: { x: Math.random(), y: 0.5 },
          ticks: 120,
        });
      }, i * 300);
    }
  }

  /* ═══════════════════════════════════════════════ */
  /*  SMILE BUTTON INTERACTION                       */
  /* ═══════════════════════════════════════════════ */
  const smileMessages = [
    "You survived every bad day and still became such a beautiful soul. I'm so proud of you, my love 🌸",
    "No matter how tough life gets, remember: my arms will always be your favorite safe space. 🏡💖",
    "Friendly reminder: You are the most beautiful person in the world, and I love you infinitely. 🧸💕",
    "If we are ever in a zombie apocalypse, I will hold your hand and we will run together. That's real love. 🧟‍♂️❤️",
    "You are my favorite notification, my late-night peace, and my happiest thought. 📱✨",
    "Legal romantic notice: You are stuck with me forever. Return policy is absolutely invalid! 📜💍"
  ];

  smileBtn.addEventListener('click', () => {
    /* Fire confetti */
    fireConfetti();
    if (Math.random() > 0.4) {
      setTimeout(fireHeartsExplosion, 400);
    }

    /* Chime sound */
    playChimeEffect();

    /* Select a random message */
    const msgText = document.querySelector('.hidden-msg-text');
    if (msgText) {
      const randomMsg = smileMessages[Math.floor(Math.random() * smileMessages.length)];
      msgText.textContent = randomMsg;
    }

    /* Show hidden message with clean transition */
    hiddenMessage.classList.remove('show');
    setTimeout(() => {
      hiddenMessage.classList.add('show');
      gsap.fromTo(hiddenMessage, 
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }, 50);

    /* Glow the button */
    smileBtn.style.boxShadow = '0 0 40px rgba(232, 83, 109, 0.5)';
    smileBtn.style.borderColor = '#FF6B9D';

    /* Add extra sparkles temporarily */
    for (let i = 0; i < 8; i++) {
      particles.push(new Sparkle());
    }
  });

  /* ═══════════════════════════════════════════════ */
  /*  INTRO FLOW                                     */
  /* ═══════════════════════════════════════════════ */
  enterBtn.addEventListener('click', () => {
    if (started) return;
    started = true;

    /* Start audio */
    initAudio();

    /* Fade out intro */
    introOverlay.classList.add('fade-out');

    /* Show music player */
    setTimeout(() => { musicPlayer.classList.add('visible'); }, 1500);

    /* Start opening scene animation */
    setTimeout(async () => {
      const card1 = document.getElementById('typing-card-1');
      const card2 = document.getElementById('typing-card-2');

      /* Show first card */
      gsap.to(card1, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      await new Promise(r => setTimeout(r, 1000));

      /* Type first message */
      await typeText(
        document.getElementById('typed-1'),
        'You are the most beautiful part of my life, bringing light to my darkest days 💖',
        50
      );

      await new Promise(r => setTimeout(r, 1500));

      /* Show second card */
      gsap.to(card2, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
      await new Promise(r => setTimeout(r, 1000));

      /* Type second message */
      await typeText(
        document.getElementById('typed-2'),
        'Today is all about celebrating you and the endless happiness you deserve, my love 🌸',
        50
      );

      /* Fade in scroll down arrow */
      const scrollHint = document.getElementById('scrollDownHint');
      if (scrollHint) {
        scrollHint.classList.add('visible');
        scrollHint.addEventListener('click', () => {
          document.getElementById('birthday-title').scrollIntoView({ behavior: 'smooth' });
        });
      }
    }, 2000);

    /* Initialize scroll animations */
    setTimeout(() => {
      initScrollAnimations();
    }, 2500);
  });

  /* ═══════════════════════════════════════════════ */
  /*  MUSIC PLAYER CONTROLS                          */
  /* ═══════════════════════════════════════════════ */
  playPauseBtn.addEventListener('click', toggleAudio);

  /* ═══════════════════════════════════════════════ */
  /*  START ANIMATION LOOPS                          */
  /* ═══════════════════════════════════════════════ */
  animateParticles();
  animateCursor();

})();
