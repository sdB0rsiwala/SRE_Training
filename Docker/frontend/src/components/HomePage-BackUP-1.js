import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/HomePage.css'; // Import custom styles
import SliderComponent from './SliderComponent';
import ProductSlider from './ProductSlider';
import Banner from './banner';
import bannerImage from '../assets/iphone.jpg';
import axiosInstance from './axiosConfig';
import BlogSection from './BlogSection';
import BecomeMemberSection from './BecomeMemberSection';
import { Modal, Button } from 'react-bootstrap';

export default function HomePage() {
    const navigate = useNavigate();
    const servicesRef = useRef(null);
    const blogRef = useRef(null);
    const [mobileProducts, setMobileProducts] = useState([]);
    const [smartwatchProducts, setSmartwatchProducts] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showModalOnHover, setShowModalOnHover] = useState(false);
    const [showModalOnClick, setShowModalOnClick] = useState(false);

    useEffect(() => {
        const fetchMobileProducts = async () => {
            try {
                const response = await axiosInstance.get('api/products/');
                setMobileProducts(response.data);
            } catch (error) {
                console.error('Error fetching mobile phones:', error);
            }
        };

        const fetchSmartwatchProducts = async () => {
            try {
                const response = await axiosInstance.get('api/smartwatches/');
                setSmartwatchProducts(response.data);
            } catch (error) {
                console.error('Error fetching smartwatches:', error);
            }
        };

        // Function to verify JWT
        const verifyToken = async () => {
            try {
                const response = await axiosInstance.post('api/accounts/token/verify/', {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    }
                });

                // Token is valid, fetch user info
                if (response.status === 200) {
                    setUser(response.data['user']);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                // Handle invalid token or fetch error
                console.error('Token verification failed or user info fetch error:', error);
                setIsLoggedIn(false);
            }
        };

        verifyToken();
        fetchMobileProducts();
    }, []);

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
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        setIsLoggedIn(false);
        navigate('/signin');
    };

    const scrollToServices = () => {
        if (servicesRef.current) {
            servicesRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollToBlog = () => {
        if (blogRef.current) {
            blogRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="container-fluid">
            {/* Navigation Bar */}
            <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <div className="container-fluid">
                    {/* Title */}
                    <a className="navbar-brand" href="/" style={{ paddingLeft: '30px' }}>Ministore</a>
                    
                    {/* Navbar Toggle Button for Small Screens */}
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    {/* Navbar Links */}
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto me-5">
                            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
                            <li className="nav-item"><a className="nav-link" href="/service" onClick={(e) => { e.preventDefault(); scrollToServices(); }}>Service</a></li>
                            <li className="nav-item"><a className="nav-link" href="/product">Product</a></li>
                            <li className="nav-item"><a className="nav-link" href="/sale">Sale</a></li>
                            <li className="nav-item"><a className="nav-link" href="/blog" onClick={(e) => { e.preventDefault(); scrollToBlog(); }}>Blog</a></li>
                        </ul>
                        
                        {/* Icons */}
                        <ul className="navbar-nav ms-3">
                            <div
                                    className={`nav-item search-container ${isSearchActive ? 'active' : ''}`}
                                    onMouseEnter={() => setIsSearchActive(true)}
                                    onMouseLeave={() => setIsSearchActive(false)}>

                                    <i className="bi bi-search nav-icon"></i>
                                    <input type="text" className="search-input" placeholder="Search..." />
                            </div>
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
                                    backdrop='static' 
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
                                                    <Button variant="primary" onClick={() => navigate('/signin')}>Sign In</Button>
                                                    <Button variant="secondary" onClick={() => navigate('/signup')}>Sign Up</Button>
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

            {/* Main Content */}
            <main>
                <div className="slider-section">
                    <SliderComponent /> 
                </div>
                <section className="services-section bg-ligh" ref={servicesRef}>
                    <div className="container">
                        <div className="row text-center">
                            <div className="col-md-3 mb-4">
                                <div className="d-flex flex-column align-items-center text-center service">
                                    <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-truck fa-2x"></i> 
                                    <h3 className="fs-5 mb-0 ms-2">Free Delivery</h3> 
                                    </div>
                                    <p className="mb-0">Consectetur adipi elit lorem ipsum dolor sit amet.</p> 
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="d-flex flex-column align-items-center text-center service">
                                    <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-shield-check fa-2x"></i> 
                                    <h3 className="fs-5 mb-0 ms-2">Quality Guarantee</h3> 
                                    </div>
                                    <p className="mb-0">Consectetur adipi elit lorem ipsum dolor sit amet.</p> 
                                </div>
                            </div>
                            <div className="col-md-3 mb-4">
                                <div className="d-flex flex-column align-items-center text-center service">
                                    <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-tags fa-2x"></i> 
                                    <h3 className="fs-5 mb-0 ms-2">Daily Offers</h3> 
                                    </div>
                                    <p className="mb-0">Consectetur adipi elit lorem ipsum dolor sit amet.</p> 
                                </div>
                            </div>

                            <div className="col-md-3 mb-4">
                                <div className="d-flex flex-column align-items-center text-center service">
                                    <div className="d-flex align-items-center mb-2">
                                    <i className="bi bi-lock fa-2x"></i> 
                                    <h3 className="fs-5 mb-0 ms-2">100% Secure Payment</h3> 
                                    </div>
                                    <p className="mb-0">Consectetur adipi elit lorem ipsum dolor sit amet.</p> 
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
                <ProductSlider title="Mobile Phones" products={mobileProducts} shopLink="/mobile-phones" />
                <ProductSlider title="Smartwatches" products={mobileProducts} shopLink="/smartwatches" />
                <Banner imageUrl={bannerImage} shopLink="/sale" /> 
                <section ref={blogRef}>
                    <BlogSection/>
                </section>
                <section>
                    <BecomeMemberSection /> 
                </section>
            </main>

            <footer className="footer">
                <div className="footer-container">
                    <div className="row">
                        <div className="col-md-3">
                            <h5>MiniStore</h5>
                            <p>Nisi, purus vitae, ultrices nunc. Sit ac sit suscipit hendrerit. Gravida massa volutpat aenean odio erat nullam fringilla.</p>
                            <div className="social-icons">
                                <a href="#"><i className="bi bi-facebook"></i></a>
                                <a href="#"><i className="bi bi-instagram"></i></a>
                                <a href="#"><i className="bi bi-twitter"></i></a>
                                <a href="#"><i className="bi bi-linkedin"></i></a>
                                <a href="#"><i className="bi bi-youtube"></i></a>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="/">Home</a></li>
                                <li><a href="/about">About</a></li>
                                <li><a href="/shop">Shop</a></li>
                                <li><a href="/blogs">Blogs</a></li>
                                <li><a href="/contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <h5>Help & Info</h5>
                            <ul className="list-unstyled">
                                <li><a href="#">Track Your Order</a></li>
                                <li><a href="#">Returns Policies</a></li>
                                <li><a href="#">Shipping + Delivery</a></li>
                                <li><a href="#">Contact Us</a></li>
                                <li><a href="#">FAQs</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <h5>Contact Us</h5>
                            <p>Do you have any queries or suggestions? <a href="mailto:yourinfo@gmail.com">yourinfo@gmail.com</a></p>
                            <p>If you need support? Just give us a call. <a href="tel:+5511122233344">+55 111 222 333 44</a></p>
                        </div>
                    </div>
                </div>
            </footer>
            
        </div>
    );
    
}
