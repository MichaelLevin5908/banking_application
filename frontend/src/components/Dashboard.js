import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const [accountBalance, setAccountBalance] = useState(null); // Default to null
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/User/accountBalance', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                setAccountBalance(parseFloat(response.data.accountBalance));
            } catch (error) {
                setErrorMessage('Failed to fetch account balance.');
            }
        };

        fetchBalance();
    }, []);

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(balance);
    };

    return (
        <div className="container mt-5">
            <h1>Welcome to your Dashboard!</h1>
            <p>Only authenticated users can see this page.</p>

            {/* Display account balance */}
            {accountBalance !== null ? (
                <div className="alert alert-info">
                    <h4>Your Current Account Balance:</h4>
                    <p>{formatBalance(accountBalance)}</p>
                </div>
            ) : (
                <div className="alert alert-warning">Fetching account balance...</div>
            )}

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <hr />
        </div>
    );
};

export default Dashboard;


