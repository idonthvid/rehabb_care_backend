const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    createConsultation,
    getConsultations,
    updateConsultation,
    deleteConsultation
} = require('../config/googleSheets');

// Validation middleware
const validateConsultation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('doctor').trim().notEmpty().withMessage('Doctor is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
];

// GET all consultations
router.get('/', async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        const result = await getConsultations({ status, page, limit });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single consultation
router.get('/:id', async (req, res) => {
    try {
        const result = await getConsultations({ id: req.params.id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create new consultation
router.post('/', validateConsultation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const result = await createConsultation(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update consultation
router.put('/:id', async (req, res) => {
    try {
        const result = await updateConsultation(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE consultation
router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteConsultation(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
