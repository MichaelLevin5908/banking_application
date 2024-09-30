// src/components/SignIn.js
import React, { useState } from 'react';
import api from '../services/api'; // Use consistent import name
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../Style/signin.css';
import bankingLogo from '../Style/images/bankingapp.png';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/user/login', {
                email,
                password
            });

            console.log('Login Response:', response.data); // Debugging line

            if (response.data && response.data.token && response.data.accountInfo) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('accountNumber', response.data.accountInfo.accountNumber);
                // Optionally, store other accountInfo details
                // localStorage.setItem('accountName', response.data.accountInfo.accountName);
                // localStorage.setItem('accountBalance', response.data.accountInfo.accountBalance);

                navigate(from, { replace: true });
            } else {
                setErrorMessage('Authentication token or account information not provided by server.');
            }
        } catch (error) {
            console.error('Login error:', error);

            if (error.response) {
                if (error.response.status === 404) {
                    setErrorMessage('Account does not exist. Please sign up first.');
                } else if (error.response.status === 401) {
                    setErrorMessage('Invalid email or password.');
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
            } else if (error.request) {
                setErrorMessage('No response from server. Please try again later.');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="signin-container">
            {/* Add the logo image */}
            <img src={bankingLogo} alt="Banking App Logo" className="signin-logo" />

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