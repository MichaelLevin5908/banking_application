import React, { useState } from 'react';
import axios from 'axios';
import '../Style/transfer.css'; // Ensure you import the CSS file
import { Spinner } from 'react-bootstrap';
import api from "../services/api"; // Optional: Using Bootstrap's Spinner

const Transfer = () => {
    const [sourceAccountNumber, setSourceAccountNumber] = useState('');
    const [destinationAccountNumber, setDestinationAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Validate account number format (exactly 9 digits)
    const validateAccountNumber = (number) => /^\d{9}$/.test(number);

    // Handle fund transfer
    const handleTransfer = async (e) => {
        e.preventDefault();

        // Reset messages
        setResultMessage('');
        setErrorMessage('');

        // Basic validation
        if (!validateAccountNumber(sourceAccountNumber)) {
            setErrorMessage('Source account number must be exactly 9 digits.');
            return;
        }
        if (!validateAccountNumber(destinationAccountNumber)) {
            setErrorMessage('Destination account number must be exactly 9 digits.');
            return;
        }
        if (parseFloat(amount) <= 0) {
            setErrorMessage('Amount must be greater than zero.');
            return;
        }

        setIsLoading(true); // Start loading

        try {
            const response = await  api.post(
                `/user/transfer`,
                {
                    sourceAccountNumber,
                    destinationAccountNumber,
                    amount: parseFloat(amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Assuming the response contains a success message
            setResultMessage(`Transfer of $${amount} successful!`);
            setErrorMessage('');
            // Optionally, reset form fields
            setSourceAccountNumber('');
            setDestinationAccountNumber('');
            setAmount('');
        } catch (error) {
            // Handle different error responses
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(`Transfer failed: ${error.response.data.message}`);
            } else {
                setErrorMessage('Transfer failed. Please try again.');
            }
            setResultMessage('');
        } finally {
            setIsLoading(false); // End loading
        }
    };

    return (
        <div className="transfer-container">
            <h2 className="transfer-heading">Transfer Funds</h2>

            {/* Display success or error messages */}
            {resultMessage && <div className="alert alert-success" role="alert">{resultMessage}</div>}
            {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}

            {/* Fund Transfer Form */}
            <form onSubmit={handleTransfer} className="transfer-form">
                <div className="form-group">
                    <label htmlFor="sourceAccountNumber">Source Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="sourceAccountNumber"
                        value={sourceAccountNumber}
                        onChange={(e) => setSourceAccountNumber(e.target.value)}
                        required
                        aria-describedby="sourceAccountHelp"
                        placeholder="Enter 9-digit account number"
                        maxLength="9"
                    />
                    <small id="sourceAccountHelp" className="form-text text-muted">
                        Your 9-digit source account number.
                    </small>
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
                        aria-describedby="destinationAccountHelp"
                        placeholder="Enter 9-digit account number"
                        maxLength="9"
                    />
                    <small id="destinationAccountHelp" className="form-text text-muted">
                        The 9-digit account number to receive funds.
                    </small>
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
                        min="0.01"
                        step="0.01"
                        placeholder="Enter amount to transfer"
                    />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />{' '}
                            Transferring...
                        </>
                    ) : (
                        'Transfer'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Transfer;
