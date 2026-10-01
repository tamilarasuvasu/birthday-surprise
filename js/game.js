(function () {
  let score = 0;
  let target = 5;
  let active = false;
  let spawnTimer = 0;
  let currentHeart = null;

  function updateScore() {
    document.getElementById('gameScore').textContent = String(score);
  }

  function createHeart() {
    const area = document.getElementById('gameArea');
    if (!active || currentHeart || !area) return;
    const heart = document.createElement('button');
    const size = 28 + Math.random() * 15;
    heart.className = 'game-heart';
    heart.type = 'button';
    heart.setAttribute('aria-label', 'Catch this heart');
    heart.textContent = '♥';
    heart.style.setProperty('--heart-size', size + 'px');
    heart.style.left = (8 + Math.random() * 78) + '%';
    heart.style.top = (12 + Math.random() * 63) + '%';
    heart.addEventListener('click', function (event) { catchHeart(event, heart); }, { once: true });
    area.appendChild(heart);
    currentHeart = heart;
    window.setTimeout(function () {
      if (currentHeart === heart) {
        heart.remove();
        currentHeart = null;
      }
    }, 2300);
  }

  function catchHeart(event, heart) {
    if (!active || heart !== currentHeart) return;
    const bounds = heart.getBoundingClientRect();
    if (window.BirthdayEffects) {
      window.BirthdayEffects.createSparkle(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      window.BirthdayEffects.playSound('success');
    }
    heart.remove();
    currentHeart = null;
    score += 1;
    updateScore();
    if (score >= target) gameCompleted();
  }

  function gameCompleted() {
    active = false;
    window.clearInterval(spawnTimer);
    if (currentHeart) currentHeart.remove();
    currentHeart = null;
    document.getElementById('gameInstruction').hidden = true;
    document.getElementById('gameComplete').hidden = false;
    if (window.BirthdayEffects) {
      window.BirthdayEffects.startConfetti(3300);
      window.BirthdayEffects.playSound('success');
    }
  }

  function startGame(gameTarget) {
    resetGame();
    target = Math.max(1, Number(gameTarget) || 5);
    document.getElementById('gameTarget').textContent = String(target);
    document.getElementById('gameTargetText').textContent = String(target);
    active = true;
    createHeart();
    spawnTimer = window.setInterval(createHeart, 720);
  }

  function resetGame() {
    active = false;
    window.clearInterval(spawnTimer);
    spawnTimer = 0;
    if (currentHeart) currentHeart.remove();
    currentHeart = null;
    score = 0;
    updateScore();
    const area = document.getElementById('gameArea');
    area.querySelectorAll('.game-heart').forEach(function (heart) { heart.remove(); });
    document.getElementById('gameInstruction').hidden = false;
    document.getElementById('gameComplete').hidden = true;
  }

  window.BirthdayGame = { startGame, createHeart, catchHeart, updateScore, gameCompleted, resetGame };
})();
