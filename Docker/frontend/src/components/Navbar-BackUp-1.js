import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Navbar.css'; // Import custom styles for Navbar
import { useAuth } from './AuthContext';

export default function Navbar({ serviceRef=null, blogRef= null }) {
  const { user, isLoggedIn, verifyToken , handleLogout } = useAuth();
  const navigate = useNavigate();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showModalOnClick, setShowModalOnClick] = useState(false);
  const [showModalOnHover, setShowModalOnHover] = useState(false);

  useEffect(() => {
    verifyToken(); // Verify the token every time Navbar is rendered or reloaded
  }, []); // Empty dependency array ensures this runs only on mount


    const handleShowModal = () => {
        setShowModalOnClick(true);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setShowModalOnClick(false);
        setShowModalOnHover(false);
        setIsModalVisible(false);
    };

    const handleIconMouseEnter = () => {
        if (!showModalOnClick) {
            setShowModalOnHover(true);
            setIsModalVisible(true);
        }
    };

    const handleIconMouseLeave = () => {
        if (!showModalOnClick) {
            setShowModalOnHover(false);
            setIsModalVisible(false);
        }
    }


    const handleScrollToService = () => {
        if (serviceRef && serviceRef.current) {
          serviceRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('Service section not available.');
          // Optionally, navigate to another page or show an alert
        }
      };
    
      const handleScrollToBlog = () => {
        if (blogRef && blogRef.current) {
          blogRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.log('Blog section not available.');
          // Optionally, navigate to another page or show an alert
        }
      };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/" style={{ paddingLeft: '30px' }}>Ministore</a>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5">
            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#" onClick={handleScrollToService}>Service</a></li>
            <li className="nav-item"><a className="nav-link" href="/products">Product</a></li>
            <li className="nav-item"><a className="nav-link" href="/sale">Sale</a></li>
            <li className="nav-item"><a className="nav-link" href="#" onClick={handleScrollToBlog}>Blog</a></li>
          </ul>

          <ul className="navbar-nav ms-3">
          <li
              className={`nav-item search-container ${isSearchActive ? 'active' : ''}`}
              onMouseEnter={() => setIsSearchActive(true)}
              onMouseLeave={() => setIsSearchActive(false)}
            >
              <i className="bi bi-search nav-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                onFocus={() => setIsSearchActive(true)}
                onBlur={() => setIsSearchActive(false)}
              />
            </li>
            <li className="nav-item">
                <div
                    className="nav-link d-inline-block"
                    onMouseEnter={handleIconMouseEnter}
                    onMouseLeave={handleIconMouseLeave}
                    onClick={handleShowModal}
                >
                    <i className="bi bi-person nav-icon"></i>
                </div>
                <Modal  show={isModalVisible} 
                        onHide={handleCloseModal} 
                        className="custom-modal"
                        aria-labelledby="modal-title" 
                        aria-hidden="true" >
                        <Modal.Header closeButton>
                            <Modal.Title>User Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {isLoggedIn ? (
                                <div>
                                    <p>Email: {user.email}</p>
                                    <p>Name: {user.first_name} {user.last_name}</p>
                                    <Button variant="primary" onClick={handleLogout}>Sign Out</Button>
                                </div>
                                ) : (
                                    <div>
                                        <Button variant="primary" onClick={() => navigate('/signin', { state: { from: window.location.pathname } })}>Sign In</Button>
                                        <Button variant="secondary" onClick={() => navigate('/signup', { state: { from: window.location.pathname } })}>Sign Up</Button>
                                    </div>
                            )}
                        </Modal.Body>
                </Modal>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="/cart">
                <i className="bi bi-cart nav-icon"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
