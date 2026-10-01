/* Customize the name, messages, songs, colors, and game target here. */
const CONFIG = {
  friendName: 'Priyaharshini',
  birthdayMessage: [
    'Today is the day someone truly special came into this world.',
    'I hope your day is filled with happiness, laughter, love, and all the little things that make you smile.',
    'Thank you for the laughs, random conversations, crazy moments, and beautiful memories.',
    'I hope this new year of your life brings you everything you deserve.'
  ],
  finalMessage: 'I hope this new chapter brings you more happiness than you expect, more memories than you can count, and more reasons to smile every day.',
  songs: [
    { title: '[Pesamale]', description: 'A soulful song about unspoken feelings, quiet love, and emotions that sometimes speak louder than words.', file: 'assets/music/song1.mp3' },
    { title: '[Nenjin Ezhuthu]', description: 'A soft and beautiful song that expresses feelings that are difficult to put into words. Perfect for a special someone.', file: 'assets/music/song2.mp3' },
    { title: '[Rathinamo]', description: 'A sweet romantic song with a gentle melody, capturing the beauty and warmth of having someone special in your heart.', file: 'assets/music/song3.mp3' }
  ],
  sounds: {},
  gameTarget: 5,
  finalQuote: "Some people don't need a thousand memories to be special. Sometimes, their presence itself becomes a beautiful memory.",
  labels: {
    begin: "Let's see",
    cutCake: 'Cut the cake',
    nextSurprise: 'Next surprise',
    finalSurprise: 'Final surprise'
  },
  timing: { loading: 1200, reveal: 680, transition: 360, celebration: 9000 }
};

