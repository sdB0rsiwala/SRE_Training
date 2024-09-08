import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axiosInstance from './axiosConfig';
import Navbar from './Navbar';
import '../styles/ProductDetailPage.css';  // Custom styles
import AddToBagModal from './AddToBagModal';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        // Fetch the product details from the backend using the product ID
        axiosInstance.get(`/api/products/${id}/`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the product details!", error);
            });
    }, [id]);

    const addToBag = () => {
        // Retrieve existing cart items from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product is already in the cart
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            // If the product is already in the cart, increase the quantity
            existingProduct.quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            cart.push({ ...product, quantity: 1 });
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Update cart item count
        setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Show the modal
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    if (!product) {
        return <div>Loading...</div>;
    }
    return (
        <Container fluid className="product-detail-wrapper">
            <Navbar />
            <Row noGutters className="h-100">
                <Col xs={6} className="product-image-container">
                    <Image src={product.image} alt={product.name} className="product-image" />
                </Col>
                <Col xs={6} className="product-details-container">
                    <h2>{product.name}</h2>
                    <p className="text-muted">${product.price}</p>

                    <div className="product-actions mt-4">
                        <Button variant="dark" className="add-to-bag-btn" onClick={addToBag}>Add to Bag</Button>
                        <Button variant="outline-dark" className="favorite-btn">
                            <i className="bi bi-heart"></i> Favorite
                        </Button>
                    </div>

                    <div className="product-shipping mt-4">
                        <h6>Shipping</h6>
                        <p>You'll see our shipping options at checkout.</p>
                        <h6>Free Pickup</h6>
                        <a href="#" className="text-decoration-none">Find a Store</a>
                    </div>

                </Col>
            </Row>
            <AddToBagModal
                show={modalVisible}
                onHide={handleModalClose}
                product={product}
                cartItemCount={cartItemCount}
            />
        </Container>

    );
};

export default ProductDetailPage;
