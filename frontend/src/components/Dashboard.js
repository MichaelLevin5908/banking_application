// src/components/Dashboard.js
import React, { Component } from 'react';
import api from '../services/api'; // Axios instance with interceptors
import '../Style/dashboard.css';
import CreditDebit from './CreditDebit';
import Transfer from './Transfer';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountBalance: null,
            errorMessage: '',
            loading: true, // Track loading state
            currentView: 'balance', // New state to track the current view
        };
    }

    componentDidMount() {
        this.fetchBalance();
    }

    fetchBalance = async () => {
        const accountNumber = localStorage.getItem('accountNumber');

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

            const accountInfo = response.data.accountInfo || response.data.accountinfo;
            if (accountInfo && accountInfo.accountBalance !== undefined) {
                this.setState({
                    accountBalance: parseFloat(accountInfo.accountBalance),
                    loading: false,
                });
            } else {
                this.setState({
                    errorMessage: 'Account information is missing in the response.',
                    loading: false,
                });
            }
        } catch (error) {
            let message = 'Failed to fetch account balance.';
            if (error.response) {
                message += ` ${error.response.status}: ${error.response.data.message || error.response.statusText}`;
            } else if (error.request) {
                message += ' No response from server.';
            } else {
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

    // Method to set the current view
    setView = (view) => {
        this.setState({ currentView: view });
    };

    render() {
        const { accountBalance, errorMessage, loading, currentView } = this.state;

        return (
            <div className="container mt-5">
                <h1>Welcome to your Dashboard!</h1>
                <p>Only authenticated users can see this page.</p>

                // Navigation Buttons
                <div className="btn-group mb-3" role="group">
                    <button
                        type="button"
                        className={`btn btn-primary ${currentView === 'balance' ? 'active' : ''}`}
                        onClick={() => this.setView('balance')}
                    >
                        Balance
                    </button>
                    <button
                        type="button"
                        className={`btn btn-primary ${currentView === 'creditDebit' ? 'active' : ''}`}
                        onClick={() => this.setView('creditDebit')}
                    >
                        Credit/Debit
                    </button>
                    <button
                        type="button"
                        className={`btn btn-primary ${currentView === 'transfer' ? 'active' : ''}`}
                        onClick={() => this.setView('transfer')}
                    >
                        Transfer
                    </button>
                </div>


                {/* Display account balance */}
                {currentView === 'balance' && (
                    <>
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
                    </>
                )}

                {/* Render CreditDebit Component */}
                {currentView === 'creditDebit' && (
                    <CreditDebit accountNumber={localStorage.getItem('accountNumber')} />
                )}

                {/* Render Transfer Component */}
                {currentView === 'transfer' && (
                    <Transfer sourceAccountNumber={localStorage.getItem('accountNumber')} />
                )}

                <hr />
            </div>
        );
    }
}