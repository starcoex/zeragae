const video = document.querySelector("video");
const videoContainer = document.querySelector("#videoContainer");
const playBtn = document.querySelector("#play");
const muteBtn = document.querySelector("#mute");
const volumeRange = document.querySelector("#volume");
const currentTime = document.querySelector("#currentTime");
const totalTime = document.querySelector("#totalTime");
const timeLine = document.querySelector("#timeline");
const fullScreen = document.querySelector("#fullScreen");

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
  playBtn.innerText = video.paused ? "Pause" : "Play";
};
const handleMuteClick = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
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
const handleVideoEnded = () => {
  video.currentTime = 0;
};
const handleKeydownEnter = (event) => {
  if (event.code === "Enter") {
    handlePlayClick();
  }
};
// const handleTimelineMouseDown = (event) => {
//   videoStatus = video.paused ? false : true;
//   video.pause();
// };
// const handleTimelineMouseUp = (event) => {
//   if (videoStatus) {
//     video.play();
//   } else {
//     video.pause();
//   }
// };
const handleFullScreenClick = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreen.innerText = "Enter Full Screen";
  } else {
    videoContainer.requestFullscreen();
    fullScreen.innerText = "Exit Full Screen";
  }
  // if (document.fullscreenElement === null) {
  //   videoContainer.requestFullscreen();
  //   fullScreen.innerText = "Exit Full Screen";
  //   fullScreenStatus = false;
  // } else {
  //   document.exitFullscreen();
  //   fullScreen.innerText = "Enter Full Screen";
  // }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleVideoEnded);
timeLine.addEventListener("input", handleTimelineChange);
timeLine.addEventListener("change", handleTimelineSet);
window.addEventListener("keydown", handleKeydownEnter);
// timeLine.addEventListener("mousedown", handleTimelineMouseDown);
// timeLine.addEventListener("mouseup", handleTimelineMouseUp);
fullScreen.addEventListener("click", handleFullScreenClick);
