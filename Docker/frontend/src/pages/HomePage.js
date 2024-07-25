import React from 'react';
import { useLocation } from 'react-router-dom';

export default function HomePage() {
    const location = useLocation();
    const message = location.state?.message || 'Welcome to the Home Page!';

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}
