const Employee = require('../models/Employee');

const createEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        const imagePath = req.file ? req.file.path : null;

        const courseArray = Array.isArray(course) ? course : course.split(',');
        
        const newEmployee = new Employee({
            name,
            email,
            mobile,
            designation,
            gender,
            course: courseArray,
            image: imagePath
        });

        await newEmployee.save();

        res.status(201).json(newEmployee);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email is already registered' });
        } else {
            console.error('Error during user registration:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;
        console.log(req.body);
        const courseArray = Array.isArray(course) ? course : course.split(',');

        const imagePath = req.file ? req.file.path : req.body.existingImage;


        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, mobile, designation, gender, course: courseArray, image: imagePath },
            { new: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(updatedEmployee);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Email is already registered' });
        } else {
            console.error('Error during user registration:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

const listEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEmployee,
    listEmployees,
    getEmployeeById,
    deleteEmployee,
    updateEmployee
};
