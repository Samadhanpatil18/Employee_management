import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import logo from '../assets/logo.png'
const Header = () => {
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <header className="fixed p-5 h-fit top-0 inset-x-0 w-full dark:bg-gray-900 text-white z-10 shadow-md">
        <img className='w-10' src={logo}></img>
            <nav className="container mx-auto">
                <ul className="flex justify-between items-center">
                    <li className="text-xl font-bold">
                        <Link to="/" className="hover:text-blue-500">Home</Link>
                    </li>
                    <li className="text-xl font-bold">
                        <Link to="/employees" className="hover:text-blue-500">Employee List</Link>
                    </li>
                    <li className="text-lg text-blue-500">
                        <span className="font-semibold">Username: </span>{username}
                    </li>
                    <li 
                        className="cursor-pointer text-red-500 text-lg hover:text-red-700 font-semibold"
                        onClick={handleLogout}
                    >
                        Logout
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;