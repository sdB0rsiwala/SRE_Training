importScripts('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js');

let isModelLoaded = false;

async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  isModelLoaded = true;
  self.postMessage({ type: 'MODELS_LOADED' });
}

async function detectFaces(imageData, width, height) {
  if (!isModelLoaded) {
    console.log('Models not loaded yet');
    return;
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imageData, 0, 0);

  const detections = await faceapi.detectAllFaces(
    canvas,
    new faceapi.TinyFaceDetectorOptions()
  ).withFaceLandmarks();

  return detections.map(d => ({
    box: d.detection.box,
    landmarks: d.landmarks.positions
  }));
}

self.onmessage = async function(e) {
  const { type, imageData, width, height } = e.data;

  switch (type) {
    case 'LOAD_MODELS':
      await loadModels();
      break;
    case 'DETECT_FACES':
      const detections = await detectFaces(imageData, width, height);
      self.postMessage({
        type: 'DETECTION_RESULT',
        data: {
          detections: detections,
          displaySize: { width, height }
        }
      });
      break;
    default:
      console.log('Unknown message type:', type);
  }
};