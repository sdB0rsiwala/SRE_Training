import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import * as faceapi from 'face-api.js';

const FaceTrackingComponent = ({ isFaceTrackingEnabled }) => {
  const { user, handleLogout } = useAuth(); 
  const [isTracking, setIsTracking] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const lastFaceDetectionRef = useRef(Date.now());
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    loadModels();
    return () => {
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isFaceTrackingEnabled && user && isModelLoaded) {
      console.log('Starting face tracking...');
      startTracking();
    } else {
      console.log('Stopping face tracking...');
      stopTracking();
    }
  }, [isFaceTrackingEnabled, user, isModelLoaded]);

  const loadModels = async () => {
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log('TinyFaceDetector model loaded');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      console.log('FaceLandmark68Net model loaded');
      setIsModelLoaded(true);
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face-api models:', error);
    }
  };

  useEffect(() => {
    const detectFacesInterval = setInterval(() => {
      if (isTracking && videoRef.current && videoRef.current.readyState === 4) {
        detectFaces();
      } else {
        console.log('Video is not ready or tracking is disabled');
      }
    }, 100); // Check every 100ms or adjust as needed
  
    return () => clearInterval(detectFacesInterval); // Cleanup on unmount or when isTracking changes
  }, [isTracking]);
  ;


  const startTracking = async () => {
    if (!isTracking) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log('Webcam started successfully');
        setIsTracking(true);
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
      console.log('Face tracking stopped');
    }
  };

  const detectFaces = async () => {
    console.log('Detecting faces...');
    console.log('isTracking:', isTracking);
    console.log('videoRef.current:', videoRef.current);
  
    // Ensure the video is fully ready before detecting faces
    if (isTracking && videoRef.current.readyState === 4) {
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();
  
        const canvas = canvasRef.current;
        const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
        faceapi.matchDimensions(canvas, displaySize);
  
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  
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
  
        // Continue detecting faces if tracking is still enabled
        if (isTracking) {
          requestAnimationFrame(detectFaces);
        }
      } catch (error) {
        console.error('Error in detectFaces:', error);
      }
    } else {
      console.log('Video is not ready or tracking is disabled');
    }
  };
  

  return (
    <div className="face-tracking-container" style={{ position: 'relative', width: 0, height: 0, overflow: 'hidden' }}>
      <video ref={videoRef} width="640" height="480" style={{ position: 'absolute' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
    </div>
  );
};

export default FaceTrackingComponent;

