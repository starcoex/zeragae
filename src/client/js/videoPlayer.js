const video = document.querySelector("video");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");

let volumeValue = 0.5;
video.volume = volumeValue;
// video.volume = 0.5;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtn.innerText = video.paused ? "Play" : "Pause";
};
// const handlePaly = () => (playBtn.innerText = "Pause");
// const handlePause = () => (playBtn.innerText = "Play");

const handleMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
    // muteBtn.innerText = "Mute";
    // volumeRange.value = "0.5";
  } else {
    video.muted = true;
    // volumeRange.value = "0";
    // muteBtn.innerText = "Unmute";
  }
  muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = (event) => {
  const { value } = event.target;
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  // volume = event.target.value;
  // video.volume = event.target.value;
};
const handleLoadedMetadata = () => {
  totalTime.innerText = Math.floor(video.duration);
};
const handleTimeUpdate = (event) => {
  // console.log(event);
  // console.log(video.currentTime);
  currentTime.innerText = Math.floor(video.currentTime);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
// video.addEventListener("play", handlePaly);
// video.addEventListener("pause", handlePause);
