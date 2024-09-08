import React, { useState, useRef } from 'react';
import '../styles/SignIn.css';
import { useNavigate,useLocation } from 'react-router-dom';
import Switch from 'react-switch';
import Webcam from 'react-webcam';
import axiosInstance from './axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

export default function SignIn() {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [backend, setBackend] = useState('');
    const [enableFaceAuth, setEnableFaceAuth] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showWebcam, setShowWebcam] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const webcamRef = useRef(null);
    const navigate = useNavigate();

    const getBase64Image = (imageDataUrl) => {
        return new Promise((resolve, reject) => {
            const base64Data = imageDataUrl.split(',')[1];
            resolve(base64Data);
        });
    };

    const handleCapture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setShowModal(false); // Hide modal after capturing
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        const userData = { 
            email, 
            ...(enableFaceAuth && capturedImage ? { face_image: await getBase64Image(capturedImage) } : { password })
         };
        let apiUrl;

        // Determine the backend API URL
        switch (backend) {
            case 'python':
                apiUrl = 'api/accounts/login/';
                break;
            default:
                console.error('Please select a valid backend');
                return;
        }

        try {
            // Send POST request to the backend API for login
            const response = await axiosInstance.post(apiUrl, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Check if the response status is 200 (OK)
            // Example code to store tokens in localStorage
            if (response.status === 200) {
                const { access, refresh } = response.data;
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                const redirectPath = location.state?.from || '/home';
                navigate(redirectPath, { state: { message: 'Login successful' } });
            } else {
                setErrorMessage("Invalid Credentials");
            }

        } catch (error) {
            // Handle errors that occur during the request
            let errorMessage = 'An error occurred';
            if (error.response) {
                console.error('Error response:', error.response);
                errorMessage = error.response.data.error || error.response.data.message || errorMessage;
            } else if (error.request) {
                console.error('Error request:', error.request);
                errorMessage = 'No response received from the server';
            } else {
                console.error('Error message:', error.message);
                errorMessage = error.message;
            }
            setErrorMessage(errorMessage);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleLogin} className="form">
                <div className="inputGroup">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                        placeholder='Email'
                    />
                </div>
                <div className="inputGroup">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input"
                        placeholder='Password'
                        disabled={enableFaceAuth} // Disable password field if face auth is enabled
                    />
                </div>
                <div className="separator">
                    <hr className="line" />
                    <span className="separator-text">OR</span>
                    <hr className="line" />
                </div>
                <div className="mb-3 face-auth-container">
                    <label className="form-label">Face Authentication</label>
                    <div className="face-auth-toggle">
                        <Switch
                            onChange={() => setEnableFaceAuth(!enableFaceAuth)}
                            checked={enableFaceAuth}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                            className="react-switch"
                            id="faceAuthToggle"
                        />
                        {enableFaceAuth && (
                            <button type="button" onClick={openModal} className="btn btn-primary ms-3">
                                Open Webcam
                            </button>
                        )}
                    </div>
                </div>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <div className="inputGroup">
                    <label>Backend</label>
                    <select
                        value={backend}
                        onChange={(e) => setBackend(e.target.value)}
                        required
                        className="select"
                    >
                        <option value="" disabled>Select Backend</option>
                        <option value="python">Python</option>
                    </select>
                </div>
                <button type="submit" className="button">Log In</button>
            </form>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Webcam</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width="100%"
                    />
                    <Button variant="primary" onClick={handleCapture} className="mt-3">
                        Capture Photo
                    </Button>
                    {capturedImage && (
                        <div className="captured-image mt-3">
                            <img src={capturedImage} alt="Captured" />
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    );
};
