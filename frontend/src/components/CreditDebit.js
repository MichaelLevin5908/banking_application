import React, { Component } from 'react';
import { Form } from 'react-bootstrap';  // Importing Form from react-bootstrap
import axios from 'axios';

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

        this.handleSubmit = this.handleSubmit.bind(this);
        this.generateStatement = this.generateStatement.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Handle input changes
    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    // Handle form submission for credit and debit
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({ resultMessage: '', errorMessage: '' });

        const { accountNumber, amount, transactionType } = this.state;

        try {
            await axios.post(
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

            this.setState({ resultMessage: `${transactionType.toUpperCase()} successful!`, amount: '' });
        } catch (error) {
            this.setState({ errorMessage: 'Transaction failed. Please try again.' });
        }
    }

    // Function to request a bank statement
    async generateStatement(event) {
        event.preventDefault();
        const { accountNumber, startDate, endDate } = this.state;
        this.setState({ errorMessage: '' });

        if (!accountNumber || !startDate || !endDate) {
            this.setState({ errorMessage: 'Please provide account number, start date, and end date.' });
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
                responseType: 'blob',
            });

            // Create a URL for the blob and trigger a download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'BankStatement.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            this.setState({ errorMessage: 'Failed to generate bank statement. Please try again.' });
        }
    }

    render() {
        const { accountNumber, amount, transactionType, startDate, endDate, resultMessage, errorMessage } = this.state;

        return (
            <div className="border border-dark bg-dark text-white mt-5">
                <h2 className="text-center">Credit / Debit Account</h2>
                <Form onSubmit={this.handleSubmit}>  {/* Form is used here */}
                    <div>
                        {resultMessage && <div className="alert alert-success text-center">{resultMessage}</div>}
                        {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

                        <div className="mb-3">
                            <label htmlFor="accountNumber">Account Number</label>
                            <input
                                required
                                type="text"
                                name="accountNumber"
                                value={accountNumber}
                                onChange={this.handleChange}
                                className="bg-dark text-white form-control"
                                placeholder="Enter Account Number"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="amount">Amount</label>
                            <input
                                required
                                type="number"
                                name="amount"
                                value={amount}
                                onChange={this.handleChange}
                                className="bg-dark text-white form-control"
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="transactionType">Transaction Type</label>
                            <select
                                name="transactionType"
                                value={transactionType}
                                onChange={this.handleChange}
                                className="bg-dark text-white form-control"
                            >
                                <option value="credit">Credit</option>
                                <option value="debit">Debit</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button type="submit" className="btn btn-success">Submit Transaction</button>
                    </div>
                </Form>

                <hr className="my-4" />

                <h2 className="text-center">Generate Bank Statement</h2>
                <Form onSubmit={this.generateStatement}>  {/* Form is used here */}
                    <div>
                        <div className="mb-3">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                required
                                type="date"
                                name="startDate"
                                value={startDate}
                                onChange={this.handleChange}
                                className="bg-dark text-white form-control"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                required
                                type="date"
                                name="endDate"
                                value={endDate}
                                onChange={this.handleChange}
                                className="bg-dark text-white form-control"
                            />
                        </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <button type="submit" className="btn btn-info">Generate Statement</button>
                    </div>
                </Form>
            </div>
        );
    }
}