(function () {
  let songs = [];
  let currentIndex = -1;
  let audio;
  let isPlaying = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
    return minutes + ':' + remainder;
  }

  function updateCardStates() {
    document.querySelectorAll('[data-song-card]').forEach(function (card, index) {
      const selected = index === currentIndex;
      card.classList.toggle('is-playing', selected && isPlaying);
      const status = card.querySelector('.song-card__status');
      const button = card.querySelector('.song-play');
      if (status) status.textContent = selected && isPlaying ? 'Now playing' : '';
      if (button) {
        button.innerHTML = selected && isPlaying ? 'Pause <span aria-hidden="true">Ⅱ</span>' : 'Play <span aria-hidden="true">▶</span>';
        button.setAttribute('aria-label', (selected && isPlaying ? 'Pause ' : 'Play ') + (songs[index] ? songs[index].title : 'song'));
      }
    });
    document.getElementById('player').classList.toggle('is-playing', isPlaying);
    document.getElementById('togglePlayback').textContent = isPlaying ? 'Ⅱ' : '▶';
    document.getElementById('togglePlayback').setAttribute('aria-label', isPlaying ? 'Pause song' : 'Play song');
  }

  function setError(message) {
    const error = document.getElementById('audioError');
    error.textContent = message;
    error.hidden = false;
    isPlaying = false;
    updateCardStates();
  }

  function clearError() {
    document.getElementById('audioError').hidden = true;
  }

  function playSong(index) {
    if (!songs.length) return;
    const nextIndex = (index + songs.length) % songs.length;
    const song = songs[nextIndex];
    currentIndex = nextIndex;
    isPlaying = false;
    clearError();
    audio.pause();
    audio.currentTime = 0;
    audio.src = song.file;
    audio.volume = Number(document.getElementById('volumeBar').value);
    document.getElementById('playerTitle').textContent = song.title;
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('duration').textContent = '0:00';
    document.getElementById('progressBar').value = '0';
    updateCardStates();
    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === 'function') {
      playAttempt.catch(function () { setError('Unable to play this song. Please check the music file.'); });
    }
  }

  function pauseSong() {
    if (!audio || currentIndex < 0) return;
    audio.pause();
    isPlaying = false;
    updateCardStates();
  }

  function stopSong() {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    document.getElementById('currentTime').textContent = '0:00';
    document.getElementById('progressBar').value = '0';
    updateCardStates();
  }

  function nextSong() { if (currentIndex >= 0) playSong(currentIndex + 1); else playSong(0); }
  function previousSong() { if (currentIndex >= 0) playSong(currentIndex - 1); else playSong(0); }

  function updateProgress() {
    if (!audio || !Number.isFinite(audio.duration)) return;
    document.getElementById('currentTime').textContent = formatTime(audio.currentTime);
    document.getElementById('duration').textContent = formatTime(audio.duration);
    document.getElementById('progressBar').value = String((audio.currentTime / audio.duration) * 100 || 0);
  }

  function updateVolume(value) { if (audio) audio.volume = Number(value); }

  function handleSongEnd() {
    if (currentIndex >= songs.length - 1) {
      isPlaying = false;
      updateCardStates();
      document.getElementById('playlistFinale').hidden = false;
      document.getElementById('toFinalButton').hidden = false;
      return;
    }
    nextSong();
  }

  function initializePlayer(songList) {
    songs = songList;
    audio = document.getElementById('audioPlayer');
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', function () { isPlaying = true; clearError(); updateCardStates(); });
    audio.addEventListener('pause', function () { isPlaying = false; updateCardStates(); });
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('error', function () {
      if (currentIndex >= 0) setError('Unable to play this song. Please check the music file.');
    });
    document.querySelectorAll('.song-play').forEach(function (button) {
      button.addEventListener('click', function () {
        const index = Number(button.dataset.song);
        if (index === currentIndex && isPlaying) pauseSong();
        else playSong(index);
      });
    });
    document.getElementById('togglePlayback').addEventListener('click', function () {
      if (currentIndex < 0) playSong(0);
      else if (isPlaying) pauseSong();
      else {
        clearError();
        const attempt = audio.play();
        if (attempt && typeof attempt.catch === 'function') attempt.catch(function () { setError('Unable to play this song. Please check the music file.'); });
      }
    });
    document.getElementById('previousSong').addEventListener('click', previousSong);
    document.getElementById('nextSong').addEventListener('click', nextSong);
    document.getElementById('stopSong').addEventListener('click', stopSong);
    document.getElementById('volumeBar').addEventListener('input', function (event) { updateVolume(event.target.value); });
    document.getElementById('progressBar').addEventListener('input', function (event) {
      if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * (Number(event.target.value) / 100);
    });
  }

  window.BirthdayMusic = { initializePlayer, playSong, pauseSong, stopSong, nextSong, previousSong, updateProgress, updateVolume, handleSongEnd };
})();
