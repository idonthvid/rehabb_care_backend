// Simple test script to demonstrate logging
const API_URL = 'http://localhost:5000/api';

// Test creating an appointment
async function testCreateAppointment() {
    console.log('\n🧪 Testing: Create Appointment\n');

    const appointmentData = {
        fullName: 'Test User',
        phone: '9876543210',
        email: 'test@example.com',
        service: 'Physiotherapy',
        dateTime: '2024-03-25T10:00',
        pincode: '123456',
        message: 'Test appointment from backend'
    };

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
        });

        const result = await response.json();
        console.log('✅ Response:', result);
        console.log('\n📋 Check the backend logs to see the data logging!\n');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run test
testCreateAppointment();
