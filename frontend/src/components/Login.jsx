import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });

            if (response.status === 200) {
                alert('Login successful');
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('username', username);
                navigate('/')
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Wrong username or password');
                } else {
                    alert('Login failed, please try again');
                }
            } else {
                console.error('Error:', error.message);
                alert('Login failed due to a network issue or server problem');
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-[80%] top-0 left-0 bg-white dark:bg-[#242424] w-full absolute z-20">
            <div className=" p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block dark:text-gray-300 text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block dark:text-gray-300 text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>

    );
};

export default Login;
