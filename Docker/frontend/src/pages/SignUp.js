import React, { useState } from 'react';
import './SignUp.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [backend, setBackend] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Add your login logic here
        e.preventDefault();

        const userData = {name, email, password}
        // Add your login logic here
        let apiUrl;
        switch (backend) {
            case 'python':
            apiUrl = 'http://192.168.0.5:8080/python/signup';
            break;
            case 'go':
            apiUrl = 'http://localhost:8000/signup_GO';
            break;
            case 'java':
            apiUrl = 'http://192.168.0.7:8080/java/signup';
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
          console.log('Success:', response.data);
          navigate('/home', { state: { message: 'Sign Up successful' } })
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className="container">
        <form onSubmit={handleLogin} className="form">
        <div className="inputGroup">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
              placeholder='Name'
            />
          </div>
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
          <button type="submit" className="button">Sign Up</button>
        </form>
      </div>
    )
}