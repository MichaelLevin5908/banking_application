// src/components/Dashboard.js
import React, { Component } from 'react';
import api from '../services/api'; // Axios instance with interceptors
import CreditDebit from './CreditDebit';
import Transfer from './Transfer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Style/dashboard.css';
import { FaMoneyBillWave, FaExchangeAlt, FaBalanceScale } from 'react-icons/fa'; // Importing icons for better visuals

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountBalance: null,
            errorMessage: '',
            loading: true, // Track loading state
            currentView: 'balance', // New state to track the current view
            accountNumber: localStorage.getItem('accountNumber') || '', // Store account number in state
        };
    }

    componentDidMount() {
        this.fetchBalance();
    }

    fetchBalance = async () => {
        const { accountNumber } = this.state;

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
        const { accountBalance, errorMessage, loading, currentView, accountNumber } = this.state;

        return (
            <div className="container dashboard-container">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h1 className="display-4">Your Dashboard</h1>
                    <p className="lead text-muted">Manage your account efficiently and securely.</p>
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-center mb-4">
                    <button
                        type="button"
                        className={`btn btn-outline-primary m-2 ${currentView === 'balance' ? 'active' : ''}`}
                        onClick={() => this.setView('balance')}
                    >
                        <FaBalanceScale className="me-2" />
                        Balance
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary m-2 ${currentView === 'creditDebit' ? 'active' : ''}`}
                        onClick={() => this.setView('creditDebit')}
                    >
                        <FaMoneyBillWave className="me-2" />
                        Credit/Debit
                    </button>
                    <button
                        type="button"
                        className={`btn btn-outline-primary m-2 ${currentView === 'transfer' ? 'active' : ''}`}
                        onClick={() => this.setView('transfer')}
                    >
                        <FaExchangeAlt className="me-2" />
                        Transfer
                    </button>
                </div>

                {/* Content Section */}
                <div className="content-section">
                    {/* Display account balance and account number */}
                    {currentView === 'balance' && (
                        <div className="row justify-content-center">
                            <div className="col-lg-6 col-md-8">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title text-center mb-4">Account Details</h5>
                                        {loading ? (
                                            <div className="alert alert-warning text-center">Fetching account balance...</div>
                                        ) : accountBalance !== null ? (
                                            <>
                                                <p className="card-text">
                                                    <strong>Account Number:</strong> {accountNumber}
                                                </p>
                                                <p className="card-text">
                                                    <strong>Current Balance:</strong> {this.formatBalance(accountBalance)}
                                                </p>
                                            </>
                                        ) : null}

                                        {/* Display error message */}
                                        {errorMessage && <div className="alert alert-danger mt-3 text-center">{errorMessage}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Render CreditDebit Component */}
                    {currentView === 'creditDebit' && (
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-md-10">
                                <CreditDebit accountNumber={accountNumber} />
                            </div>
                        </div>
                    )}

                    {/* Render Transfer Component */}
                    {currentView === 'transfer' && (
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-md-10">
                                <Transfer sourceAccountNumber={accountNumber} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="text-center mt-5">
                    <hr />
                    <p className="text-muted">&copy; {new Date().getFullYear()} PeerPay. All rights reserved.</p>
                </footer>
            </div>
        );
    }
}
