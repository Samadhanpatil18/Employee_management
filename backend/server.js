const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
