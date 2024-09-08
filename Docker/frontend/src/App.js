import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

// Pages
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import HomePage from "./components/HomePage";
import ProductPage from './components/ProductPage';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import Navbar from './components/Navbar';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/cartPage';
import CheckoutPage from './components/Checkoutpage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> 
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product-detail-page/:id" element={<ProductDetailPage/>} />
            <Route path="/cart" element={<CartPage/>} />
            <Route path="/checkout" element={<CheckoutPage/>}/>
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
