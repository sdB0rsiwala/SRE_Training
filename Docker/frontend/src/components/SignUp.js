import React, { useState, useRef } from 'react';
import '../styles/SignUp.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Switch from 'react-switch';
import Webcam from 'react-webcam';
import { Modal, Button } from 'react-bootstrap';

export default function SignUp() {
    const location = useLocation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [backend, setBackend] = useState('');
    const [enableFaceAuth, setEnableFaceAuth] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showWebcam, setShowWebcam] = useState(false);
    const [showModal, setShowModal] = useState(false); // State for modal
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
        setShowWebcam(true); // Show webcam when modal opens
    };

    const closeModal = () => {
        setShowModal(false);
        setShowWebcam(false); // Hide webcam when modal closes
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        const userData = {
          user: {
              first_name: firstName,
              last_name: lastName,
              email,
              password
          },
          phone_number: phoneNumber,
          face_image: enableFaceAuth && capturedImage ? await getBase64Image(capturedImage) : null
      };
        let apiUrl;

        switch (backend) {
            case 'python':
                apiUrl = 'http://localhost:8080/api/accounts/register/';
                break;
            case 'go':
                apiUrl = 'http://127.0.0.1:8000/api/accounts/register/';
                break;
            case 'java':
                apiUrl = 'http://localhost:8081/api/accounts/register/';
                break;
            default:
                console.error('Please select a valid backend');
                return;
        }

        try {
            const response = await axios.post(apiUrl, userData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                const { access, refresh } = response.data;
                // Save tokens to localStorage or state
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                const redirectPath = location.state?.from || '/home';
                navigate(redirectPath, { state: { message: 'Sign Up successful' } });
            } else {
                setErrorMessage("Error during registration");
            }
        } catch (error) {
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
            <form onSubmit={handleSignUp} className="form">
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="form-control"
                        placeholder='First Name'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="form-control"
                        placeholder='Last Name'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                        placeholder='Email'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                        placeholder='Password'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-control"
                        placeholder='Confirm Password'
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        className="form-control"
                        placeholder='Phone Number'
                    />
                </div>
                <div className="mb-3 face-auth-container">
                    <label className="form-label">Enable Face Authentication</label>
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
                <div className="mb-3">
                    <label className="form-label">Backend</label>
                    <select
                        value={backend}
                        onChange={(e) => setBackend(e.target.value)}
                        required
                        className="form-select"
                    >
                        <option value="" disabled>Select Backend</option>
                        <option value="python">Python</option>
                        <option value="go">Go</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success w-100">Sign Up</button>
                {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            </form>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Capture Face Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="webcam-container">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width="100%"
                            height="100%"
                        />
                    </div>
                    <Button variant="primary" onClick={handleCapture} className="mt-3 w-100">
                        Capture Image
                    </Button>
                    {capturedImage && (
                        <div className="captured-image mt-3">
                            <img src={capturedImage} alt="Captured" className="img-fluid" />
                        </div>
                    )}
                </Modal.Body>
            </Modal>

        </div>
    );
}
