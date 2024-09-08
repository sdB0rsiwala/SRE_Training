import React, { useEffect, useState, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/HomePage.css'; // Import custom styles
import SliderComponent from './SliderComponent';
import ProductSlider from './ProductSlider';
import Banner from './banner';
import bannerImage from '../assets/iphone.jpg';
import BlogSection from './BlogSection';
import BecomeMemberSection from './BecomeMemberSection';
import Navbar from './Navbar';
import axiosInstance from './axiosConfig';

export default function HomePage() {
    const servicesRef = useRef(null);
    const blogRef = useRef(null);
    const [mobileProducts, setMobileProducts] = useState([]);
    const [smartwatchProducts, setSmartwatchProducts] = useState([]);

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

        fetchMobileProducts();
        // fetchSmartwatchProducts();
    }, []);

    
    return (
        <div className="container-fluid">
            {/* Navigation Bar */}
            
            <Navbar serviceRef={servicesRef} blogRef={blogRef} />

            {/* Main Content */}
            <main>
                <div className="slider-section">
                    <SliderComponent /> 
                </div>
                <section className="services-section" ref={servicesRef}>
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
                                    <i className="bi bi-headset fa-2x"></i> 
                                    <h3 className="fs-5 mb-0 ms-2">24/7 Support</h3> 
                                    </div>
                                    <p className="mb-0">Consectetur adipi elit lorem ipsum dolor sit amet.</p> 
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ProductSlider title="Mobile Phones" products={mobileProducts} shopLink="/products" />
                <ProductSlider title="Smartwatches" products={mobileProducts} shopLink="/products" />
                <Banner imageUrl={bannerImage} shopLink="/sale" />         

                <section className="blog-section" ref={blogRef}>
                    <BlogSection />
                </section>

                <section className="become-member-section">
                    <BecomeMemberSection />
                </section>

                {/* Footer */}
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
            
            </main>
        </div>
    );
}
