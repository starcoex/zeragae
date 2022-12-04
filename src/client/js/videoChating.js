const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const muteIcon = muteBtn.querySelector("i");
const cameraBtn = document.getElementById("camera");
const cameraIcon = cameraBtn.querySelector("i");
const audiosSelect = document.getElementById("audios");
const camerasSelect = document.getElementById("cameras");
const videoChatWelcome = document.getElementById("videoChatWelcome");
const videoChatCall = document.getElementById("videoChatCall");
const videoChatRoom = document.getElementById("videoChatRoom");
const roomMessage = document.getElementById("roomMessage");

videoChatCall.hidden = true;

let myStream;
let myPeerConnection;
let myDataChannel;
let roomName;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const currentAudio = myStream.getAudioTracks()[0];
    const currentCamera = myStream.getVideoTracks()[0];

    const audios = devices.filter((device) => {
      return device.kind === "audioinput";
    });
    audios.forEach((audio) => {
      const option = document.createElement("option");
      option.value = audio.deviceId;
      option.innerText = audio.label;
      if (currentAudio.label === audio.label) {
        option.selected = true;
      }
      audiosSelect.appendChild(option);
    });
    const cameras = devices.filter((device) => {
      return device.kind === "videoinput";
    });
    cameras.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    });
  } catch (error) {
    console.log(error);
  }
};

const getMidea = async (deviceId) => {
  const initialConstraints = {
    audio: true,
    video: { facingMode: "user" },
  };
  // console.log(initialConstraints.audio);
  const audio_Vidoe_Constraints = {
    // audio: { deviceId },
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  // console.log(audio_Vidoe_Constraints.audio);
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? audio_Vidoe_Constraints : initialConstraints
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (error) {
    console.log(error);
  }
};
// getMidea();

const handleMuteClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  // console.log(event);
  // event.target.innerText = "UnMute";
  if (!muted) {
    // muteBtn.innerText = " Unmute";
    muteIcon.classList = "fas fa-volume-mute";
    muted = true;
  } else {
    // muteBtn.innerText = "Mute";
    muteIcon.classList = "fas fa-volume-up";
    muted = false;
  }
};
const handleCameraClick = () => {
  myStream.getVideoTracks().forEach((track) => {
    track.enabled = !track.enabled;
  });

  if (!cameraOff) {
    // cameraBtn.innerText = "Trun Camera On.";
    cameraIcon.classList = "fas fa-play";
    cameraOff = true;
  } else {
    // cameraBtn.innerText = "Turun Camera off.";
    cameraIcon.classList = "fas fa-pause";
    cameraOff = false;
  }
};
const handleAudioChange = async () => {
  await getMidea(audiosSelect.value);
};
const handleCameraChange = async () => {
  await getMidea(camerasSelect.value);
  if (myPeerConnection) {
    const videoTrack = myStream.getVideoTracks()[0];
    const videoSender = myPeerConnection
      .getSenders()
      .find((sender) => sender.track.kind === "video");
    videoSender.replaceTrack(videoTrack);
  }
};

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
audiosSelect.addEventListener("input", handleAudioChange);
camerasSelect.addEventListener("input", handleCameraChange);

//Welcome Form (join a room)

const welcomeForm = videoChatWelcome.querySelector("form");

const startMedia = async () => {
  const h3 = videoChatRoom.querySelector("h3");
  h3.innerText = `Video Chat Room : ${roomName}`;
  videoChatWelcome.hidden = true;
  videoChatCall.hidden = false;
  await getMidea();
  makeConnection();
};

const handleWelcomeSumbit = async (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  await startMedia();
  socket.emit("videojoin_room", input.value);
  roomName = input.value;
  input.vlaue = "";
};

welcomeForm.addEventListener("submit", handleWelcomeSumbit);

//Socket Code

socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => {
    console.log(event.data);
    addMessage(`message : ${event.data}`);
  });
  console.log("Made data Channel");
  console.log("Someone Joined!");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("Sent the offer");
  socket.emit("offer", offer, roomName);
});
socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) => {
      console.log(event.data);
    });
  });
  console.log("Recive the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("Sent the answer");
});
socket.on("answer", (answer) => {
  myPeerConnection.setRemoteDescription(answer);
});
socket.on("ice", (ice) => {
  console.log("Received candidate");
  myPeerConnection.addIceCandidate(ice);
});
//RTC Code

const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  // myPeerConnection.addEventListener("addstream", handleAddStream);
  myPeerConnection.addEventListener("track", (data) => {
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.streams[0];
  });
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
};

const handleIce = (data) => {
  console.log("Sent Candidate");
  // console.log(data);
  socket.emit("ice", data.candidate, roomName);
};

// const handleAddStream = (data) => {
//   // console.log(data);
//   const peerFace = document.getElementById("peerFace");
//   peerFace.srcObject = data.stream;
// };

const handleRoomMessageSumbit = (event) => {
  event.preventDefault();
  const input = roomMessage.querySelector("input");
  const value = input.value;
  console.log(value);
  myDataChannel.send(value);
  const ul = videoChatRoom.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = value;
  ul.appendChild(li);
};

roomMessage.addEventListener("submit", handleRoomMessageSumbit);
