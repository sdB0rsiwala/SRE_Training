import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Form } from 'react-bootstrap';
import Navbar from './Navbar';
import '../styles/cartPage.css'; // Custom styles
import { useNavigate } from 'react-router-dom';



const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
    }, []);

    const handleQuantityChange = (id, quantity) => {
        // Update the quantity of the product in the cart
        const updatedCart = cartItems.map(item => 
            item.id === id ? { ...item, quantity: quantity } : item
        );

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCheckout = () => {
        navigate('/checkout');
    }
    const handleIncrement = (id) => {
        // Increment the quantity of the product in the cart
        const updatedCart = cartItems.map(item => 
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );

        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };


    const handleRemoveItem = (id) => {
        // Remove the item from the cart
        const updatedCart = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <Container fluid>
            <Navbar />
            <Row className="mt-4">
                <Col xs={12} md={8}>
                    <h4>Bag</h4>
                    {cartItems.length === 0 ? (
                        <p>Your bag is empty.</p>
                    ) : (
                        cartItems.map((item, index) => (
                            <Row key={index} className="cart-item mb-4 border-bottom pb-3">
                                <Col xs={12} md={3} className="text-center">
                                    <Image src={item.image} alt={item.name} fluid className="cart-item-image" />
                                </Col>
                                <Col xs={12} md={6}>
                                    <h5>{item.name}</h5>
                                    <p>{item.description}</p>
                                    <p>Size: {item.size}</p>
                                    <Form.Group as={Row} className="align-items-center">
                                        <Form.Label column xs="auto" className="mb-0">Quantity:</Form.Label>
                                        <Col xs="auto" className="d-flex align-items-center">
                                            <Form.Control 
                                                type="number" 
                                                min="1"
                                                value={item.quantity} 
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                className="w-auto"
                                            />
                                            <Button 
                                                variant="outline-dark" 
                                                onClick={() => handleIncrement(item.id)}
                                                className="me-2"
                                            >
                                                +
                                            </Button>
                                        </Col>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={3} className="text-md-right text-center">
                                    <p className="font-weight-bold">${item.price}</p>
                                    <Button variant="link" onClick={() => handleRemoveItem(item.id)}>
                                        <i className="bi bi-trash"></i> Remove
                                    </Button>
                                </Col>
                            </Row>
                        ))
                    )}
                </Col>
                <Col xs={12} md={4} className="summary mt-4 mt-md-0">
                    <h4>Summary</h4>
                    <Row className="mb-2">
                        <Col>Subtotal:</Col>
                        <Col className="text-right">${calculateTotal()}</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>Estimated Shipping & Handling:</Col>
                        <Col className="text-right">$8.00</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col>Estimated Tax:</Col>
                        <Col className="text-right">$0.00</Col>
                    </Row>
                    <hr />
                    <Row className="mb-4">
                        <Col>Total:</Col>
                        <Col className="text-right font-weight-bold">${calculateTotal() + 8.00}</Col>
                    </Row>
                    <Button variant="dark" className="w-100 mb-3" onClick={handleCheckout}>Checkout</Button>
                    <Button variant="outline-dark" className="w-100">PayPal</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;
