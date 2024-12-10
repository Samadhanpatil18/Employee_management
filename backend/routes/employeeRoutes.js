const express = require('express');
const multer = require('multer');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 

const {
    createEmployee,
    listEmployees,
    getEmployeeById,
    deleteEmployee,
    updateEmployee
} = require('../controllers/EmployeeController'); 
const upload = require('../middleware/upload');



router.post('/create', auth, upload.single('image'), createEmployee);
router.get('/list', auth, listEmployees);
router.get('/:id', auth, getEmployeeById);
router.delete('/delete/:id', auth, deleteEmployee);
router.put('/update/:id', auth, upload.single('image'), updateEmployee);

module.exports = router;
