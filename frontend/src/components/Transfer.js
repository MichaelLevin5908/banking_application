import React, { useState } from 'react';
import axios from 'axios';

const Transfer = () => {
    const [sourceAccountNumber, setSourceAccountNumber] = useState('');  // Source Account
    const [destinationAccountNumber, setDestinationAccountNumber] = useState('');  // Destination Account
    const [amount, setAmount] = useState('');  // Amount to Transfer
    const [resultMessage, setResultMessage] = useState('');  // Success Message
    const [errorMessage, setErrorMessage] = useState('');  // Error Message

    // Handle fund transfer
    const handleTransfer = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8080/api/transfer`,
                {
                    sourceAccountNumber,
                    destinationAccountNumber,
                    amount: parseFloat(amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setResultMessage(`Transfer of $${amount} successful!`);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Transfer failed. Please try again.');
            setResultMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Transfer Funds</h2>

            {/* Display success or error messages */}
            {resultMessage && <div className="alert alert-success">{resultMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Fund Transfer Form */}
            <form onSubmit={handleTransfer}>
                <div className="form-group">
                    <label htmlFor="sourceAccountNumber">Source Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="sourceAccountNumber"
                        value={sourceAccountNumber}
                        onChange={(e) => setSourceAccountNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="destinationAccountNumber">Destination Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="destinationAccountNumber"
                        value={destinationAccountNumber}
                        onChange={(e) => setDestinationAccountNumber(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                    Transfer
                </button>
            </form>
        </div>
    );
};

export default Transfer;
