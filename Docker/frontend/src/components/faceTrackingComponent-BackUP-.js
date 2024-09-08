import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const FaceTrackingComponent = ({ isFaceTrackingEnabled }) => {
  const { user, handleLogout } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const workerRef = useRef();
  const lastFaceDetectionRef = useRef(Date.now());
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    if (isFaceTrackingEnabled && user) {
      console.log('Starting face tracking...');
      startTracking();
    } else {
      console.log('Stopping face tracking...');
      stopTracking();
    }
    return () => {
      stopTracking();
    };
  }, [isFaceTrackingEnabled, user]);

  const startTracking = async () => {
    if (!isTracking) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log('Webcam started successfully');
        setIsTracking(true);

        // Initialize Web Worker
        workerRef.current = new Worker(`${process.env.PUBLIC_URL}/faceDetectionWorker.js`);
        workerRef.current.onmessage = handleWorkerMessage;

        // Load models in worker
        workerRef.current.postMessage({ type: 'LOAD_MODELS' });

        // Start face detection loop
        detectFaces();
      } catch (error) {
        console.error('Error starting face tracking:', error);
        setIsTracking(false);
      }
    }
  };

  const stopTracking = () => {
    if (isTracking) {
      setIsTracking(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      console.log('Face tracking stopped');
    }
  };

  const detectFaces = () => {
    if (isTracking && videoRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const width = video.videoWidth;
      const height = video.videoHeight;
  
      // Create an OffscreenCanvas
      const offscreenCanvas = new OffscreenCanvas(width, height);
      const ctx = offscreenCanvas.getContext('2d');
  
      // Draw the current video frame to the OffscreenCanvas
      ctx.drawImage(video, 0, 0, width, height);
  
      // Get the image data from the OffscreenCanvas
      const imageData = ctx.getImageData(0, 0, width, height);
      
      workerRef.current.postMessage({
        type: 'DETECT_FACES',
        imageData: imageData,
        width: width,
        height: height
      }, [imageData.data.buffer]);
    }
    if (isTracking) {
      requestAnimationFrame(detectFaces);
    }
  };

  const handleWorkerMessage = (event) => {
    const { type, data } = event.data;
    switch (type) {
      case 'MODELS_LOADED':
        setIsModelLoaded(true);
        console.log('Face detection models loaded successfully');
        break;
      case 'DETECTION_RESULT':
        const { detections, displaySize } = data;
        updateCanvas(detections, displaySize);
        handleDetectionResult(detections);
        break;
      default:
        console.log('Unknown message from worker:', event.data);
    }
  };

  const updateCanvas = (detections, displaySize) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    detections.forEach(detection => {
      // Draw face box
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(detection.box.x, detection.box.y, detection.box.width, detection.box.height);
      
      // Draw landmarks
      ctx.fillStyle = '#ff0000';
      detection.landmarks.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const handleDetectionResult = (detections) => {
    if (detections.length > 0) {
      console.log(`Detected ${detections.length} face(s)`);
      setFaceDetected(true);
      lastFaceDetectionRef.current = Date.now();

      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
        logoutTimerRef.current = null;
      }
    } else {
      console.log('No face detected');
      setFaceDetected(false);

      const timeSinceLastDetection = Date.now() - lastFaceDetectionRef.current;
      if (timeSinceLastDetection >= 4000 && !logoutTimerRef.current) {
        logoutTimerRef.current = setTimeout(() => {
          console.log('No face detected for 5 seconds. Logging out...');
          handleLogout();
        }, 5000);
      }
    }
  };

  return (
    <div className="face-tracking-container" style={{ position: 'relative' }}>
      <video ref={videoRef} width="640" height="480" style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      {!isModelLoaded && <p>Loading face detection models...</p>}
      {isModelLoaded && !isTracking && <p>Face tracking is not active</p>}
      {isTracking && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px', zIndex: 1000 }}>
          Face Detected: {faceDetected ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default FaceTrackingComponent;