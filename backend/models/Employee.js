const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const employeeSchema = new mongoose.Schema({
    uniqueId: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    designation: { type: String, enum: ['HR', 'Manager', 'Sales'], required: true },
    gender: { type: String, enum: ['M', 'F'], required: true },
    course: { type: [String], enum: ['MCA', 'BCA', 'BSC'], required: true },
    image: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

employeeSchema.plugin(AutoIncrement, { inc_field: 'uniqueId' });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
