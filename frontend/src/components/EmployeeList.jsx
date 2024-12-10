import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' }); 
    const [currentPage, setCurrentPage] = useState(1); 
    const employeesPerPage = 5;

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/employees/list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEmployees(res.data);
            } catch (error) {
                if (error.response.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchEmployees();
    }, [token, navigate]);

    const handleDelete = async (id) => {
        await axios.delete('http://localhost:5000/api/employees/delete/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setEmployees(employees.filter(emp => emp._id !== id));
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        return d.toLocaleDateString('en-GB', options).replace(/,/g, '');
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedEmployees = [...employees].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredEmployees = sortedEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.uniqueId.toString().includes(searchTerm)
    );

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-8 mt-16 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-indigo-600">Employee List</h2>
                <Link
                    to="/create-employee"
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
                >
                    Add Employee
                </Link>
            </div>
            
            <div className="mb-4 flex justify-between items-center">
                <input
                    type="text"
                    placeholder="Search by Name, Email, or ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded p-2"
                />
            </div>
            
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full">
                    <thead className="bg-indigo-500 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('uniqueId')}>
                                ID {sortConfig.key === 'uniqueId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left">Image</th>
                            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>
                                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('email')}>
                                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left">Mobile</th>
                            <th className="py-3 px-6 text-left">Designation</th>
                            <th className="py-3 px-6 text-left">Gender</th>
                            <th className="py-3 px-6 text-left">Course</th>
                            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('createdDate')}>
                                Created On {sortConfig.key === 'createdDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.map(emp => (
                            <tr key={emp._id} className="border-b">
                                <td className="py-3 px-6">{emp.uniqueId}</td>
                                <td className="py-3 px-6">
                                    {emp.image && (
                                        <img
                                            src={`http://localhost:5000/${emp.image}`}
                                            alt={emp.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                    )}
                                </td>
                                <td className="py-3 px-6">{emp.name}</td>
                                <td className="py-3 px-6">{emp.email}</td>
                                <td className="py-3 px-6">{emp.mobile}</td>
                                <td className="py-3 px-6">{emp.designation}</td>
                                <td className="py-3 px-6">{emp.gender}</td>
                                <td className="py-3 px-6">{emp.course}</td>
                                <td className="py-3 px-6">{formatDate(emp.createdDate)}</td>
                                <td className="py-3 px-6 flex space-x-4">
                                    <Link
                                        to={`/edit-employee/${emp._id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        <button>Edit</button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(emp._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-center">
                {[...Array(Math.ceil(filteredEmployees.length / employeesPerPage))].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 mx-1 rounded ${currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
