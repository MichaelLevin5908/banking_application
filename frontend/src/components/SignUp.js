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
    const [gender, setGender] = useState(''); // Added gender field
    const [address, setAddress] = useState(''); // Added address field
    const [phoneNumber, setPhoneNumber] = useState(''); // Added phoneNumber field
    const [stateOfOrigin, setStateOfOrigin] = useState(''); // Added state of origin field
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user/createaccount', {
                firstName,
                lastName,
                email,
                password,
                gender,
                address,
                phoneNumber,
                stateOfOrigin,
            });

            setSuccessMessage('Account created successfully! You can now sign in.');
            setErrorMessage('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setGender(''); // Reset gender
            setAddress(''); // Reset address
            setPhoneNumber(''); // Reset phoneNumber
            setStateOfOrigin(''); // Reset stateOfOrigin

            setTimeout(() => {
                window.location.href = '/signin';
            }, 2000);
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
                {/* New input fields for gender, address, phone number, etc. */}
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

                <button type="submit">Create Account</button>
            </form>
            <p>Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
    );
};

export default SignUp;

