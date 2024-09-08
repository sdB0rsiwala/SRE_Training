import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Navbar from './Navbar';
import { useAuth } from './AuthContext'; // Importing useAuth hook to get user data
import '../styles/Checkoutpage.css'; // Custom styles


const CheckoutPage = () => {
    const { user, isLoggedIn } = useAuth(); // Accessing user data and login status
    const [cartItems, setCartItems] = useState([]);
    const [option, setOption] = useState('delivery'); // Default to 'delivery'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        phone: '',
        store: '' // For pickup option
    });



    useEffect(() => {
        // Retrieve cart items from localStorage
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);

        // Pre-fill the form with user data if logged in
        if (isLoggedIn && user) {
            setFormData({
                ...formData,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
                phone: user.phone_number || ''
            });
        }
    }, [isLoggedIn, user]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOptionChange = (selectedOption) => {
        setOption(selectedOption);
    };

    return (
        <Container fluid>
            <Navbar />
            <h2 className="mt-4">Checkout</h2>
            <Row className="mt-4">
                <Col xs={12} md={8}>
                    <h4>Select Pickup or Delivery</h4>
                    <div className="d-flex justify-content-between mb-4">
                        <Button 
                            variant={option === 'delivery' ? 'dark' : 'outline-dark'} 
                            onClick={() => handleOptionChange('delivery')}
                            className="option-button"
                        >
                            Delivery
                        </Button>
                        <Button 
                            variant={option === 'pickup' ? 'dark' : 'outline-dark'} 
                            onClick={() => handleOptionChange('pickup')}
                            className="option-button"
                        >
                            Pickup
                        </Button>
                    </div>

                    {option === 'delivery' ? (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formFirstName" className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formLastName" className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="formAddress" className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="address" 
                                    value={formData.address} 
                                    onChange={handleInputChange}
                                    required 
                                />
                            </Form.Group>
                            <Row>
                                <Col md={4}>
                                    <Form.Group controlId="formCity" className="mb-3">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="city" 
                                            value={formData.city} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="formState" className="mb-3">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="state" 
                                            value={formData.state} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="formZipCode" className="mb-3">
                                        <Form.Label>Zip Code</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="zipCode" 
                                            value={formData.zipCode} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="formEmail" className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formPhone" className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control 
                                            type="text" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    ) : (
                        <Form.Group controlId="formStore" className="mb-3">
                            <Form.Label>Pick a Store</Form.Label>
                            <Form.Control 
                                as="select" 
                                name="store" 
                                value={formData.store} 
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Store</option>
                                <option value="store1">Store 1</option>
                                <option value="store2">Store 2</option>
                                <option value="store3">Store 3</option>
                            </Form.Control>
                        </Form.Group>
                    )}
                </Col>
                <Col xs={12} md={4} className="summary mt-4 mt-md-0">
                    <h4>Order Summary</h4>
                    {cartItems.map((item, index) => (
                        <Row key={index} className="mb-2">
                            <Col>{item.name} (x{item.quantity})</Col>
                            <Col className="text-right">${item.price * item.quantity}</Col>
                        </Row>
                    ))}
                    <hr />
                    <Row className="mb-2">
                        <Col>Subtotal:</Col>
                        <Col className="text-right">${calculateTotal()}</Col>
                    </Row>
                    {option === 'delivery' && (
                        <Row className="mb-2">
                            <Col>Shipping & Handling:</Col>
                            <Col className="text-right">$8.00</Col>
                        </Row>
                    )}
                    <Row className="mb-2">
                        <Col>Tax:</Col>
                        <Col className="text-right">$0.00</Col>
                    </Row>
                    <hr />
                    <Row className="mb-4">
                        <Col>Total:</Col>
                        <Col className="text-right font-weight-bold">
                            ${calculateTotal() + (option === 'delivery' ? 8.00 : 0)}
                        </Col>
                    </Row>
                    <Button variant="dark" className="w-100 mb-3">Place Order</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;
