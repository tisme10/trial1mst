var video = document.getElementById("preview-video");

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
  navigator.mediaDevices.getUserMedia({video: true, audio: {echoCancellation: true}}).then((stream) => {
    video.srcObject = stream;
    video.play();
  });
}


