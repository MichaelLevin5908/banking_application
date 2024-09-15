import React, { Component } from 'react';
import { Card, Form, Button, Col, Row, Alert } from 'react-bootstrap';
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
            <Card className="border border-dark bg-dark text-white mt-5">
                <Card.Header className="text-center">Credit / Debit Account</Card.Header>
                <Form onSubmit={this.handleSubmit}>
                    <Card.Body>
                        {resultMessage && <Alert variant="success" className="text-center">{resultMessage}</Alert>}
                        {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

                        <Row className="mb-3">
                            <Form.Label column={"sm"} sm={3}>Account Number</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    required
                                    type="text"
                                    name="accountNumber"
                                    value={accountNumber}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Enter Account Number"
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column={"sm"} sm={3}>Amount</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    required
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                    placeholder="Enter Amount"
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column={"sm"} sm={3}>Transaction Type</Form.Label>
                            <Col sm={9}>
                                <Form.Select
                                    name="transactionType"
                                    value={transactionType}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                >
                                    <option value="credit">Credit</option>
                                    <option value="debit">Debit</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer style={{ textAlign: "right" }}>
                        <Button size="sm" variant="success" type="submit">
                            Submit Transaction
                        </Button>
                    </Card.Footer>
                </Form>

                <hr className="my-4" />

                {/* Generate Bank Statement Form */}
                <Card.Header className="text-center">Generate Bank Statement</Card.Header>
                <Form onSubmit={this.generateStatement}>
                    <Card.Body>
                        <Row className="mb-3">
                            <Form.Label column={"sm"} sm={3}>Start Date</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    required
                                    type="date"
                                    name="startDate"
                                    value={startDate}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Form.Label column={"sm"} sm={3}>End Date</Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    required
                                    type="date"
                                    name="endDate"
                                    value={endDate}
                                    onChange={this.handleChange}
                                    className="bg-dark text-white"
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                    <Card.Footer style={{ textAlign: "right" }}>
                        <Button size="sm" variant="info" type="submit">
                            Generate Statement
                        </Button>
                    </Card.Footer>
                </Form>
            </Card>
        );
    }
}
