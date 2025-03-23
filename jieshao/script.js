const video = document.getElementById('main-video');
const playBtn = document.querySelector('.play-btn');
const progressBar = document.querySelector('.progress-bar');
const timeDisplay = document.querySelector('.time-display');

playBtn.addEventListener('click', () => {
  if(video.paused) {
    video.play();
    playBtn.innerHTML = '<img src="assets/pause.png" alt="暂停">';
  } else {
    video.pause();
    playBtn.innerHTML = '<img src="assets/play.png" alt="播放">';
  }
});

video.addEventListener('timeupdate', () => {
  const progress = (video.currentTime / video.duration) * 100;
  progressBar.value = progress;
  timeDisplay.textContent = formatTime(video.currentTime);
});

progressBar.addEventListener('input', (e) => {
  const time = (e.target.value / 100) * video.duration;
  video.currentTime = time;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

///////////////////////暂留功能 function initVideoSource(url) {video.src = url;video.load();}