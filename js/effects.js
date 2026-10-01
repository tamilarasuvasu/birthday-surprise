(function () {
  const canvas = document.getElementById('effectsCanvas');
  const context = canvas.getContext('2d');
  const particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let animationFrame = 0;
  let fireworksTimer = 0;
  let heartTimer = 0;
  let confettiInterval = 0;
  let confettiStopTimer = 0;
  let soundEnabled = false;
  let audioContext = null;

  function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function requestFrame() {
    if (!animationFrame) animationFrame = window.requestAnimationFrame(drawFrame);
  }

  function drawFrame() {
    animationFrame = 0;
    context.clearRect(0, 0, width, height);
    const now = performance.now();

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      const age = now - particle.born;
      const progress = age / particle.life;
      if (progress >= 1) {
        particles.splice(index, 1);
        continue;
      }
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity || 0;
      particle.rotation += particle.spin || 0;
      const alpha = Math.max(0, 1 - progress);
      context.save();
      context.globalAlpha = particle.type === 'confetti' ? Math.min(1, alpha + 0.12) : alpha;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      if (particle.type === 'confetti') {
        context.fillStyle = particle.color;
        context.fillRect(-particle.size / 2, -particle.size / 3, particle.size, particle.size * .65);
      } else {
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(0, 0, particle.size * (particle.type === 'firework' ? .55 : .75), 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }
    if (particles.length) requestFrame();
  }

  function addConfetti(count) {
    const colors = ['#ff8295', '#f5ce84', '#b4dfca', '#c9b6ff', '#fff4ee'];
    const now = performance.now();
    for (let index = 0; index < count; index += 1) {
      particles.push({
        type: 'confetti', x: Math.random() * width, y: -Math.random() * height * .65,
        vx: (Math.random() - .5) * 2.6, vy: 1.4 + Math.random() * 2.3,
        gravity: .018, spin: (Math.random() - .5) * .16, rotation: Math.random() * 6,
        size: 4 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)],
        born: now, life: 3000 + Math.random() * 1600
      });
    }
    requestFrame();
  }

  function burst(x, y) {
    const colors = ['#ff8295', '#f5ce84', '#b4dfca', '#fff4ee'];
    const now = performance.now();
    const count = 28 + Math.floor(Math.random() * 18);
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count;
      const speed = 1.1 + Math.random() * 2.4;
      particles.push({
        type: 'firework', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        gravity: .018, spin: 0, rotation: 0, size: 1.5 + Math.random() * 1.8,
        color, born: now, life: 850 + Math.random() * 500
      });
    }
    requestFrame();
  }

  function createStars() {
    const starfield = document.getElementById('starfield');
    if (!starfield || starfield.childElementCount) return;
    const count = Math.min(90, Math.max(42, Math.round(window.innerWidth / 13)));
    for (let index = 0; index < count; index += 1) {
      const star = document.createElement('span');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--opacity', (0.2 + Math.random() * .6).toFixed(2));
      star.style.setProperty('--duration', (2 + Math.random() * 4).toFixed(1) + 's');
      starfield.appendChild(star);
    }
  }

  function createFloatingHearts(duration) {
    const container = document.getElementById('floaties');
    window.clearInterval(heartTimer);
    const stopAt = Date.now() + (duration || 10000);
    heartTimer = window.setInterval(function () {
      if (Date.now() >= stopAt) {
        window.clearInterval(heartTimer);
        return;
      }
      const heart = document.createElement('span');
      heart.className = 'float-heart';
      heart.textContent = Math.random() > .35 ? '♡' : '✦';
      heart.style.left = (5 + Math.random() * 90) + '%';
      heart.style.setProperty('--size', (10 + Math.random() * 14) + 'px');
      heart.style.setProperty('--duration', (8 + Math.random() * 5) + 's');
      container.appendChild(heart);
      window.setTimeout(function () { heart.remove(); }, 14000);
    }, 700);
  }

  function stopFloatingHearts() {
    window.clearInterval(heartTimer);
    heartTimer = 0;
    document.querySelectorAll('.float-heart').forEach(function (heart) { heart.remove(); });
  }

  function startConfetti(duration) {
    stopConfetti();
    addConfetti(105);
    confettiInterval = window.setInterval(function () { addConfetti(16); }, 680);
    confettiStopTimer = window.setTimeout(stopConfetti, duration || 4000);
  }

  function stopConfetti() {
    window.clearInterval(confettiInterval);
    window.clearTimeout(confettiStopTimer);
    confettiInterval = 0;
    confettiStopTimer = 0;
    for (let index = particles.length - 1; index >= 0; index -= 1) {
      if (particles[index].type === 'confetti') particles.splice(index, 1);
    }
  }

  function startFireworks(duration) {
    stopFireworks();
    const stopAt = Date.now() + (duration || 8000);
    const launch = function () {
      if (Date.now() >= stopAt) {
        fireworksTimer = 0;
        return;
      }
      burst(width * (.15 + Math.random() * .7), height * (.13 + Math.random() * .43));
      fireworksTimer = window.setTimeout(launch, 420 + Math.random() * 500);
    };
    launch();
  }

  function stopFireworks() {
    if (fireworksTimer) window.clearTimeout(fireworksTimer);
    fireworksTimer = 0;
  }

  function createSparkle(x, y) {
    const colors = ['#fff4ee', '#f5ce84', '#ffb8c3'];
    const now = performance.now();
    for (let index = 0; index < 8; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = .5 + Math.random() * 2;
      particles.push({
        type: 'sparkle', x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        gravity: 0, spin: 0, rotation: 0, size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)], born: now, life: 450 + Math.random() * 250
      });
    }
    requestFrame();
  }

  function playTone(context, frequency, endFrequency, startTime, duration, volume, waveform) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
    gain.gain.setValueAtTime(.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + .006);
    gain.gain.exponentialRampToValueAtTime(.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  function playSynthesizedSound(name) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioContext) audioContext = new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(function () {});

    const now = audioContext.currentTime;
    if (name === 'success') {
      playTone(audioContext, 660, 740, now, .09, .035, 'triangle');
      playTone(audioContext, 880, 990, now + .09, .13, .035, 'triangle');
    } else if (name === 'cake-cut') {
      playTone(audioContext, 190, 85, now, .22, .04, 'sawtooth');
    } else if (name === 'celebration') {
      [523, 659, 784].forEach(function (frequency, index) {
        playTone(audioContext, frequency, frequency * 1.06, now + index * .11, .18, .035, 'triangle');
      });
    } else {
      playTone(audioContext, 750, 520, now, .055, .028, 'sine');
    }
  }

  function playSound(name) {
    if (!soundEnabled) return;
    const soundFile = window.BirthdayConfig && window.BirthdayConfig.sounds[name];
    if (!soundFile) {
      playSynthesizedSound(name);
      return;
    }
    const audio = new Audio(soundFile);
    audio.volume = .45;
    audio.play().catch(function () { playSynthesizedSound(name); });
  }

  function setSoundEnabled(enabled) {
    soundEnabled = enabled;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  createStars();

  window.BirthdayEffects = {
    createStars, createFloatingHearts, stopFloatingHearts, startConfetti, stopConfetti,
    startFireworks, stopFireworks, createSparkle, playSound, setSoundEnabled
  };
})();
