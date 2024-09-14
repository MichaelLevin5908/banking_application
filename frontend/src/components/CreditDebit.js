import React, { useState } from 'react';
import axios from 'axios';

const CreditDebit = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('credit');
    const [resultMessage, setResultMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form submission for credit and debit
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `http://localhost:8080/api/transactions/${transactionType}`,
                {
                    accountNumber,
                    amount: parseFloat(amount),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            setResultMessage(`${transactionType.toUpperCase()} successful!`);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Transaction failed. Please try again.');
            setResultMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Credit / Debit Account</h2>

            {resultMessage && <div className="alert alert-success">{resultMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="accountNumber">Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
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

                <div className="form-group">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <select
                        id="transactionType"
                        className="form-control"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                    Submit Transaction
                </button>
            </form>
        </div>
    );
};

export default CreditDebit;
