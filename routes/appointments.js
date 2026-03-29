const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment
} = require('../config/googleSheets');

// Validation middleware
const validateAppointment = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('serviceArea').notEmpty().withMessage('Service area is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('locality').trim().notEmpty().withMessage('Locality is required'),
    body('notes').optional().trim()
];

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        const result = await getAppointments({ status, page, limit });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single appointment by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await getAppointments({ id: req.params.id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create new appointment
router.post('/', validateAppointment, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const result = await createAppointment(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update appointment
router.put('/:id', async (req, res) => {
    try {
        const result = await updateAppointment(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE appointment
router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteAppointment(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
