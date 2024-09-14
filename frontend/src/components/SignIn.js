import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', {
                username,
                password
            });

            // Store the token in localStorage (or in HttpOnly cookies)
            localStorage.setItem('token', response.data.token);

            // Redirect to another page (e.g., dashboard)
            window.location.href = '/dashboard';
        } catch (error) {
            setErrorMessage('Invalid username or password');
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
        </div>
    );
};

export default SignIn;
