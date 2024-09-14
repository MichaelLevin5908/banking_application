import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link component
import './App.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                email,
                password
            });

            // Store the token in localStorage (or in HttpOnly cookies)
            localStorage.setItem('token', response.data.token);

            // Redirect to another page (e.g., dashboard)
            window.location.href = '/dashboard';
        } catch (error) {
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Create an account</Link></p>
        </div>
    );
};

export default SignIn;

