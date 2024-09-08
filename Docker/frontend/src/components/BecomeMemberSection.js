import React from 'react';
import '../styles/BecomeMemberSection.css'; // Import custom styles

const BecomeMemberSection = () => {
    return (
        <div className="become-member-container">
            <div className="become-member-card">
                <img src="https://cdn.doordash.com/media/consumer/home/landing/new/ScootScoot.svg" alt="Become a Dasher" />
                <h2>Become DeliveryPerson</h2>
                <h3>As a delivery driver, make money and work on your schedule. Sign up in minutes.</h3>
                <button className="cta-button">Start earning</button>
            </div>
            <div className="become-member-card">
                <img src="https://cdn.doordash.com/media/consumer/home/landing/new/Storefront.svg" alt="Become a Merchant" />
                <h2>Become a Merchant</h2>
                <h3>Attract new customers and grow sales, starting with 0% commissions for up to 30 days.</h3>
                <button className="cta-button">Sign up</button>
            </div>
            
        </div>
    );
};

export default BecomeMemberSection;
