import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeList from './components/EmployeeList';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ErrorPage from './components/Error';

function App() {

    return (
        <div className='w-screen h-screen p-8'>
            <Router>
            <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<EmployeeList />} />
                    <Route path="/create-employee" element={<CreateEmployee />} />
                    <Route path="/edit-employee/:id" element={<EditEmployee />} />
                    <Route path="*" element={<ErrorPage statusCode="404" message="Page Not Found" />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
