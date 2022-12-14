const video = document.querySelector("video");
const videoContainer = document.querySelector("#videoContainer");
const videoControls = document.querySelector("#videoControls");
const playBtn = document.querySelector("#play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.querySelector("#mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeLine = document.querySelector("#timeline");
const fullScreenBtn = document.querySelector("#fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
let videoPlayStatus = false;
let setVideoPlayStatus = false;
let videoStatus = false;

video.volume = volumeValue;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  // muteBtn.innerText = video.muted ? "Unmute" : "Mute";
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeChange = (event) => {
  const { value } = event.target;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  if (value === "0") {
    muteBtnIcon.classList = "fas fa-volume-off";
  } else {
    muteBtnIcon.classList = "fas fa-volume-up";
  }
  volumeValue = value;
};
const formatTime = (seconds) => {
  if (seconds >= 3600) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
};

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};
const handleTimeUpdate = (event) => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};
const handleTimelineChange = (event) => {
  const { value, max } = event.target;
  video.duration = max;
  if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
  }
  video.pause();
  video.currentTime = value;
};
const handleTimelineSet = (event) => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};
const handleKeydown = (event) => {
  if (event.target.id === "textarea") {
    return;
  }

  if (event.code === "Enter") {
    handlePlayClick();
  }
  if (event.code === "Space") {
    handlePlayClick();
  }
  if (event.code === "m" || "M") {
    handleMuteClick();
  }
};
const handleFullScreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};
const hideControls = () => videoControls.classList.remove("showing");
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};
const handleDoubleClick = () => {
  handleFullScreenClick();
};
const handleVideoEnded = () => {
  const { id } = videoContainer.dataset;
  video.currentTime = 0;
  fetch(`/api/videos/${id}/view`, { method: "post" });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
timeLine.addEventListener("input", handleTimelineChange);
timeLine.addEventListener("change", handleTimelineSet);
window.addEventListener("keydown", handleKeydown);
fullScreenBtn.addEventListener("click", handleFullScreenClick);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("dblclick", handleDoubleClick);
