import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axiosInstance from './axiosConfig';
import ProductCard from './ProductCard';
import Navbar from './Navbar';

const ProductPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from backend API
        axiosInstance.get('api/products/')
            .then(response => {
                setProducts(response.data);
                console.log(products);
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
            });
    }, []);

    return (
        <Container>
            <Navbar />
            <h1 className="my-4">Products</h1>
            <Row className="no-gutters">
                {products.map(product => (
                    <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="p-0 mb-4">
                        <ProductCard
                            id={product.id}
                            image={product.image}
                            name={product.name}
                            price={product.price}
                        />
                    </Col>
                ))}
            </Row>

        </Container>
    );
};

export default ProductPage;
