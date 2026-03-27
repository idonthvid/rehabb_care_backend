const logger = require('./logger');

// Google Apps Script URLs from environment
const APPS_SCRIPT_URLS = {
    APPOINTMENTS: process.env.APPOINTMENTS_SCRIPT_URL,
    CONSULTATIONS: process.env.CONSULTATIONS_SCRIPT_URL,
    PARTNERS: process.env.PARTNERS_SCRIPT_URL
};

// Helper function to call Apps Script
const callAppsScript = async (url, method = 'GET', data = null) => {
    const startTime = Date.now();

    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data && method === 'POST') {
            options.body = JSON.stringify(data);
        }

        // Add query params for GET requests
        let fullUrl = url;
        if (method === 'GET' && data) {
            const params = new URLSearchParams(data);
            fullUrl = `${url}?${params.toString()}`;
        }

        const response = await fetch(fullUrl, options);
        const duration = Date.now() - startTime;

        // Only log if it's a data operation (POST)
        if (method === 'POST') {
            logger.info(`✅ Google Sheets updated (${duration}ms)`);
        }

        // Handle response
        const text = await response.text();
        try {
            return JSON.parse(text);
        } catch {
            return { success: true, message: text };
        }
    } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`❌ Google Sheets error (${duration}ms):`, {
            error: error.message,
            method
        });
        throw error;
    }
};

// Create appointment
const createAppointment = async (data) => {
    return callAppsScript(APPS_SCRIPT_URLS.APPOINTMENTS, 'POST', data);
};

// Get appointments
const getAppointments = async (params = {}) => {
    return callAppsScript(APPS_SCRIPT_URLS.APPOINTMENTS, 'GET', params);
};

// Update appointment
const updateAppointment = async (id, data) => {
    return callAppsScript(APPS_SCRIPT_URLS.APPOINTMENTS, 'POST', {
        action: 'update',
        id,
        ...data
    });
};

// Delete appointment
const deleteAppointment = async (id) => {
    return callAppsScript(APPS_SCRIPT_URLS.APPOINTMENTS, 'POST', {
        action: 'delete',
        id
    });
};

// Create consultation - now stores in appointments sheet with location field
const createConsultation = async (data) => {
    // Send to appointments sheet with location field to identify as consultation
    return callAppsScript(APPS_SCRIPT_URLS.APPOINTMENTS, 'POST', {
        name: data.name,
        phone: data.phone,
        location: data.location
    });
};

// Get consultations
const getConsultations = async (params = {}) => {
    return callAppsScript(APPS_SCRIPT_URLS.CONSULTATIONS, 'GET', params);
};

// Update consultation
const updateConsultation = async (id, data) => {
    return callAppsScript(APPS_SCRIPT_URLS.CONSULTATIONS, 'POST', {
        action: 'update',
        id,
        ...data
    });
};

// Delete consultation
const deleteConsultation = async (id) => {
    return callAppsScript(APPS_SCRIPT_URLS.CONSULTATIONS, 'POST', {
        action: 'delete',
        id
    });
};

// Create partner
const createPartner = async (data) => {
    return callAppsScript(APPS_SCRIPT_URLS.PARTNERS, 'POST', data);
};

// Get partners
const getPartners = async (params = {}) => {
    return callAppsScript(APPS_SCRIPT_URLS.PARTNERS, 'GET', params);
};

// Update partner
const updatePartner = async (id, data) => {
    return callAppsScript(APPS_SCRIPT_URLS.PARTNERS, 'POST', {
        action: 'update',
        id,
        ...data
    });
};

// Delete partner
const deletePartner = async (id) => {
    return callAppsScript(APPS_SCRIPT_URLS.PARTNERS, 'POST', {
        action: 'delete',
        id
    });
};

module.exports = {
    createAppointment,
    getAppointments,
    updateAppointment,
    deleteAppointment,
    createConsultation,
    getConsultations,
    updateConsultation,
    deleteConsultation,
    createPartner,
    getPartners,
    updatePartner,
    deletePartner
};
