/* eslint-disable no-restricted-globals */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep this if you have custom styles that aren't covered by Bootstrap
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'slick-carousel/slick/slick.css'; // Keep if you use slick-carousel
import 'slick-carousel/slick/slick-theme.css'; // Keep if you use slick-carousel


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <script src="https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js"></script>
    <App />
  </React.StrictMode>
);


reportWebVitals();
