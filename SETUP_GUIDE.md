# Backend Setup Guide - Google Sheets Integration

This backend uses Google Sheets as the database with proper REST API endpoints.

## Prerequisites

1. Node.js (v14 or higher)
2. A Google Cloud Project with Sheets API enabled
3. Service Account credentials

## Step 1: Google Cloud Setup

### Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in details:
   - Name: `rehabb-care-backend`
   - Description: `Backend service for Rehabb Care`
4. Click "Create and Continue"
5. Skip optional steps and click "Done"

### Download Credentials

1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Download the file
6. Rename it to `credentials.json`
7. Place it in the `rehabb_care_backend` folder

## Step 2: Google Sheets Setup

### Create Your Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Rehabb Care Database"

### Create Three Sheets

Create these three sheets (tabs) with exact names:

#### 1. Appointments Sheet
Columns (Row 1):
- A1: Timestamp
- B1: Full Name
- C1: Phone
- D1: Email
- E1: Service
- F1: Date & Time
- G1: Pincode
- H1: Message
- I1: Status

#### 2. Consultations Sheet
Columns (Row 1):
- A1: Timestamp
- B1: Full Name
- C1: Phone
- D1: Email
- E1: Consultation Type
- F1: Preferred Date
- G1: Message
- H1: Status

#### 3. Partners Sheet
Columns (Row 1):
- A1: Timestamp
- B1: Name
- C1: Email
- D1: Phone
- E1: Organization
- F1: Message
- G1: Status

### Share Spreadsheet with Service Account

1. Open your spreadsheet
2. Click "Share" button
3. Add the service account email (found in `credentials.json` as `client_email`)
   - It looks like: `rehabb-care-backend@project-id.iam.gserviceaccount.com`
4. Give it "Editor" access
5. Uncheck "Notify people"
6. Click "Share"

### Get Spreadsheet ID

From the spreadsheet URL:
```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
```
Copy the `SPREADSHEET_ID_HERE` part

## Step 3: Backend Configuration

1. Navigate to backend folder:
```bash
cd rehabb_care_backend
```

2. Install dependencies:
```bash
npm install
```

3. Update `.env` file:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_actual_spreadsheet_id
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
```

4. Make sure `credentials.json` is in the backend folder

## Step 4: Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Create Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "service": "Physiotherapy",
    "dateTime": "2024-03-20T10:00",
    "pincode": "123456",
    "message": "Need help with knee pain"
  }'
```

### Get All Appointments
```bash
curl http://localhost:5000/api/appointments
```

## API Endpoints

All endpoints support:

### Appointments (`/api/appointments`)
- `GET /` - Get all (supports ?status=pending&page=1&limit=10)
- `GET /:id` - Get single appointment
- `POST /` - Create new appointment
- `PUT /:id` - Update appointment
- `DELETE /:id` - Delete appointment

### Consultations (`/api/consultations`)
- Same CRUD operations as appointments

### Partners (`/api/partners`)
- Same CRUD operations as appointments

## Troubleshooting

### Error: "Unable to read credentials"
- Make sure `credentials.json` exists in the backend folder
- Check the path in `.env` file

### Error: "The caller does not have permission"
- Make sure you shared the spreadsheet with the service account email
- Give it "Editor" access

### Error: "Requested entity was not found"
- Check if `GOOGLE_SPREADSHEET_ID` in `.env` is correct
- Make sure sheet names are exactly: "Appointments", "Consultations", "Partners"

### Data not appearing in sheets
- Check server logs for errors
- Verify sheet column headers match exactly
- Make sure service account has Editor access

## Security Notes

1. Never commit `credentials.json` to git (already in .gitignore)
2. Never commit `.env` file with real credentials
3. Keep service account credentials secure
4. Use environment variables in production

## Next Steps

1. Update your React frontend to use the new API endpoints
2. Test all CRUD operations
3. Deploy backend to a hosting service (Heroku, Railway, etc.)
4. Update frontend environment variables for production

## Production Deployment

When deploying to production:
1. Upload `credentials.json` securely to your server
2. Set environment variables on your hosting platform
3. Update `FRONTEND_URL` to your production frontend URL
4. Enable HTTPS
