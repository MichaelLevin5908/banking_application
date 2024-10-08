import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import api from '../services/api';  // Import your Axios instance
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../Style/Creditdebit.css';  // Import the refined CSS

export default class CreditDebit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountNumber: '',
            amount: '',
            transactionType: 'credit',
            startDate: '',
            endDate: '',
            resultMessage: '',
            errorMessage: ''
        };
    }

    // Handle form input changes
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Handle form submission for credit/debit
    handleSubmit = async (event) => {
        event.preventDefault();
        const { accountNumber, amount, transactionType } = this.state;

        if (!accountNumber || !amount) {
            return this.showError('Please provide all required details.');
        }

        try {
            const response = await api.post(
                `/user/${transactionType}`,
                { accountNumber, amount: parseFloat(amount) }
            );
            this.showSuccess(response.data.responseMessage || `${transactionType.toUpperCase()} successful!`);
        } catch (error) {
            this.handleError(error);
        }
    }

    generateStatement = async (event) => {
        event.preventDefault();
        const { accountNumber, startDate, endDate } = this.state;

        if (!accountNumber || !startDate || !endDate) {
            return this.showError('Please provide account number, start date, and end date.');
        }

        try {
            const response = await api.get(`/bankStatement`, {
                params: { accountNumber, startDate, endDate },
            });
            this.showSuccess(response.data); // Use the message returned from the backend
        } catch (error) {
            this.handleError(error);
        }
    }

    // Function to handle errors
    handleError = (error) => {
        let message = 'An error occurred. Please try again.';
        if (error.response && error.response.data) {
            message = error.response.data;
        }
        this.showError(message);
    }

    // Display error message
    showError = (message) => {
        this.setState({ errorMessage: message, resultMessage: '' });
    }

    // Display success message
    showSuccess = (message) => {
        this.setState({ resultMessage: message, errorMessage: '' });
    }

    render() {
        const { accountNumber, amount, transactionType, startDate, endDate, resultMessage, errorMessage } = this.state;

        return (
            <div className="container mt-5">
                <h2>Credit / Debit Account</h2>
                <Form onSubmit={this.handleSubmit}>
                    {resultMessage && <div className="alert alert-success text-center">{resultMessage}</div>}
                    {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={accountNumber}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter Account Number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={amount}
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
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
                <Form onSubmit={this.generateStatement}>
                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={accountNumber}
                            onChange={this.handleChange}
                            className="form-control"
                            placeholder="Enter Account Number"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="startDate">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={startDate}
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-info btn-block">Generate Statement</button>
                </Form>
            </div>
        );
    }
}