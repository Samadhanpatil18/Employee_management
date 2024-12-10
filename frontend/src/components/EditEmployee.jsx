import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        course: [],
        image: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({ email: '', mobile: '', gender: '', course: '' });

    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const employeeData = res.data;

                setEmployee({
                    name: employeeData.name || '',
                    email: employeeData.email || '',
                    mobile: employeeData.mobile || '',
                    designation: employeeData.designation || '',
                    gender: employeeData.gender || '',
                    course: employeeData.course || [],
                    image: null
                });
                setPreviewImage(employeeData.image);
            } catch (err) {
                console.error('Error fetching employee data:', err);
                navigate('/login')
            }
        };

        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let updatedCourses = [...employee.course];
        if (checked) {
            updatedCourses.push(value);
        } else {
            updatedCourses = updatedCourses.filter((course) => course !== value);
        }
        setEmployee((prevState) => ({
            ...prevState,
            course: updatedCourses
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setEmployee((prevState) => ({
                ...prevState,
                image: file
            }));
            setPreviewImage(URL.createObjectURL(file));
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
            setErrors((prevState) => ({ ...prevState, email: 'Invalid email format' }));
            isValid = false;
        }

        if (!validateMobile(employee.mobile)) {
            setErrors((prevState) => ({ ...prevState, mobile: 'Mobile number must be 10 digits' }));
            isValid = false;
        }

        if (!employee.gender) {
            setErrors((prevState) => ({ ...prevState, gender: 'Please select a gender' }));
            isValid = false;
        }

        if (employee.course.length === 0) {
            setErrors((prevState) => ({ ...prevState, course: 'Please select at least one course' }));
            isValid = false;
        }

        if (!isValid) return;

        const formData = new FormData();

        formData.append('name', employee.name);
        formData.append('email', employee.email);
        formData.append('mobile', employee.mobile);
        formData.append('designation', employee.designation);
        formData.append('gender', employee.gender);
        formData.append('course', employee.course.join(','));

        if (employee.image) {
            formData.append('image', employee.image);
        }

        try {
            await axios.put(`http://localhost:5000/api/employees/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Employee updated successfully');
            navigate('/employees');
        } catch (err) {
            if (err.response.status) {
                setErrors((prevState) => ({ ...prevState, email: 'Email already in use' }));

            }
            console.error('Error updating employee:', err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-8 mt-20 shadow-md rounded-lg">
            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Name:</label>
                <input
                    type="text"
                    name="name"
                    value={employee.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Email:</label>
                <input
                    type="email"
                    name="email"
                    value={employee.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Mobile No:</label>
                <input
                    type="text"
                    name="mobile"
                    value={employee.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.mobile && <span className="text-red-500 text-sm">{errors.mobile}</span>}
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Designation:</label>
                <select
                    name="designation"
                    value={employee.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Select Designation</option>
                    <option value="HR">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Gender:</label>
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

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Courses:</label>
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

            <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Image Upload:</label>
                <input
                    id="image"
                    type="file"
                    name="image"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                />
                {previewImage && (
                    <img
                        src={previewImage.startsWith('blob') ? previewImage : `http://localhost:5000/${previewImage}`}
                        alt="Employee"
                        className="mt-2 w-24 h-24 rounded-full"
                    />
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-200"
            >
                Update Employee
            </button>
        </form>

    );
};

export default EditEmployee;