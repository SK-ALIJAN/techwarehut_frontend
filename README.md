# Travel Aggregator Platform – Travel Package Booking Module

## Overview
This is a full-stack web application built for a Travel Aggregator Platform. It includes a frontend built with Next.js, Redux Toolkit, RTK Query, and Tailwind CSS, and a backend powered by Node.js, Express, and MongoDB.

## Features
- **Authentication**: JWT-based login/register with role-based access (admin/user).
- **Packages API**: Add, Update, Delete, Get All, and Get Single package. Includes advanced filtering, sorting, and pagination.
- **Booking Module**: Book travel packages, checks for available seats, and allows booking cancellation with seat restoration.
- **Frontend App**: Modern responsive UI with debounced search, sort, pagination, form validations, error handling, and specialized pages for public viewing, bookings, and admin management.

## Tech Stack
- **Frontend**: Next.js 14, React, Redux Toolkit, RTK Query, Tailwind CSS, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas URL)

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example` and update the values:
   ```bash
   cp .env.example .env
   ```
   *Make sure `MONGO_URI` is correctly pointing to your MongoDB instance.*
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Application Access
- **Frontend Application**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`

## Test Accounts
To create an admin account, you can register a new user and manually change their role to `admin` in your MongoDB database, or modify the register payload.

## Swagger Documentation & Postman Integration
You can view the Swagger UI documentation locally at:
- **Swagger UI**: `http://localhost:5000/api-docs`
- **Swagger JSON Spec**: `http://localhost:5000/api-docs.json`

### Creating a Postman Collection from Swagger:
1. Make sure your backend server is running (`npm run dev`).
2. Open **Postman**.
3. Click the **Import** button in the top-left navigation panel.
4. Select the **Link** option.
5. Paste the URL: `http://localhost:5000/api-docs.json`
6. Click **Continue** and then **Import**.
7. Postman will generate a complete, structured Collection of all API endpoints with pre-populated schema parameters!

