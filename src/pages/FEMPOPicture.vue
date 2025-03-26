<template>
  <q-page class="row items-center justify-evenly">
    <div class="contentarea">
      <h1>MDN - navigator.mediaDevices.getUserMedia(): Still photo capture demo</h1>
      <p>
        This example demonstrates how to set up a media stream using your built-in
        webcam, fetch an image from that stream, and create a PNG using that image.
      </p>
      <div class="camera">
        <video id="video" ref="video">Video stream not available.</video>
        <button id="startbutton" ref="startbutton">Take photo</button>
      </div>
      <canvas id="canvas" ref="canvas"> </canvas>
      <div class="output">
        <img id="photo" alt="The screen capture will appear in this box." ref="photo" />
      </div>
      <p>
        Visit our article
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos">
          Taking still photos with WebRTC</a
        >
        to learn more about the technologies used here.
      </p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted,Ref,ref,getCurrentInstance} from "vue";
import {Usuari} from "src/model/Usuari";

(() => {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  const width = 320; // We will scale the photo width to this
  let height = 0; // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  let streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  const instance = getCurrentInstance()
  const video: Ref<HTMLElement> = ref({} as HTMLElement);
  const canvas:Ref<HTMLElement> = ref({} as HTMLElement);
  const photo: Ref<HTMLElement> = ref({} as HTMLElement);
  const startbutton: Ref<HTMLElement> = ref({} as HTMLElement);

  function showViewLiveResultButton() {
    if (window.self !== window.top) {
      // Ensure that if our document is in a frame, we get the user
      // to first open it in its own tab or window. Otherwise, it
      // won't be able to request permission for camera access.
      document.querySelector(".contentarea")!.remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

  function startup() {
    if (showViewLiveResultButton()) {
      return;
    }
    video.value = instance?.refs.video as HTMLElement;
    canvas.value = instance?.refs.canvas as HTMLElement;
    photo.value = instance?.refs.photo as HTMLElement;
    startbutton.value = instance?.refs.startbutton as HTMLElement;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        video.value.srcObject = stream;
        video.value.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.value.addEventListener(
      "canplay",
      (ev) => {
        if (!streaming) {
          height = video.value.videoHeight / (video.value.videoWidth / width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            height = width / (4 / 3);
          }

          video.value.setAttribute("width", width);
          video.value.setAttribute("height", height);
          canvas.value.setAttribute("width", width);
          canvas.value.setAttribute("height", height);
          streaming = true;
        }
      },
      false,
    );

    startbutton.value.addEventListener(
      "click",
      (ev) => {
        takepicture();
        ev.preventDefault();
      },
      false,
    );

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    const context = canvas.value.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.value.width, canvas.value.height);

    const data = canvas.value.toDataURL("image/png");
    photo.value.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    const context = canvas.value.getContext("2d");
    if (width && height) {
      canvas.value.width = width;
      canvas.value.height = height;
      context.drawImage(video.value, 0, 0, width, height);

      const data = canvas.value.toDataURL("image/png");
      photo.value.setAttribute("src", data);
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  onMounted(()=>{
    startup();
  })
})();

</script>

<style scoped>
#video {
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
  width: 320px;
  height: 240px;
}

#photo {
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
  width: 320px;
  height: 240px;
}

#canvas {
  display: none;
}

.camera {
  width: 340px;
  display: inline-block;
}

.output {
  width: 340px;
  display: inline-block;
  vertical-align: top;
}

#startbutton {
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  bottom: 32px;
  background-color: rgba(0, 150, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-family: "Lucida Grande", "Arial", sans-serif;
  color: rgba(255, 255, 255, 1);
}

.contentarea {
  font-size: 16px;
  font-family: "Lucida Grande", "Arial", sans-serif;
  width: 760px;
}

</style>
