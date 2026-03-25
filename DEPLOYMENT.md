# Rehabb Care Backend - AWS Lambda Deployment Guide

## Architecture

- **Runtime**: Node.js 18.x
- **Platform**: AWS Lambda + API Gateway (HTTP API)
- **Framework**: Serverless Framework v3
- **Region**: eu-west-3 (Paris)
- **CI/CD**: GitHub Actions (auto-deploy on push to `main`)

## Project Structure (Deployment-Related Files)

```
rehabb_care_backend/
├── lambda.js                    # Lambda entry point (wraps Express app)
├── serverless.yml               # Serverless Framework configuration
├── server.js                    # Express app (exports app, conditional listen)
├── .github/workflows/prod.yml   # GitHub Actions CI/CD pipeline
├── .env.example                 # Environment variable template
└── package.json                 # Dependencies (includes serverless-http)
```

## Prerequisites

1. **Node.js** (v18 or later)
2. **AWS CLI** configured with valid credentials
3. **Serverless Framework v3** installed globally

### Install Serverless Framework v3

```bash
npm install -g serverless@3
```

> **Important**: Use v3, not v4. v4 requires a Serverless account/login. v3 is free and works directly with AWS credentials.

### Verify AWS Credentials

```bash
aws sts get-caller-identity
```

Should return your AWS account info. If not, run:

```bash
aws configure
```

And enter:
- AWS Access Key ID
- AWS Secret Access Key
- Default region: `eu-west-3`
- Default output format: `json`

## Manual Deployment (First Time)

1. Install dependencies:
```bash
npm install
```

2. Deploy to AWS:
```bash
serverless deploy
```

3. Output will show your API endpoint:
```
endpoint: ANY - https://xxxxxxxx.execute-api.eu-west-3.amazonaws.com/{proxy+}
```

4. Test the health endpoint:
```bash
curl https://xxxxxxxx.execute-api.eu-west-3.amazonaws.com/api/health
```

## CI/CD Pipeline (GitHub Actions)

### How It Works

Every push to the `main` branch triggers automatic deployment via GitHub Actions:

1. Checks out code
2. Sets up Node.js 18
3. Runs `npm ci` (installs dependencies from lock file)
4. Installs Serverless Framework v3
5. Runs `serverless deploy` with environment variables from GitHub Secrets

### Setting Up GitHub Secrets

Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these secrets:

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `FRONTEND_URL` | Production frontend URL |
| `APPOINTMENTS_SCRIPT_URL` | Google Apps Script URL for appointments |
| `CONSULTATIONS_SCRIPT_URL` | Google Apps Script URL for consultations |
| `PARTNERS_SCRIPT_URL` | Google Apps Script URL for partners |

### Triggering a Deploy

Simply push to `main`:

```bash
git add .
git commit -m "your changes"
git push origin main
```

Monitor the deploy: GitHub repo → **Actions** tab

## Environment Variables

The app uses these environment variables (set via GitHub Secrets in CI/CD):

| Variable | Purpose |
|---|---|
| `NODE_ENV` | Environment mode (set to `production` in Lambda) |
| `FRONTEND_URL` | Allowed CORS origin |
| `APPOINTMENTS_SCRIPT_URL` | Google Apps Script endpoint for appointments |
| `CONSULTATIONS_SCRIPT_URL` | Google Apps Script endpoint for consultations |
| `PARTNERS_SCRIPT_URL` | Google Apps Script endpoint for partners |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Health check (root) |
| GET | `/api/health` | Health check |
| ALL | `/api/appointments` | Appointments CRUD |
| ALL | `/api/partners` | Partners CRUD |
| ALL | `/api/consultations` | Consultations CRUD |

## Useful Commands

```bash
# Deploy to AWS
serverless deploy

# Run locally with Serverless offline
serverless offline

# Run locally with nodemon
npm run dev

# Remove the deployed stack from AWS
serverless remove

# View deployed function info
serverless info

# View Lambda logs
serverless logs -f app
```

## Lambda-Specific Notes

- **File system is read-only** in Lambda (except `/tmp`). The logger is configured to skip file logging when running in Lambda and only logs to console (CloudWatch).
- **`app.listen()` is skipped** in Lambda. The `LAMBDA_TASK_ROOT` env var is used to detect the Lambda environment.
- **Cold starts**: First request after idle may take 1-2 seconds. Subsequent requests are fast.
- **Timeout**: Default Lambda timeout is 6 seconds. If your Google Sheets API calls are slow, you may need to increase this in `serverless.yml`:
  ```yaml
  functions:
    app:
      handler: lambda.handler
      timeout: 30
  ```

## Troubleshooting

### Deploy fails with "Cannot resolve variable"
Environment variables are not set. For local deploys, the `serverless.yml` uses empty string fallbacks. For CI/CD, ensure all GitHub Secrets are configured.

### 502 Bad Gateway after deploy
Check Lambda logs:
```bash
serverless logs -f app
```
Common causes: missing dependencies, syntax errors, or environment variable issues.

### CORS errors in browser
Update `allowedOrigins` in `serverless.yml` with your actual frontend domain, then redeploy.
