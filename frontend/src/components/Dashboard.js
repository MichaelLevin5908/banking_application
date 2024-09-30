// src/components/Dashboard.js
import React, { Component } from 'react';
import api from '../services/api'; // Axios instance with interceptors
import '../Style/dashboard.css';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountBalance: null,
            errorMessage: '',
            loading: true, // Track loading state
        };
    }

    componentDidMount() {
        this.fetchBalance();
    }

    fetchBalance = async () => {
        const accountNumber = localStorage.getItem('accountNumber');

        console.log('Fetching balance for Account Number:', accountNumber);

        if (!accountNumber) {
            this.setState({ errorMessage: 'Account number not found.', loading: false });
            return;
        }

        try {
            const response = await api.post(
                '/user/balanceEnquiry',
                { accountNumber },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Balance Response:', response.data);

            // Correctly access accountInfo.accountBalance
            if (response.data.accountInfo && response.data.accountInfo.accountBalance) {
                this.setState({
                    accountBalance: parseFloat(response.data.accountInfo.accountBalance),
                    loading: false,
                });
            } else {
                this.setState({
                    errorMessage: 'Account information is missing in the response.',
                    loading: false,
                });
            }
        } catch (error) {
            console.error('Error fetching balance:', error);

            let message = 'Failed to fetch account balance.';
            if (error.response) {
                // Server responded with a status other than 2xx
                message += ` ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
            } else if (error.request) {
                // Request was made but no response received
                message += ' No response from server.';
            } else {
                // Something happened in setting up the request
                message += ` ${error.message}`;
            }

            this.setState({ errorMessage: message, loading: false });
        }
    };

    formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(balance);
    };

    render() {
        const { accountBalance, errorMessage, loading } = this.state;

        return (
            <div className="container mt-5">
                <h1>Welcome to your Dashboard!</h1>
                <p>Only authenticated users can see this page.</p>

                {/* Display account balance */}
                {loading ? (
                    <div className="alert alert-warning">Fetching account balance...</div>
                ) : accountBalance !== null ? (
                    <div className="alert alert-info">
                        <h4>Your Current Account Balance:</h4>
                        <p>{this.formatBalance(accountBalance)}</p>
                    </div>
                ) : null}

                {/* Display error message */}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <hr />
            </div>
        );
    }
}