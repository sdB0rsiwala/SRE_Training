import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../styles/ProductCard.css'; // Import custom CSS for styling

const ProductCard = ({ id,image, name, price }) => {
    return (
        <Link to={`/product-detail-page/${id}`} className="product-card-link">
            <Card className="product-card">
                <div className="card-image-section">
                    <Card.Img variant="top" src={image} />
                </div>
                <Card.Body className="card-text-section">
                    <Card.Title className="product-name">{name}</Card.Title>
                    <Card.Text className="product-price">${price}</Card.Text>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default ProductCard;
