import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import api from '../services/api';  // Import your Axios instance
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../Style/Creditdebit.css';  // Import the refined CSS

const CreditDebit = () => {
    const [creditDebitAccountNumber, setCreditDebitAccountNumber] = useState('');
    const [creditDebitAmount, setCreditDebitAmount] = useState('');
    const [transactionType, setTransactionType] = useState('credit');
    const [statementAccountNumber, setStatementAccountNumber] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!creditDebitAccountNumber || !creditDebitAmount) {
            return showError('Please provide all required details for the transaction.');
        }

        try {
            const response = await api.post(
                `/user/${transactionType}`,
                { accountNumber: creditDebitAccountNumber, amount: parseFloat(creditDebitAmount) }
            );
            showSuccess(response.data.responseMessage || `${transactionType.toUpperCase()} successful!`);
        } catch (error) {
            handleError(error);
        }
    };

    const generateStatement = async (event) => {
        event.preventDefault();
        if (!statementAccountNumber || !startDate || !endDate) {
            return showError('Please provide account number, start date, and end date for the statement.');
        }

        try {
            const response = await api.get(`/bankStatement`, {
                params: { accountNumber: statementAccountNumber, startDate, endDate },
            });
            showSuccess(response.data.message || 'Statement generated successfully!');
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        let message = 'An error occurred. Please try again.';
        if (error.response && error.response.data) {
            message = error.response.data;
        }
        showError(message);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setResultMessage('');
    };

    const showSuccess = (message) => {
        setResultMessage(message);
        setErrorMessage('');
    };

    return (
        <div className="container mt-5">
            <h2>Credit / Debit Account</h2>
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

                <button type="submit" className="btn btn-primary btn-block">Submit Transaction</button>
            </Form>

            <hr />

            <h2>Email Bank Statement</h2>
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
                </div>

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

                <button type="submit" className="btn btn-info btn-block">Generate Statement</button>
            </Form>
        </div>
    );
};

export default CreditDebit;