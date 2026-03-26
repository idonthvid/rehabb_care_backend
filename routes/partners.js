const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    createPartner,
    getPartners,
    updatePartner,
    deletePartner
} = require('../config/googleSheets');

// Validation middleware
const validatePartner = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('specialization').trim().notEmpty().withMessage('Specialization is required'),
    body('pincode').trim().notEmpty().withMessage('Pincode is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('referralCode').optional().trim()
];

// GET all partners
router.get('/', async (req, res) => {
    try {
        const { status, page, limit } = req.query;
        const result = await getPartners({ status, page, limit });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single partner
router.get('/:id', async (req, res) => {
    try {
        const result = await getPartners({ id: req.params.id });
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create new partner
router.post('/', validatePartner, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const result = await createPartner(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT update partner
router.put('/:id', async (req, res) => {
    try {
        const result = await updatePartner(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE partner
router.delete('/:id', async (req, res) => {
    try {
        const result = await deletePartner(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
