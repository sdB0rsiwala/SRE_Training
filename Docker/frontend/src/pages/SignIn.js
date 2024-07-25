import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [backend, setBackend] = useState('');
    const [errorMessage, setErroMessage] = useState('')
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Add your login logic here
        const userData = {email, password}
        let apiUrl;
        switch (backend) {
            case 'python':
            apiUrl = 'http://192.168.0.5:8080/python/signin';
            break;
            case 'go':
            apiUrl = 'http://127.0.0.1:8000/signin_GO';
            break;
            case 'java':
            apiUrl = 'http://192.168.0.7:8080/java/signin';
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
          console.log('Success:', response);
          navigate('/home', { state: { message: 'Login successful' } });
        } catch (error) {
          let errorMessage = 'An error occurred';
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error('Error response:', error.response);
              errorMessage = error.response.data.error || error.response.data.message || errorMessage;
          } else if (error.request) {
              // The request was made but no response was received
              console.error('Error request:', error.request);
              errorMessage = 'No response received from the server';
          } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error message:', error.message);
              errorMessage = error.message;
          }
          setErroMessage(errorMessage);
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
            />
          </div>
          {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
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
              <option value="go">Go</option>
              <option value="java">Java</option>
            </select>
          </div>
          <button type="submit" className="button">Log In</button>
        </form>
      </div>
    )
}