/**
 * SHUBHO SHARODIYA TITHI - ULTRA SMOOTH & MOBILE OPTIMIZED
 * Features:
 * - 8 Interactive Photo Flip Cards with Mystery Lock-and-Unlock Layer
 * - 60/120 FPS Canvas Fireworks & Heart Sparkle Engine
 * - Touch Drag vs Tap Discrimination
 * - Interactive Floating Love Icons with Heart Shockwaves
 * - 3D 'I Love You Tithi' Finale Reveal with Beating Hearts
 * - Traditional Dhak (Dhol) Player
 */

(function () {
  'use strict';

  // ==========================================
  // 1. STATE MACHINE
  // ==========================================
  const STAGES = {
    STAGE_1_INIT: 1,           // Romantic Greeting for Tithi
    STAGE_1_GREETED: 2,        // Greeting played, ready for surprise
    STAGE_2_READY: 3,          // Regal Envelope sealed
    STAGE_2_PHOTOS_VISIBLE: 4, // 10 Photos popped up, locked -> unlock -> flip
    STAGE_3_READY: 5,          // Sacred Gift Chest & floating love icons
    STAGE_3_COMPLETED: 6,      // ₹1,000 revealed & 3D 'I Love You Tithi' displayed
  };

  const state = {
    current: STAGES.STAGE_1_INIT,
    isAnimating: false,
    isMusicPlaying: false,
    audioUnlocked: false,
    totalPhotos: 10,
    unlockedCount: 0,
  };

  // DOM Elements Cache
  const el = {
    // Audio & Dhak
    bgMusic: document.getElementById('bgMusic'),
    dhakToggleBtn: document.getElementById('dhakToggleBtn'),
    dhakIconPlay: document.getElementById('dhakIconPlay'),
    dhakIconPause: document.getElementById('dhakIconPause'),
    dhakLabel: document.getElementById('dhakLabel'),

    // Canvas & Viewport
    fxCanvas: document.getElementById('fxCanvas'),
    mainTouchZone: document.getElementById('mainTouchZone'),
    rippleContainer: document.getElementById('rippleContainer'),
    festiveToast: document.getElementById('festiveToast'),

    // Stage 1
    stage1: document.getElementById('stage1'),

    // Stage 2
    stage2: document.getElementById('stage2'),
    regalEnvelope: document.getElementById('regalEnvelope'),
    poppingPhotosContainer: document.getElementById('poppingPhotosContainer'),
    photoCards: document.querySelectorAll('.memory-flip-card'),
    unlockStatusNotice: document.getElementById('unlockStatusNotice'),
    continueToGiftPrompt: document.getElementById('continueToGiftPrompt'),

    // Stage 3
    stage3: document.getElementById('stage3'),
    loveBackdrop: document.getElementById('loveBackdrop'),
    interactiveLoveIcons: document.querySelectorAll('.interactive-love-icon'),
    sacredChest: document.getElementById('sacredChest'),
    shockwaveRing: document.getElementById('shockwaveRing'),
    grandSurpriseCard: document.getElementById('grandSurpriseCard'),
    displayAmount: document.getElementById('displayAmount'),
    loveFinale3D: document.getElementById('loveFinale3D'),
    celebrationDock: document.getElementById('celebrationDock'),
    btnCelebrateDock: document.getElementById('btnCelebrateDock'),
    btnRestartDock: document.getElementById('btnRestartDock'),

    // Guide Pill & Stepper
    tapGuidePill: document.getElementById('tapGuidePill'),
    tapGuideText: document.getElementById('tapGuideText'),
    dot1: document.getElementById('dot1'),
    dot2: document.getElementById('dot2'),
    dot3: document.getElementById('dot3'),
  };

  // ==========================================
  // 2. ULTRA-SMOOTH CANVAS FX ENGINE (60-120 FPS)
  // ==========================================
  const fxEngine = (function () {
    const canvas = el.fxCanvas;
    if (!canvas) return { launch() {}, detonate() {}, detonateHearts() {}, show() {} };

    const ctx = canvas.getContext('2d', { alpha: true });
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Pre-rendered cached heart sprite for zero text rendering overhead
    const heartSprite = document.createElement('canvas');
    heartSprite.width = 36;
    heartSprite.height = 36;
    const hctx = heartSprite.getContext('2d');
    hctx.font = '26px sans-serif';
    hctx.textAlign = 'center';
    hctx.textBaseline = 'middle';
    hctx.fillText('❤️', 18, 18);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }, 150);
    });

    const rockets = [];
    const sparks = [];
    const hearts = [];
    const ambientStars = [];

    // Ambient floating stardust
    for (let i = 0; i < 22; i++) {
      ambientStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.35 + 0.15,
        opacity: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    class FireworkRocket {
      constructor(startX, startY, targetX, targetY, colors) {
        this.x = startX;
        this.y = startY;
        this.targetX = targetX;
        this.targetY = targetY;
        this.colors = colors || ['#FFD54F', '#FF80AB', '#FF4081', '#FFFFFF'];
        const angle = Math.atan2(targetY - startY, targetX - startX);
        const dist = Math.hypot(targetX - startX, targetY - startY);
        this.speed = Math.max(12, dist / 22);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.alive = true;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.16;

        if (this.vy >= 0 || this.y <= this.targetY) {
          this.alive = false;
          fxEngine.detonate(this.x, this.y, 65, this.colors);
          if (Math.random() > 0.4) {
            fxEngine.detonateHearts(this.x, this.y, 10);
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF8E7';
        ctx.fill();
      }
    }

    class Spark {
      constructor(x, y, color, options = {}) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (options.speed || 7) + 1.2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.95;
        this.gravity = 0.16;
        this.size = Math.random() * 2.8 + 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.018 + 0.014;
      }
      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class FastHeart {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2.2;
        this.size = Math.random() * 10 + 16;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      }
      update() {
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.vy -= 0.05;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(
          heartSprite,
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size
        );
      }
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Ambient Stars
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < ambientStars.length; i++) {
        const s = ambientStars[i];
        s.y -= s.speedY;
        s.opacity += Math.sin(Date.now() * s.pulseSpeed) * 0.01;
        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }
        ctx.globalAlpha = Math.max(0.2, Math.min(0.85, s.opacity));
        ctx.fillStyle = '#FFE082';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Lighter composite mode for glowing bloom
      ctx.globalCompositeOperation = 'lighter';

      for (let i = rockets.length - 1; i >= 0; i--) {
        rockets[i].update();
        rockets[i].draw();
        if (!rockets[i].alive) rockets.splice(i, 1);
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();
        if (sparks[i].alpha <= 0) sparks.splice(i, 1);
      }

      // Hearts
      ctx.globalCompositeOperation = 'source-over';
      for (let i = hearts.length - 1; i >= 0; i--) {
        hearts[i].update();
        hearts[i].draw();
        if (hearts[i].alpha <= 0) hearts.splice(i, 1);
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return {
      launch: function (targetX, targetY, colors) {
        const startX = width * (0.25 + Math.random() * 0.5);
        const startY = height + 10;
        rockets.push(new FireworkRocket(startX, startY, targetX, targetY, colors));
      },
      detonate: function (x, y, count = 55, colors, options = {}) {
        const palette = colors || [
          '#FFD54F',
          '#FF80AB',
          '#FF4081',
          '#FF1744',
          '#FFFFFF',
          '#FFE082',
        ];
        for (let i = 0; i < count; i++) {
          const col = palette[Math.floor(Math.random() * palette.length)];
          sparks.push(new Spark(x, y, col, options));
        }
      },
      detonateHearts: function (x, y, count = 12) {
        for (let i = 0; i < count; i++) {
          hearts.push(new FastHeart(x, y));
        }
      },
      show: function (durationMs = 2200, intervalMs = 300) {
        const endTime = Date.now() + durationMs;
        const timer = setInterval(() => {
          if (Date.now() > endTime) {
            clearInterval(timer);
            return;
          }
          const tx = width * (0.15 + Math.random() * 0.7);
          const ty = height * (0.18 + Math.random() * 0.42);
          fxEngine.launch(tx, ty);
        }, intervalMs);
      },
    };
  })();

  // ==========================================
  // 3. AUDIO & DHAK CONTROLLER
  // ==========================================
  function initAudio() {
    const audio = el.bgMusic;
    if (!audio) return;
    audio.volume = 0.85;

    el.dhakToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });

    el.dhakToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        toggleMusic();
      }
    });
  }

  function playMusic() {
    const audio = el.bgMusic;
    if (!audio) return;

    audio.play()
      .then(() => {
        state.isMusicPlaying = true;
        state.audioUnlocked = true;
        el.dhakToggleBtn.classList.add('playing');
        el.dhakIconPlay.style.display = 'none';
        el.dhakIconPause.style.display = 'inline-block';
        el.dhakLabel.textContent = 'বাজছে 🎶';
      })
      .catch(() => {
        state.isMusicPlaying = false;
      });
  }

  function pauseMusic() {
    const audio = el.bgMusic;
    if (!audio) return;
    audio.pause();
    state.isMusicPlaying = false;
    el.dhakToggleBtn.classList.remove('playing');
    el.dhakIconPlay.style.display = 'inline-block';
    el.dhakIconPause.style.display = 'none';
    el.dhakLabel.textContent = 'গান 🎶';
    showToast('সঙ্গীত বন্ধ করা হয়েছে');
  }

  function toggleMusic() {
    if (state.isMusicPlaying) {
      pauseMusic();
    } else {
      playMusic();
      showToast('ঢাকের তালে মেতে উঠুন তিথি! 🥁✨');
    }
  }

  function showToast(msg) {
    if (!el.festiveToast) return;
    el.festiveToast.textContent = msg;
    el.festiveToast.classList.add('show');
    clearTimeout(el.toastTimer);
    el.toastTimer = setTimeout(() => {
      el.festiveToast.classList.remove('show');
    }, 2600);
  }

  // ==========================================
  // 4. SCREEN TAP RIPPLE & STEPPER
  // ==========================================
  function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    el.rippleContainer.appendChild(ripple);
    setTimeout(() => {
      ripple.remove();
    }, 700);
  }

  function updateStepper(stageNumber) {
    el.dot1.classList.toggle('active', stageNumber === 1);
    el.dot2.classList.toggle('active', stageNumber === 2);
    el.dot3.classList.toggle('active', stageNumber === 3);

    if (stageNumber === 2) {
      document.body.classList.add('stage-2-active');
    } else {
      document.body.classList.remove('stage-2-active');
    }
  }

  function setGuideText(text) {
    el.tapGuideText.textContent = text;
  }

  // ==========================================
  // 5. TOUCH GESTURE DISCRIMINATION & HANDLER
  // ==========================================
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  document.addEventListener('pointerdown', (e) => {
    touchStartX = e.clientX;
    touchStartY = e.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  function handleScreenTap(e) {
    // If user dragged/scrolled more than 10px, or held for > 500ms, ignore as scroll
    const dist = Math.hypot(e.clientX - touchStartX, e.clientY - touchStartY);
    const duration = Date.now() - touchStartTime;
    if (dist > 10 || duration > 500) {
      return;
    }

    if (
      e.target.closest('#dhakToggleBtn') ||
      e.target.closest('#celebrationDock')
    ) {
      return;
    }

    const clickX = e.clientX || window.innerWidth / 2;
    const clickY = e.clientY || window.innerHeight / 2;

    createRipple(clickX, clickY);

    if (!state.audioUnlocked) {
      playMusic();
    }

    // Interactive love icons in Stage 3
    if (e.target.closest('.interactive-love-icon')) {
      const heartIcon = e.target.closest('.interactive-love-icon');
      const rect = heartIcon.getBoundingClientRect();
      const hx = rect.left + rect.width / 2;
      const hy = rect.top + rect.height / 2;
      fxEngine.detonateHearts(hx, hy, 18);
      fxEngine.detonate(hx, hy, 25, ['#FF4081', '#FF80AB', '#FFE082']);
      showToast('I Love You Tithi ❤️ ' + (heartIcon.dataset.heart || '💖'));
      return;
    }

    // In Stage 2 with Photos Visible:
    if (state.current === STAGES.STAGE_2_PHOTOS_VISIBLE) {
      const flipCard = e.target.closest('.memory-flip-card');
      if (flipCard) {
        handleCardInteraction(flipCard);
        return;
      }
      // If user tapped prompt or outside cards, advance to Stage 3!
      transitionToStage3();
      return;
    }

    if (state.isAnimating) return;

    switch (state.current) {
      case STAGES.STAGE_1_INIT:
        triggerStage1Greeting(clickX, clickY);
        break;

      case STAGES.STAGE_1_GREETED:
        transitionToStage2();
        break;

      case STAGES.STAGE_2_READY:
        triggerStage2EnvelopeOpening(clickX, clickY);
        break;

      case STAGES.STAGE_3_READY:
        triggerStage3GiftReveal(clickX, clickY);
        break;

      case STAGES.STAGE_3_COMPLETED:
        // Celebration mode: burst fireworks and hearts wherever touched
        fxEngine.detonate(clickX, clickY, 45, ['#FF4081', '#FF80AB', '#FFD54F', '#FFFFFF']);
        fxEngine.detonateHearts(clickX, clickY, 12);
        break;

      default:
        break;
    }
  }

  // ==========================================
  // 6. CARD INTERACTION: LOCK -> UNLOCK -> FLIP
  // ==========================================
  function handleCardInteraction(card) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // STEP 1: If card is LOCKED, unlock it!
    if (card.classList.contains('is-locked')) {
      card.classList.remove('is-locked');
      card.classList.add('is-unlocked');

      const lockIcon = card.querySelector('.lock-icon');
      if (lockIcon) lockIcon.textContent = '🔓';

      // Sparkle & heart unlock burst
      fxEngine.detonate(cx, cy, 35, ['#FFE082', '#FFD54F', '#FF4081', '#FFFFFF']);
      fxEngine.detonateHearts(cx, cy, 10);

      state.unlockedCount++;

      // Update instructions
      if (state.unlockedCount >= state.totalPhotos) {
        el.unlockStatusNotice.textContent = '✨ সব স্মৃতি আনলক হয়েছে! এবার নিচের উপহারটি খুলুন 🎁';
        showToast('🎉 সব স্মৃতি আনলক হয়েছে তিথি! এবার উপহারটি খোলো ❤️');
        fxEngine.show(1600, 260);
      } else {
        el.unlockStatusNotice.textContent = `✨ স্মৃতি আনলক হয়েছে (${state.unlockedCount}/${state.totalPhotos}) — ট্যাপ করে উল্টে বার্তা পড়ুন! ❤️`;
        showToast('স্মৃতি আনলক হয়েছে! এবার ট্যাপ করে উল্টে বার্তাটি পড়ুন 💖');
      }
      return;
    }

    // STEP 2: If card is UNLOCKED, flip it in 3D!
    card.classList.toggle('is-flipped');
    fxEngine.detonateHearts(cx, cy, 5);
  }

  // ==========================================
  // 7. STAGE 1: GREETING LOGIC FOR TITHI
  // ==========================================
  function triggerStage1Greeting(x, y) {
    state.isAnimating = true;

    // Fireworks & Hearts
    fxEngine.launch(window.innerWidth * 0.25, window.innerHeight * 0.35);
    fxEngine.launch(window.innerWidth * 0.75, window.innerHeight * 0.35);
    fxEngine.detonateHearts(x, y, 16);

    const title = el.stage1.querySelector('.main-pujo-title');
    if (title) {
      title.style.transition = 'transform 0.7s var(--ease-spring), filter 0.7s ease';
      title.style.transform = 'scale(1.06)';
      title.style.filter =
        'drop-shadow(0 0 25px rgba(255, 64, 129, 0.9)) drop-shadow(0 0 40px rgba(255, 213, 79, 0.7))';
      setTimeout(() => {
        title.style.transform = 'scale(1)';
      }, 750);
    }

    setTimeout(() => {
      state.current = STAGES.STAGE_1_GREETED;
      state.isAnimating = false;
      setGuideText('তোমার জন্য একটি সারপ্রাইজ আছে তিথি 🎁 (Tap for surprise)');
    }, 2000);
  }

  function transitionToStage2() {
    el.stage1.classList.remove('active');
    el.stage2.classList.add('active');
    updateStepper(2);

    state.current = STAGES.STAGE_2_READY;
    setGuideText('সিলমোহরটি ভাঙতে স্পর্শ করো তিথি ✨ (Tap to open envelope)');
  }

  // ==========================================
  // 8. STAGE 2: ENVELOPE OPENING & 8 LOCKED PHOTOS
  // ==========================================
  function triggerStage2EnvelopeOpening(x, y) {
    state.isAnimating = true;

    // 1. Open Envelope
    el.regalEnvelope.classList.add('opened');

    // 2. Wax Seal Spark & Heart explosion
    const envRect = el.regalEnvelope.getBoundingClientRect();
    const sealX = envRect.left + envRect.width / 2;
    const sealY = envRect.top + envRect.height * 0.45;
    fxEngine.detonate(sealX, sealY, 50, ['#FFE082', '#FF4081', '#FF80AB', '#FFFFFF']);
    fxEngine.detonateHearts(sealX, sealY, 16);

    // 3. Fireworks display
    fxEngine.show(2000, 300);

    // 4. Pop up the 10 locked photos line-by-line!
    setTimeout(() => {
      el.poppingPhotosContainer.classList.remove('hidden');

      const cards = document.querySelectorAll('.memory-flip-card');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.add('popped');
          const r = card.getBoundingClientRect();
          fxEngine.detonateHearts(r.left + r.width / 2, r.top + r.height / 2, 3);
        }, idx * 140);
      });

      state.current = STAGES.STAGE_2_PHOTOS_VISIBLE;
      state.isAnimating = false;
      setGuideText('🔒 প্রতিটি ফটোতে ট্যাপ করে আনলক করো, তারপর বার্তা পড়ো ❤️');
      showToast('🔒 ছবিগুলোতে স্পর্শ করে আনলক করুন তিথি! 💖');
    }, 1100);
  }

  function transitionToStage3() {
    el.stage2.classList.remove('active');
    el.stage3.classList.add('active');
    updateStepper(3);

    state.current = STAGES.STAGE_3_READY;
    setGuideText('উপহারের বাক্সটি খুলতে স্পর্শ করো 🎁 (Tap to unlock gift)');
    showToast('💖 ব্যাকগ্রাউন্ডের লাভ আইকনগুলোতে ট্যাপ করুন! 💕');
  }

  // ==========================================
  // 9. STAGE 3: GIFT REVEAL & 3D 'I LOVE YOU TITHI'
  // ==========================================
  function triggerStage3GiftReveal(x, y) {
    state.isAnimating = true;

    // 1. Anticipation Rumble on Gift Chest
    el.sacredChest.classList.add('rumbling');

    // 2. Detonate Shockwave & Fireworks after slight delay
    setTimeout(() => {
      el.sacredChest.classList.remove('rumbling');
      el.sacredChest.classList.add('opened');

      el.shockwaveRing.classList.add('fire');

      fxEngine.show(2800, 220);
      fxEngine.detonate(
        window.innerWidth / 2,
        window.innerHeight * 0.4,
        80,
        ['#FF4081', '#FF80AB', '#FFD54F', '#FFFFFF', '#FF1744'],
        { speed: 10 }
      );
      fxEngine.detonateHearts(window.innerWidth / 2, window.innerHeight * 0.4, 25);

      showToast('🎉 শুভ শারদীয়া তিথি! তোমার জন্য এই উপহার ❤️');
    }, 420);

    // 3. Amount Count Up Animation (₹0 to ₹1,000)
    setTimeout(() => {
      animateAmountCountUp();
    }, 750);

    // 4. Reveal 3D 'I Love You Tithi'
    setTimeout(() => {
      el.loveFinale3D.classList.remove('hidden');
      fxEngine.detonateHearts(window.innerWidth / 2, window.innerHeight * 0.7, 30);
      fxEngine.detonate(window.innerWidth / 2, window.innerHeight * 0.7, 50, [
        '#FF4081',
        '#FF80AB',
        '#FFE082',
        '#FFFFFF',
      ]);
    }, 1700);

    // 5. Celebration Dock
    setTimeout(() => {
      el.tapGuidePill.style.display = 'none';
      el.celebrationDock.classList.remove('hidden');
      state.current = STAGES.STAGE_3_COMPLETED;
      state.isAnimating = false;
      showToast('💖 স্ক্রিনে যেকোনো জায়গায় স্পর্শ করে ভালোবাসা ছড়াও! 🌸');
    }, 2400);
  }

  function animateAmountCountUp() {
    let current = 0;
    const target = 1000;
    const step = 50;
    const counter = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(counter);
      }
      el.displayAmount.textContent = current.toLocaleString('en-IN');
    }, 32);
  }

  // ==========================================
  // 10. CELEBRATE AGAIN & REPLAY
  // ==========================================
  function handleCelebrateAgain() {
    fxEngine.show(2400, 200);
    fxEngine.detonateHearts(window.innerWidth / 2, window.innerHeight * 0.4, 35);
    fxEngine.detonate(window.innerWidth / 2, window.innerHeight * 0.4, 70, [
      '#FF4081',
      '#FF80AB',
      '#FFD54F',
      '#FFFFFF',
    ]);
    showToast('I Love You Tithi! চিরকাল এভাবেই ভালোবেসে যাবো ❤️');
  }

  function handleReplay() {
    state.current = STAGES.STAGE_1_INIT;
    state.isAnimating = false;
    state.unlockedCount = 0;

    // Reset Stage 2
    el.regalEnvelope.classList.remove('opened');
    el.poppingPhotosContainer.classList.add('hidden');
    el.unlockStatusNotice.textContent = '🔒 স্পর্শ করে আনলক করুন, তারপর উল্টে ভালোবাসার বার্তা পড়ুন! ✨';
    document.querySelectorAll('.memory-flip-card').forEach((c) => {
      c.classList.remove('popped', 'is-flipped', 'is-unlocked');
      c.classList.add('is-locked');
      const lockIcon = c.querySelector('.lock-icon');
      if (lockIcon) lockIcon.textContent = '🔒';
    });

    // Reset Stage 3
    el.sacredChest.classList.remove('opened', 'rumbling');
    el.shockwaveRing.classList.remove('fire');
    el.loveFinale3D.classList.add('hidden');
    el.celebrationDock.classList.add('hidden');
    el.tapGuidePill.style.display = 'inline-flex';

    // Switch view to Stage 1
    el.stage2.classList.remove('active');
    el.stage3.classList.remove('active');
    el.stage1.classList.add('active');
    updateStepper(1);

    setGuideText('তিথি, স্ক্রিনের যেকোনো জায়গায় স্পর্শ করো ✨ (Tap anywhere)');
    showToast('পুনরায় শুরু করা হয়েছে 🌸');
  }

  // ==========================================
  // 11. SETUP & INITIALIZATION
  // ==========================================
  function setupEvents() {
    document.addEventListener('pointerup', handleScreenTap);

    el.continueToGiftPrompt.addEventListener('click', (e) => {
      e.stopPropagation();
      transitionToStage3();
    });

    el.btnCelebrateDock.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCelebrateAgain();
    });

    el.btnRestartDock.addEventListener('click', (e) => {
      e.stopPropagation();
      handleReplay();
    });
  }

  function init() {
    initAudio();
    setupEvents();
    updateStepper(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
