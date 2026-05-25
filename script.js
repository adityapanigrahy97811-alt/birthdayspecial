(function () {
  'use strict';

  /* ───── DOM REFERENCES ───── */
  const loveCanvas = document.getElementById('loveCanvas');
  const cursorCanvas = document.getElementById('cursorCanvas');
  const lCtx = loveCanvas.getContext('2d');
  const cCtx = cursorCanvas.getContext('2d');
  const fairyBulbsContainer = document.getElementById('fairyBulbs');
  const musicToggle = document.getElementById('musicToggle');
  const loveBtn = document.getElementById('loveBtn');
  const loveModal = document.getElementById('loveModal');
  const closeModal = document.getElementById('closeModal');
  const introGateway = document.getElementById('intro-gateway');
  const enterSurpriseBtn = document.getElementById('enterSurpriseBtn');
  const cardWrapper = document.querySelector('.card-wrapper');
  const fairyLightsContainer = document.querySelector('.fairy-lights-container');

  /* ───── STATE ───── */
  let audioCtx = null;
  let synthInterval = null;
  let synthPadGain = null;
  let isMusicPlaying = false;
  const particles = [];
  const cursorTrail = [];

  /* ═══════════════════════════════════════════════ */
  /*  CANVAS SETUP & RESIZING                        */
  /* ═══════════════════════════════════════════════ */
  function resizeCanvases() {
    const dpr = window.devicePixelRatio || 1;
    [loveCanvas, cursorCanvas].forEach((canvas) => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      canvas.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  /* ═══════════════════════════════════════════════ */
  /*  FAIRY LIGHTS BULB GENERATION                   */
  /* ═══════════════════════════════════════════════ */
  function generateFairyLights() {
    const screenWidth = window.innerWidth;
    const bulbSpacing = 40; // Spacing in pixels between bulbs
    const bulbCount = Math.max(12, Math.floor(screenWidth / bulbSpacing));
    const colors = ['color-pink', 'color-lavender', 'color-gold', 'color-rose'];
    
    fairyBulbsContainer.innerHTML = ''; // Clear previous

    for (let i = 0; i <= bulbCount; i++) {
      const bulb = document.createElement('div');
      bulb.className = `bulb ${colors[i % colors.length]}`;
      
      const leftPercent = (i / bulbCount) * 100;
      // Wavy mathematical function representing a hanging string
      const topOffset = 25 + 18 * Math.sin((leftPercent * 0.12) + 0.3) + 8 * Math.cos((leftPercent * 0.05) - 0.2);
      
      bulb.style.left = `${leftPercent}%`;
      bulb.style.top = `${topOffset}px`;
      
      // Dynamic swing speeds and starting angles for natural look
      const swingDur = 1.2 + Math.random() * 0.8;
      const swingDelay = Math.random() * -2;
      bulb.style.animation = `bulbSwing ${swingDur}s ease-in-out infinite alternate`;
      bulb.style.animationDelay = `${swingDelay}s`;
      
      fairyBulbsContainer.appendChild(bulb);
    }
  }
  generateFairyLights();
  window.addEventListener('resize', generateFairyLights);

  /* ═══════════════════════════════════════════════ */
  /*  PARTICLE CLASSES: HEARTS & SPARKLES            */
  /* ═══════════════════════════════════════════════ */
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  class HeartParticle {
    constructor() { this.reset(true); }
    
    reset(initial = false) {
      this.x = Math.random() * W();
      this.y = initial ? Math.random() * H() : H() + 30;
      this.size = 8 + Math.random() * 16;
      this.speedY = -(0.5 + Math.random() * 1.1);
      this.speedX = -0.3 + Math.random() * 0.6;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.015 + Math.random() * 0.015;
      this.opacity = 0.15 + Math.random() * 0.35;
      this.colorHue = Math.random() > 0.5 ? 340 : 320; // Pinks & Lavender-magentas
    }
    
    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.5;
      
      if (this.y < -30 || this.x < -30 || this.x > W() + 30) {
        this.reset(false);
      }
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      
      // Standard canvas heart drawing shape
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(-s * 0.5, -s * 0.25, -s, s * 0.1, 0, s);
      ctx.bezierCurveTo(s, s * 0.1, s * 0.5, -s * 0.25, 0, s * 0.3);
      
      ctx.fillStyle = `hsl(${this.colorHue + Math.sin(this.wobble)*10}, 85%, 75%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  class SparkleParticle {
    constructor() { this.reset(true); }
    
    reset(initial = false) {
      this.x = Math.random() * W();
      this.y = initial ? Math.random() * H() : H() + 20;
      this.size = 1.5 + Math.random() * 2.5;
      this.speedY = -(0.3 + Math.random() * 0.6);
      this.life = 0;
      this.maxLife = 180 + Math.random() * 180;
      this.opacity = 0;
    }
    
    update() {
      this.y += this.speedY;
      this.life++;
      
      const t = this.life / this.maxLife;
      // Fade in at the start, fade out at the end
      this.opacity = t < 0.25 ? t / 0.25 : t > 0.75 ? (1 - t) / 0.25 : 1;
      this.opacity *= 0.45;
      
      if (this.life >= this.maxLife || this.y < -20) {
        this.reset(false);
      }
    }
    
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#ffe1a8'; // Golden glow
      ctx.shadowColor = '#ffe1a8';
      ctx.shadowBlur = 8;
      
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Populate particles
  const totalHearts = 22;
  const totalSparkles = 35;
  for (let i = 0; i < totalHearts; i++) particles.push(new HeartParticle());
  for (let i = 0; i < totalSparkles; i++) particles.push(new SparkleParticle());

  function animateCanvasParticles() {
    lCtx.clearRect(0, 0, W(), H());
    particles.forEach((p) => {
      p.update();
      p.draw(lCtx);
    });
    requestAnimationFrame(animateCanvasParticles);
  }
  animateCanvasParticles();

  /* ═══════════════════════════════════════════════ */
  /*  INTERACTIVE MOUSE CURSOR TRAIL                 */
  /* ═══════════════════════════════════════════════ */
  let mouseX = -100, mouseY = -100;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Spawn trail sparkles
    if (Math.random() > 0.4) {
      cursorTrail.push({
        x: mouseX + (Math.random() - 0.5) * 8,
        y: mouseY + (Math.random() - 0.5) * 8,
        size: 2 + Math.random() * 3,
        life: 0,
        maxLife: 25 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.3,
        color: `hsl(${340 + Math.random() * 25}, 90%, 80%)`
      });
    }
  });

  function animateCursorTrail() {
    cCtx.clearRect(0, 0, W(), H());
    
    for (let i = cursorTrail.length - 1; i >= 0; i--) {
      const p = cursorTrail[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      
      const ratio = 1 - p.life / p.maxLife;
      if (ratio <= 0) {
        cursorTrail.splice(i, 1);
        continue;
      }
      
      cCtx.save();
      cCtx.globalAlpha = ratio * 0.75;
      cCtx.fillStyle = p.color;
      cCtx.shadowColor = p.color;
      cCtx.shadowBlur = 6;
      
      cCtx.beginPath();
      cCtx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
      cCtx.fill();
      cCtx.restore();
    }
    requestAnimationFrame(animateCursorTrail);
  }
  animateCursorTrail();

  /* ═══════════════════════════════════════════════ */
  /*  PROCEDURAL AMBIENT LOVE SYNTHESIZER (Web Audio)*/
  /* ═══════════════════════════════════════════════ */
  function initAudio() {
    if (audioCtx) return;
    
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    // Master volume node
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(audioCtx.destination);

    // Deep lowpass filter for warmth
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;
    filter.connect(masterGain);

    // Warm, spacey delay/reverb emulation
    const delay = audioCtx.createDelay();
    delay.delayTime.value = 0.5;
    const delayFeedback = audioCtx.createGain();
    delayFeedback.gain.value = 0.35;
    
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(masterGain);

    // Synth pad oscillators (generates continuous warm love notes)
    synthPadGain = audioCtx.createGain();
    synthPadGain.gain.setValueAtTime(0, audioCtx.currentTime);
    synthPadGain.connect(filter);
    
    // Create soft sine/triangle oscillators to play continuous pad notes
    // Frequencies of a soft FMaj7 / Amin / Cmaj progression
    const padNotes = [130.81, 164.81, 196.0]; // C3, E3, G3
    const oscs = padNotes.map((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(synthPadGain);
      osc.start();
      return osc;
    });

    // Fade in pad synth
    synthPadGain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 3.0);

    // Chime Note frequencies (C Major Pentatonic)
    const chimeFrequencies = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00  // A5
    ];

    function playSoftChime(freq, time, vol = 0.08) {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      // Pure bell envelope
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 2.5);
      
      osc.connect(gain);
      gain.connect(filter);
      gain.connect(delay);
      
      osc.start(time);
      osc.stop(time + 2.6);
    }

    // Schedule soft melodies over time
    let step = 0;
    const melodyLoop = () => {
      const now = audioCtx.currentTime;
      // C Major Pentatonic chords mapping (C Maj -> A min -> F Maj -> G Maj)
      const chordRoots = [
        [130.81, 164.81, 196.0, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [110.00, 146.83, 164.81, 220.00], // Amin7 (A2, D3, E3, A3)
        [87.31, 130.81, 174.61, 220.00],  // Fmaj7 (F2, C3, F3, A3)
        [98.00, 146.83, 196.00, 246.94]   // Gdom7 (G2, D3, G3, B3)
      ];
      
      const currentChord = chordRoots[step % chordRoots.length];
      
      // Update pad oscillators frequencies to shift chords
      oscs.forEach((osc, idx) => {
        if (currentChord[idx]) {
          osc.frequency.exponentialRampToValueAtTime(currentChord[idx], now + 2.0);
        }
      });

      // Play occasional high bells/chimes randomly within chord scales
      for (let i = 0; i < 3; i++) {
        const chimeFreq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
        const delayOffset = i * (0.8 + Math.random() * 0.6);
        playSoftChime(chimeFreq, now + delayOffset, 0.07);
      }
      
      step++;
    };

    melodyLoop();
    synthInterval = setInterval(melodyLoop, 5000);
  }

  function toggleMusic() {
    if (!audioCtx) {
      initAudio();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
      return;
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
    } else if (audioCtx.state === 'running') {
      audioCtx.suspend();
      isMusicPlaying = false;
      musicToggle.classList.remove('playing');
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  /* ═══════════════════════════════════════════════ */
  /*  BUTTON CLICK CONFETTI & POPUP                 */
  /* ═══════════════════════════════════════════════ */
  function fireRomanticHeartConfetti() {
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 25, spread: 360, ticks: 100, zIndex: 2000 };
    
    // Heart and flower canvas confetti emojis
    const heartEmoji = confetti.shapeFromText({ text: '💖', scalar: 2.2 });
    const pinkHeartEmoji = confetti.shapeFromText({ text: '❤️', scalar: 2.0 });
    const sparkleEmoji = confetti.shapeFromText({ text: '✨', scalar: 1.8 });

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 20 * (timeLeft / duration);
      
      // Confetti burst from both sides
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.2, 0.5) },
        shapes: [heartEmoji, pinkHeartEmoji, sparkleEmoji],
        scalar: 2.0
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.2, 0.5) },
        shapes: [heartEmoji, pinkHeartEmoji, sparkleEmoji],
        scalar: 2.0
      });
    }, 250);
  }

  loveBtn.addEventListener('click', () => {
    // Start ambient audio automatically on button interaction if not started yet
    if (!audioCtx) {
      initAudio();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
    }

    // Play special chime bell scale effect
    if (audioCtx) {
      const now = audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.7);
      });
    }

    // Launch beautiful heart confetti
    fireRomanticHeartConfetti();

    // Show modal popup
    loveModal.classList.add('open');
  });

  closeModal.addEventListener('click', () => {
    loveModal.classList.remove('open');
  });

  // Close modal when clicking on overlay background
  loveModal.addEventListener('click', (e) => {
    if (e.target === loveModal) {
      loveModal.classList.remove('open');
    }
  });

  // Open surprise gateway click handler
  enterSurpriseBtn.addEventListener('click', () => {
    // Fade out front page gateway
    introGateway.classList.add('fade-out');

    // Activate other elements
    cardWrapper.classList.add('active');
    fairyLightsContainer.classList.add('active');
    musicToggle.classList.add('active');

    // Auto-init audio
    setTimeout(() => {
      initAudio();
      isMusicPlaying = true;
      musicToggle.classList.add('playing');
    }, 400);

    // Initial confetti burst
    setTimeout(() => {
      fireRomanticHeartConfetti();
    }, 600);
  });

})();
