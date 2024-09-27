import React, { useState } from 'react';
import axios from '../services/api'; // Ensure this is your centralized Axios instance
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
            const response = await axios.post('/user/login', {
                email,
                password
            });

            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
            } else {
                setErrorMessage('Authentication token not provided by server.');
                return;
            }

            navigate(from, { replace: true });
        } catch (error) {
            setErrorMessage('Invalid email or password');
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


