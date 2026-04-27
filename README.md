# Integrated Riverton Parking System

A comprehensive, full-stack parking management ecosystem designed to streamline civic services for both citizens and parking enforcement officers. This project replaces fragmented legacy systems with a modern, unified platform backed by a relationally robust MSSQL database.

## 🚀 Features

### 👤 Citizen Portal (User App)
- **Dashboard**: High-level overview of active permits and recent citations.
- **Permit Management**: Apply for, view, and renew vehicle parking permits (Residential, Visitor, Commercial, etc.).
- **Citation Disputes**: Submit and track the status of citation disputes with an interactive timeline.
- **Payments & Transactions**: View a unified history of all permit purchases and citation payments.
- **Vehicle Registry**: Register and manage multiple vehicles under a single account.

### 👮 Enforcement Portal (Officer App)
- **Real-Time Lookups**: Instantly verify vehicle plate numbers against the active permits database.
- **Citation Issuance**: Issue precise citations with automated violation-to-fine mapping.
- **Enforcement Feed**: View a localized feed of recently issued, open, and unpaid citations.

### 🗄️ Backend API & Database
- **Express.js API**: RESTful endpoints handling all core business logic.
- **MSSQL Database**: Strictly enforced relational integrity mapping Users, Vehicles, Permits, Citations, Disputes, and Transactions.

---

## 🛠️ Project Structure

The repository is organized into three main components:
- `/` (Root): The Node.js/Express Backend API and database configuration/scripts.
- `/frontend`: The React.js (Vite) application for Citizens.
- `/officer-app`: The React.js (Vite) application for Enforcement Officers.

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v16+)
- Microsoft SQL Server (Ensure you have a local instance running and configure credentials in `/db/config.js`)

### 1. Database Setup
First, install the backend dependencies and initialize the database. From the root directory:
```bash
npm install
node db/seed.js
```
*Note: The seed script will automatically construct the tables, establish foreign key constraints, and populate the database with mock data for testing.*

### 2. Start the Backend Server
From the root directory, start the Express API:
```bash
# Starts on port 3000
npm run dev
```

### 3. Start the Citizen App
Open a new terminal window, navigate to the `frontend` folder, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```

### 4. Start the Officer App
Open another terminal window, navigate to the `officer-app` folder, and start the application:
```bash
cd officer-app
npm install
npm run dev
```

## 🔐 Demo Credentials
When testing the application, you can log in to the Citizen portal using the seeded demo account:
- **Email:** `old@user.com`
- **Password:** `1234`
