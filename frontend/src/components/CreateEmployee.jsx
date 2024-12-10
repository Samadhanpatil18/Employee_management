import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateEmployee = () => {
    const [employee, setEmployee] = useState({
        name: '', email: '', mobile: '', designation: 'HR', gender: '', course: [], image: null, createdDate: new Date()
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({ email: '', mobile: '', gender: '', course: '' });
    const navigate = useNavigate();
    const token = localStorage.getItem('token')

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedCourses = [...employee.course];
        if (checked) {
            updatedCourses.push(value);
        } else {
            updatedCourses = updatedCourses.filter((course) => course !== value);
        }
        console.log(updatedCourses);

        setEmployee({ ...employee, course: updatedCourses });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setEmployee({ ...employee, image: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            alert('Only jpg/png files are allowed');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateMobile = (mobile) => {
        const mobileRegex = /^[0-9]{10}$/;
        return mobileRegex.test(mobile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors({ email: '', mobile: '', gender: '', course: '' });

        let isValid = true;

        if (!validateEmail(employee.email)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
            isValid = false;
        }

        if (!validateMobile(employee.mobile)) {
            setErrors(prev => ({ ...prev, mobile: 'Mobile number must be 10 digits' }));
            isValid = false;
        }

        if (!employee.gender) {
            setErrors(prev => ({ ...prev, gender: 'Please select a gender' }));
            isValid = false;
        }

        if (employee.course.length === 0) {
            setErrors(prev => ({ ...prev, course: 'Please select at least one course' }));
            isValid = false;
        }

        if (!isValid) return;

        const formData = new FormData();
        Object.keys(employee).forEach(key => {
            formData.append(key, employee[key]);
        });

        try {
            await axios.post('http://localhost:5000/api/employees/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(employee.course);


            navigate('/employees');
        } catch (error) {
            if (error.response.status == 400) {
                alert('Email is Already used')
            }
            else{
                alert('internal server error')
            }
            console.error('Error creating employee:', error);

        }
    };

    return (
        <div className="max-w-md mx-auto p-8 mt-20 bg-gray-800 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Create Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-white mb-2" htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-white mb-2" htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>

                <div>
                    <label className="block text-white mb-2" htmlFor="mobile">Mobile No:</label>
                    <input
                        id="mobile"
                        type="text"
                        name="mobile"
                        placeholder="Enter Mobile No"
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile}</span>}
                </div>

                <div>
                    <label className="block text-white mb-2" htmlFor="designation">Designation:</label>
                    <select
                        id="designation"
                        name="designation"
                        value={employee.designation}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Select Designation</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                <div className="mb-4 text-white">
                    <span className="font-bold">Gender:</span>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="M"
                                checked={employee.gender === 'M'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Male
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="gender"
                                value="F"
                                checked={employee.gender === 'F'}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Female
                        </label>
                    </div>
                    {errors.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                </div>

                <div className="mb-4 text-white">
                    <span className="font-bold">Courses:</span>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="MCA"
                                checked={employee.course.includes('MCA')}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            MCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BCA"
                                checked={employee.course.includes('BCA')}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            BCA
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="BSC"
                                checked={employee.course.includes('BSC')}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            BSC
                        </label>
                    </div>
                    {errors.course && <span className="text-red-500 text-sm">{errors.course}</span>}
                </div>

                <div>
                    <label className="block text-white mb-2" htmlFor="image">Image Upload:</label>
                    <input
                        id="image"
                        type="file"
                        name="image"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        required
                        className="w-full border border-gray-600 bg-gray-700 rounded-lg focus:outline-none"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="preview"
                            className="mt-2 w-24 h-24 rounded-lg"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
                >
                    Create Employee
                </button>
            </form>
        </div>



    );
};

export default CreateEmployee;
