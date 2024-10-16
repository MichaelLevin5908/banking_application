// src/components/CreditDebit.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import api from '../services/api'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import '../Style/Creditdebit.css'; // Your custom CSS

const CreditDebit = () => {
    // State for Credit/Debit Form
    const [creditDebitAccountNumber, setCreditDebitAccountNumber] = useState('');
    const [creditDebitAmount, setCreditDebitAmount] = useState('');
    const [transactionType, setTransactionType] = useState('credit');

    // State for Generate Statement Form
    const [statementAccountNumber, setStatementAccountNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // State for Messages
    const [resultMessage, setResultMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Optional loading state

    // Handle Credit/Debit Form Submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!creditDebitAccountNumber || !creditDebitAmount) {
            return showError('Please provide all required details for the transaction.');
        }

        setIsLoading(true);
        try {
            const response = await api.post(
                `/user/${transactionType}`,
                {
                    accountNumber: creditDebitAccountNumber,
                    amount: parseFloat(creditDebitAmount)
                }
            );
            showSuccess(response.data.responseMessage || `${transactionType.toUpperCase()} successful!`);
            // Reset Credit/Debit Form
            setCreditDebitAccountNumber('');
            setCreditDebitAmount('');
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Generate Statement Form Submission
    const generateStatement = async (event) => {
        event.preventDefault();
        if (!statementAccountNumber || !startDate || !endDate) {
            return showError('Please provide account number, start date, and end date for the statement.');
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/bankStatement`, {
                params: {
                    accountNumber: statementAccountNumber,
                    startDate,
                    endDate
                },
            });

            if (response.status === 200) {
                showSuccess('Statement generated and emailed successfully!');
                // Reset Generate Statement Form
                setStatementAccountNumber('');
                setStartDate('');
                setEndDate('');
            } else {
                showError('Failed to generate statement.');
            }
        } catch (error) {
            console.error("Error generating statement:", error);
            if (error.response && error.response.data) {
                // Extract 'message' from the error response
                const errorMsg = error.response.data.message || error.response.data.error || 'An error occurred.';
                showError(errorMsg);
            } else {
                showError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Errors
    const handleError = (error) => {
        let message = 'An error occurred. Please try again.';
        if (error.response && error.response.data) {
            // Ensure only a string message is set
            const errorMsg = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
            message = errorMsg;
        }
        showError(message);
    };

    // Display Error Message
    const showError = (message) => {
        setErrorMessage(message);
        setResultMessage('');
    };

    // Display Success Message
    const showSuccess = (message) => {
        setResultMessage(message);
        setErrorMessage('');
    };

    return (
        <div className="container mt-5">
            {/* Credit/Debit Form */}
            <h2 className="mb-4">Credit / Debit Account</h2>
            <Form onSubmit={handleSubmit}>
                {resultMessage && <div className="alert alert-success text-center">{resultMessage}</div>}
                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

                <div className="form-group">
                    <label htmlFor="creditDebitAccountNumber">Account Number (Credit/Debit)</label>
                    <input
                        type="text"
                        name="creditDebitAccountNumber"
                        value={creditDebitAccountNumber}
                        onChange={(e) => setCreditDebitAccountNumber(e.target.value)}
                        className="form-control"
                        placeholder="Enter Account Number for Credit/Debit"
                        required
                    />
                    <small className="form-text text-muted">
                        Please enter your 10-digit account number associated with your banking account.
                    </small>
                </div>

                <div className="form-group">
                    <label htmlFor="creditDebitAmount">Amount</label>
                    <input
                        type="number"
                        name="creditDebitAmount"
                        value={creditDebitAmount}
                        onChange={(e) => setCreditDebitAmount(e.target.value)}
                        className="form-control"
                        placeholder="Enter Amount"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="transactionType">Transaction Type</label>
                    <select
                        name="transactionType"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        className="form-control"
                    >
                        <option value="credit">Credit</option>
                        <option value="debit">Debit</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Submit Transaction'}
                </button>
            </Form>

            <hr className="my-5" />

            {/* Generate Statement Form */}
            <h2 className="mb-4">Email Bank Statement</h2>
            <Form onSubmit={generateStatement}>
                <div className="form-group">
                    <label htmlFor="statementAccountNumber">Account Number (Statement)</label>
                    <input
                        type="text"
                        name="statementAccountNumber"
                        value={statementAccountNumber}
                        onChange={(e) => setStatementAccountNumber(e.target.value)}
                        className="form-control"
                        placeholder="Enter Account Number for Statement"
                        required
                    />
                    <small className="form-text text-muted">
                        Please enter your 10-digit account number to generate your statement.
                    </small>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-control"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-info btn-block" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Statement'}
                </button>
            </Form>
        </div>
    );
};

export default CreditDebit;