(function () {
  const revealTimers = [];
  const finalTimers = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setFriendName() {
    document.querySelectorAll('[data-friend-name]').forEach(function (element) {
      element.textContent = CONFIG.friendName;
    });
    document.getElementById('finalQuote').textContent = CONFIG.finalQuote;
    document.querySelector('.final-message').textContent = CONFIG.finalMessage;
    const paragraphs = document.querySelectorAll('.birthday-message p');
    CONFIG.birthdayMessage.forEach(function (message, index) {
      if (paragraphs[index]) paragraphs[index].textContent = message;
    });
    CONFIG.songs.forEach(function (song, index) {
      const card = document.querySelector('[data-song-card="' + index + '"]');
      if (!card) return;
      card.querySelector('h3').textContent = song.title;
      card.querySelector('.song-card__copy p').textContent = song.description;
      card.querySelector('.song-play').setAttribute('aria-label', 'Play ' + song.title);
    });
    document.getElementById('beginButton').firstChild.nodeValue = CONFIG.labels.begin + ' ';
    document.getElementById('cutCakeButton').firstChild.nodeValue = CONFIG.labels.cutCake + ' ';
    document.getElementById('toGameButton').firstChild.nodeValue = CONFIG.labels.nextSurprise + ' ';
    document.getElementById('toMusicButton').firstChild.nodeValue = CONFIG.labels.nextSurprise + ' ';
    document.getElementById('toFinalButton').firstChild.nodeValue = CONFIG.labels.finalSurprise + ' ';
  }

  function revealBirthday() {
    revealTimers.forEach(window.clearTimeout);
    const lines = Array.from(document.querySelectorAll('#revealCopy [data-reveal]'));
    lines.forEach(function (line) { line.classList.remove('is-visible'); });
    lines.forEach(function (line, index) {
      revealTimers.push(window.setTimeout(function () { line.classList.add('is-visible'); }, reducedMotion ? index * 30 : index * CONFIG.timing.reveal));
    });
    const revealDuration = reducedMotion ? lines.length * 30 + 120 : lines.length * CONFIG.timing.reveal + 230;
    revealTimers.push(window.setTimeout(function () {
      document.getElementById('cakeIntro').hidden = false;
      document.getElementById('cakeScene').hidden = false;
      document.getElementById('cutCakeButton').hidden = false;
    }, revealDuration));
  }

  function cutCake() {
    const button = document.getElementById('cutCakeButton');
    const scene = document.getElementById('cakeScene');
    button.disabled = true;
    scene.classList.add('is-cut');
    const knife = document.createElement('span');
    knife.className = 'cake-knife';
    knife.setAttribute('aria-hidden', 'true');
    scene.appendChild(knife);
    window.BirthdayEffects.playSound('cake-cut');
    window.BirthdayEffects.startConfetti(3800);
    window.BirthdayEffects.startFireworks(3800);
    window.BirthdayEffects.createFloatingHearts(4200);
    window.setTimeout(function () {
      knife.remove();
      document.getElementById('cakeWish').hidden = false;
      window.BirthdayEffects.playSound('celebration');
    }, reducedMotion ? 100 : 1500);
  }

  function revealFinal() {
    finalTimers.forEach(window.clearTimeout);
    const story = document.getElementById('finalStory');
    const items = Array.from(story.children);
    items.forEach(function (item) { item.classList.remove('is-visible'); });
    document.getElementById('finalCelebration').hidden = true;
    document.body.classList.add('is-final');
    items.forEach(function (item, index) {
      finalTimers.push(window.setTimeout(function () { item.classList.add('is-visible'); }, reducedMotion ? index * 40 : index * 850));
    });
    finalTimers.push(window.setTimeout(function () {
      document.getElementById('finalCelebration').hidden = false;
      document.body.classList.add('is-celebrating');
      window.BirthdayEffects.startConfetti(CONFIG.timing.celebration);
      window.BirthdayEffects.startFireworks(CONFIG.timing.celebration);
      window.BirthdayEffects.createFloatingHearts(CONFIG.timing.celebration);
    }, reducedMotion ? items.length * 40 + 200 : items.length * 850 + 900));
  }

  function resetStory() {
    revealTimers.forEach(window.clearTimeout);
    finalTimers.forEach(window.clearTimeout);
    window.BirthdayEffects.stopFireworks();
    window.BirthdayEffects.stopConfetti();
    window.BirthdayEffects.stopFloatingHearts();
    document.body.classList.remove('is-final', 'is-celebrating');
    document.getElementById('revealCopy').querySelectorAll('[data-reveal]').forEach(function (line) { line.classList.remove('is-visible'); });
    document.getElementById('cakeIntro').hidden = true;
    document.getElementById('cakeScene').hidden = true;
    document.getElementById('cakeScene').classList.remove('is-cut');
    document.getElementById('cakeScene').querySelectorAll('.cake-knife').forEach(function (knife) { knife.remove(); });
    document.getElementById('cutCakeButton').hidden = true;
    document.getElementById('cutCakeButton').disabled = false;
    document.getElementById('cakeWish').hidden = true;
    document.getElementById('finalStory').hidden = false;
    document.getElementById('finalStory').querySelectorAll('.is-visible').forEach(function (item) { item.classList.remove('is-visible'); });
    document.getElementById('finalCelebration').hidden = true;
    const endButton = document.getElementById('endButton');
    endButton.disabled = false;
    endButton.textContent = 'End';
    document.getElementById('playlistFinale').hidden = true;
    document.getElementById('toFinalButton').hidden = true;
    window.BirthdayGame.resetGame();
    window.BirthdayMusic.stopSong();
    window.BirthdayNavigation.showStep(1);
  }

  function initialize() {
    setFriendName();
    window.BirthdayMusic.initializePlayer(CONFIG.songs);
    document.getElementById('beginButton').addEventListener('click', function () {
      window.BirthdayNavigation.showStep(2);
      revealBirthday();
    });
    document.getElementById('cutCakeButton').addEventListener('click', cutCake);
    document.getElementById('toGameButton').addEventListener('click', function () {
      window.BirthdayNavigation.showStep(3);
      window.BirthdayGame.startGame(CONFIG.gameTarget);
    });
    document.getElementById('toMusicButton').addEventListener('click', function () {
      window.BirthdayNavigation.showStep(4);
    });
    document.getElementById('toFinalButton').addEventListener('click', function () {
      window.BirthdayNavigation.showStep(5);
      revealFinal();
    });
    document.getElementById('replayButton').addEventListener('click', resetStory);
    document.getElementById('endButton').addEventListener('click', function (event) {
      finalTimers.forEach(window.clearTimeout);
      window.BirthdayEffects.stopFireworks();
      window.BirthdayEffects.stopConfetti();
      window.BirthdayEffects.stopFloatingHearts();
      document.body.classList.remove('is-celebrating');
      event.currentTarget.textContent = 'The End';
      event.currentTarget.disabled = true;
    });
    document.getElementById('soundToggle').addEventListener('click', function (event) {
      const button = event.currentTarget;
      const enabled = !button.classList.contains('is-on');
      button.classList.toggle('is-on', enabled);
      button.title = enabled ? 'Sound effects on' : 'Sound effects off';
      button.setAttribute('aria-label', enabled ? 'Turn sound effects off' : 'Turn sound effects on');
      button.querySelector('.sound-toggle__label').textContent = enabled ? 'Sound on' : 'Sound off';
      window.BirthdayEffects.setSoundEnabled(enabled);
    });
    document.addEventListener('click', function (event) {
      const button = event.target.closest('button');
      if (!button || button.id === 'cutCakeButton' || button.classList.contains('game-heart')) return;
      window.BirthdayEffects.playSound('click');
    });
    document.querySelectorAll('.button').forEach(function (button) {
      button.addEventListener('click', function (event) {
        if (window.BirthdayEffects) window.BirthdayEffects.createSparkle(event.clientX, event.clientY);
      });
    });
    window.setTimeout(function () { document.getElementById('loader').classList.add('is-done'); }, CONFIG.timing.loading);
  }

  document.addEventListener('DOMContentLoaded', initialize, { once: true });
  window.BirthdayConfig = CONFIG;
})();
