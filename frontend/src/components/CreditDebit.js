import React, { useState } from 'react';
import axios from 'axios';
import '../Style/Creditdebit.css';

const CreditDebit = () => {
    const [accountNumber, setAccountNumber] = useState('');  // Account Number
    const [amount, setAmount] = useState('');  // Transaction Amount
    const [transactionType, setTransactionType] = useState('credit');  // Credit/Debit Selection
    const [startDate, setStartDate] = useState('');  // Start Date for Bank Statement
    const [endDate, setEndDate] = useState('');  // End Date for Bank Statement
    const [resultMessage, setResultMessage] = useState('');  // Success Message
    const [errorMessage, setErrorMessage] = useState('');  // Error Message

    // Handle form submission for credit and debit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setResultMessage('');
        setErrorMessage('');

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
            setAmount('');  // Clear amount input after successful transaction
        } catch (error) {
            setErrorMessage('Transaction failed. Please try again.');
        }
    };

    // Function to request a bank statement
    const generateStatement = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!accountNumber || !startDate || !endDate) {
            setErrorMessage('Please provide account number, start date, and end date.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/transactions/bankstatement`, {
                params: {
                    accountNumber,
                    startDate,
                    endDate,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                responseType: 'blob',  // Get the PDF file as a blob
            });

            // Create a URL for the blob and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'BankStatement.pdf');  // Define the file name
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setErrorMessage('Failed to generate bank statement. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Credit / Debit Account</h2>

            {/* Display success or error messages */}
            {resultMessage && <div className="alert alert-success">{resultMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Credit/Debit Form */}
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

            <hr />

            {/* Generate Bank Statement Form */}
            <h3 className="text-center mt-4">Generate Bank Statement</h3>

            <form onSubmit={generateStatement}>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        className="form-control"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-info btn-block">
                    Generate Statement
                </button>
            </form>
        </div>
    );
};

export default CreditDebit;


