import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Assuming you want to reuse the same CSS styles

const SignUp = () => {
    const [firstName, setFirstName] = useState('');  // First name
    const [lastName, setLastName] = useState('');  // Last name
    const [email, setEmail] = useState('');  // Email address
    const [password, setPassword] = useState('');  // Password
    const [confirmPassword, setConfirmPassword] = useState('');  // Confirm Password
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/signup', {
                firstName,
                lastName,
                email,
                password,
            });

            // Display success message and clear form
            setSuccessMessage('Account created successfully! You can now sign in.');
            setErrorMessage('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Optionally, redirect to the sign-in page
            setTimeout(() => {
                window.location.href = '/signin';
            }, 2000);  // Redirect after 2 seconds
        } catch (error) {
            setErrorMessage('Account creation failed. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <h2>Create Account</h2>
            {errorMessage && <p className="error">{errorMessage}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
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
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default SignUp;
