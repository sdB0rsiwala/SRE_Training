import React from 'react';
import { Modal, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import '../styles/AddToBagModal.css'; // Import custom styles

const AddToBagModal = ({ show, onHide, product, cartItemCount }) => {
    // Convert product.price to a number if it's not already
    const price = parseFloat(product.price);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleViewCart = () => {
        navigate('/cart'); // Navigate to /cart page
    };

    return (
        <Modal show={show} onHide={onHide} centered className="add-to-bag-modal">
            <Modal.Header closeButton>
                <Modal.Title>Item Added to Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <h5 className="mt-3">
                         <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '20px', color: 'green' }} /> 
                         { ' ' }
                         Successfully added to cart
                    </h5>
                    <div className="d-flex align-items-center justify-content-center mt-3">
                        <Image src={product.image} alt={product.name} rounded style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                        <div className="ms-3">
                            <p><strong>{product.name}</strong></p>
                            <p>${price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={handleViewCart}>
                    View Cart ({cartItemCount})
                </Button>
                <Button variant="primary" onClick={onHide}>
                    Checkout
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddToBagModal;
