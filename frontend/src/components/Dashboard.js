import React, { Component } from 'react';
import axios from 'axios';
import '../Style/dashboard.css';

export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountBalance: null,   // Similar to useState(null)
            errorMessage: '',       // Similar to useState('')
        };
    }

    // Lifecycle method to handle data fetching when the component mounts
    componentDidMount() {
        this.fetchBalance();
    }

    fetchBalance = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/balanceEnquiry', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Update the account balance in the state
            this.setState({ accountBalance: parseFloat(response.data.accountBalance) });
        } catch (error) {
            // Update the error message in case of an error
            this.setState({ errorMessage: 'Failed to fetch account balance.' });
        }
    };

    formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(balance);
    };

    render() {
        const { accountBalance, errorMessage } = this.state;

        return (
            <div className="container mt-5">
                <h1>Welcome to your Dashboard!</h1>
                <p>Only authenticated users can see this page.</p>

                {/* Display account balance */}
                {accountBalance !== null ? (
                    <div className="alert alert-info">
                        <h4>Your Current Account Balance:</h4>
                        <p>{this.formatBalance(accountBalance)}</p>
                    </div>
                ) : (
                    <div className="alert alert-warning">Fetching account balance...</div>
                )}

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <hr />
            </div>
        );
    }
}