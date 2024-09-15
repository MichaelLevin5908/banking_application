import React, { useState } from 'react';
import axios from 'axios';
import '../Style/signup.css';
import { Link } from "react-router-dom";

const SignUp = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [stateOfOrigin, setStateOfOrigin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages and set loading state
        setErrorMessage('');
        setSuccessMessage('');
        setLoading(true);

        // Password validation
        if (password !== confirmPassword) {
            setLoading(false);
            setErrorMessage('Passwords do not match!');
            return;
        }

        // Optional: Add other field validations if necessary
        if (!validateEmail(email)) {
            setLoading(false);
            setErrorMessage('Invalid email address.');
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/user/createAccount', {
                firstName,
                lastName,
                email,
                password,
                gender,
                address,
                phoneNumber,
                stateOfOrigin,
            });

            // If successful, set success message and reset form fields
            setSuccessMessage('Account created successfully! You can now sign in.');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setGender('');
            setAddress('');
            setPhoneNumber('');
            setStateOfOrigin('');

            // Optionally, redirect to sign-in after 2 seconds
            setTimeout(() => {
                window.location.href = '/signin';
            }, 2000);

        } catch (error) {
            // Handle error response
            setErrorMessage('Account creation failed. Please try again.');
        } finally {
            // Turn off the loading state
            setLoading(false);
        }
    };

    // Optional: Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
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
                <div>
                    <label>Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                </div>
                <div>
                    <label>Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>State of Origin</label>
                    <input
                        type="text"
                        value={stateOfOrigin}
                        onChange={(e) => setStateOfOrigin(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
    );
};

export default SignUp;


