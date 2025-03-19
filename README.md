# Automated Badge Issuance System

## Overview
This project automates the issuance of completion badges using **Cloudflare Workers** and **Badgr API**. It captures user details, stores them in **Cloudflare D1**, and processes badge issuance through a scheduled Cloudflare Worker.

## Features
- **Serverless Backend**: Cloudflare Workers handle API requests efficiently.
- **Automated Badge Issuance**: A scheduled Cloudflare Worker runs daily to issue badges.
- **Database Management**: Cloudflare D1 stores user data.
- **Slack Error Reporting**: Failed badge requests trigger Slack notifications.
- **Batch Processing**: Handles multiple requests efficiently with batch execution.

## Architecture
1. **User submits badge request** → Stored in Cloudflare D1.
2. **Cron job runs daily** → Fetches unprocessed users.
3. **Badgr API issues badges** → Updates database on success.
4. **Failed requests logged** → Slack notifications sent.

## Tech Stack
- **Frontend**: React (if applicable)
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare D1
- **Badge Issuance**: Badgr API
- **Error Handling**: Slack Webhook

## Installation & Setup
### Prerequisites
- [Cloudflare Account](https://dash.cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/)
- [Badgr Account](https://badgr.com/)

### Clone the Repository
```sh
git clone https://github.com/Prasanth-S7/badges-for-completion-of-tour/
cd badges-for-completion-of-tour
```

### Install Dependencies
```sh
cd client
npm install
cd backend
npm install
```

### Configure Environment Variables
For testing purposes, the env variables are present in the wrangler.jsonc file

### Running Cloudflare Workers Locally
```sh
npx wrangler dev
```

## Cron Job Execution
For testing purpose, the cron job runs every 30 minutes. We can configure the frequency of the cron job in the wrangler.jsonc file.

## Error Handling
- Failed badge requests are logged.
- Slack notifications are sent for monitoring.

---
This `README.md` provides all necessary details for setting up, running, and maintaining the project.
