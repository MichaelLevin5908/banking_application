// src/App.js

import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import CreditDebit from './components/CreditDebit';
import ProtectedRoute from './components/ProtectedRoute';
import Transfer from './components/Transfer'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/signin" />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/credit-debit"
                    element={
                        <ProtectedRoute>
                            <CreditDebit />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/transfer"
                    element={
                        <ProtectedRoute>
                            <Transfer />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;






