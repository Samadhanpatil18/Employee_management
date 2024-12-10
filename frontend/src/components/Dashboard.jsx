import axios from 'axios';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';



const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username')

    useEffect(() => {

        const fetchEmployees = async () => {
            const token = localStorage.getItem('token')
            try {
                await axios.get('http://localhost:5000/api/employees/list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            } catch (error) {
                console.log(error);

                if (error.response.status == 401) {
                    navigate('/login')
                }

            }


        };
        fetchEmployees();
    }, []);

    return (
        <div className='w-full h-[80%] flex justify-center items-center'>
            <h1>Welcome {username}, Admin Panel</h1>

        </div>
    );
};

export default Dashboard;
