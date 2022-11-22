const startBtn = document.querySelector("#startBtn");
const video = document.querySelector("#preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "DownLoad Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};
const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);
  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  } catch (error) {
    console.log(error);
  }
};
init();

startBtn.addEventListener("click", handleStart);
