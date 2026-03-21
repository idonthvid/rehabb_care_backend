# Rehabb Care Backend API

Backend server that provides REST API endpoints for the Rehabb Care application, using Google Apps Script as the database layer.

## How It Works

This backend acts as a proxy/API layer between your React frontend and Google Sheets:
- Frontend → Backend API → Google Apps Script → Google Sheets
- No credentials.json needed - uses the same Apps Script URLs as your frontend!

## Setup

### 1. Install Dependencies

```bash
cd rehabb_care_backend
npm install
```

### 2. Configure Environment

The `.env` file is already configured with your Google Apps Script URLs from the frontend:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google Apps Script URLs (same as frontend)
APPOINTMENTS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
CONSULTATIONS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
PARTNERS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
```

### 3. Start the Server

Development mode (auto-restart on changes):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on: `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Consultations
- `GET /api/consultations` - Get all consultations
- `GET /api/consultations/:id` - Get single consultation
- `POST /api/consultations` - Create new consultation
- `PUT /api/consultations/:id` - Update consultation
- `DELETE /api/consultations/:id` - Delete consultation

### Partners
- `GET /api/partners` - Get all partners
- `GET /api/partners/:id` - Get single partner
- `POST /api/partners` - Create new partner
- `PUT /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner

## Query Parameters

All GET endpoints support:
- `status` - Filter by status (pending, confirmed, etc.)
- `page` - Page number for pagination
- `limit` - Items per page

Example:
```
GET /api/appointments?status=pending&page=1&limit=10
```

## Testing the API

### Using PowerShell
```powershell
# Health check
Invoke-RestMethod -Uri http://localhost:5000/api/health

# Get appointments
Invoke-RestMethod -Uri http://localhost:5000/api/appointments

# Create appointment
$body = @{
    fullName = "John Doe"
    phone = "1234567890"
    email = "john@example.com"
    service = "Physiotherapy"
    dateTime = "2024-03-20T10:00"
    pincode = "123456"
    message = "Need help"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/appointments -Method Post -Body $body -ContentType "application/json"
```

### Using Browser
Open: `http://localhost:5000/api/health`

## Frontend Integration

Update your React app to use the backend API:

```javascript
// In your React components, replace:
import { submitAppointment } from './config/googleSheets';

// With:
import { submitAppointment } from './config/api';
```

The API client is already created at `rehabb_care/src/config/api.js`

## Logging

The backend includes smart logging that only logs when data operations occur:

### What Gets Logged:
- ✅ POST requests (creating data)
- ✅ PUT requests (updating data)
- ✅ DELETE requests (deleting data)
- ✅ Request data (what was sent)
- ✅ Response data (what was returned)
- ✅ Errors and failures
- ✅ Google Sheets API calls

### What Doesn't Get Logged:
- ❌ GET requests (reading data)
- ❌ Health checks
- ❌ Static file requests

### Log Files Location:
```
rehabb_care_backend/logs/
├── combined.log    # All logs
└── error.log       # Only errors
```

### Example Log Output:
When someone submits an appointment form:
```
2024-03-17 10:30:45 [INFO]: 📥 POST /api/appointments
2024-03-17 10:30:45 [INFO]: Request Data: { fullName: 'John Doe', phone: '123...', ... }
2024-03-17 10:30:46 [INFO]: ✅ Google Sheets updated (850ms)
2024-03-17 10:30:46 [INFO]: 📤 Response POST /api/appointments - 201 (900ms)
2024-03-17 10:30:46 [INFO]: Response Data: { success: true, message: '...' }
```

### Test Logging:
```bash
# Run test script to see logging in action
node test-api.js
```

Then check the console and `logs/combined.log` file.

## Benefits of This Setup

1. **No credentials needed** - Uses existing Apps Script URLs
2. **Centralized validation** - Backend validates all data
3. **Better error handling** - Proper HTTP status codes
4. **Pagination support** - Handle large datasets
5. **Easy to extend** - Add authentication, logging, etc.
6. **CORS configured** - Frontend can call backend safely

## Project Structure

```
rehabb_care_backend/
├── config/
│   └── googleSheets.js    # Apps Script integration
├── routes/
│   ├── appointments.js    # Appointment endpoints
│   ├── consultations.js   # Consultation endpoints
│   └── partners.js        # Partner endpoints
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json
```

## Next Steps

1. ✅ Backend is running on port 5000
2. Update frontend to use backend API (optional)
3. Deploy backend to hosting service (Heroku, Railway, Render, etc.)
4. Update frontend environment variables for production

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use
- Run: `npm install` to ensure dependencies are installed

### API returns errors
- Verify Apps Script URLs in `.env` are correct
- Check that Apps Script is deployed and accessible
- Look at server logs for detailed error messages

### CORS errors
- Make sure `FRONTEND_URL` in `.env` matches your React app URL
- For production, update to your production frontend URL
