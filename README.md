# 🚗 PrimeRide - Urban Mobility Platform (Uber Clone)

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000.svg)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg)](https://tailwindcss.com/)

A full-stack, responsive ride-hailing application platform featuring separate authentication portals for **Riders (Users)** and **Drivers (Captains)**, robust client-side validation, JWT authentication, and centralized state management via React Context API.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Client Pages & React Router Guide](#-client-pages--react-router-guide)
- [Backend Express API Routes Guide](#-backend-express-api-routes-guide)
- [State Management (Context API)](#-state-management-context-api)
- [Getting Started & Setup Guide](#-getting-started--setup-guide)

---

## 🏗️ Architecture & Tech Stack

```
 ┌─────────────────────────────────────────────────────────┐
 │                Client App (Vite + React)                │
 │  Port: 5173 / 3000                                      │
 │                                                         │
 │  ┌─────────────────┐       ┌─────────────────────────┐  │
 │  │  React Router   │ ───►  │ User & Captain Contexts │  │
 │  └─────────────────┘       └─────────────────────────┘  │
 │           │                             │               │
 │           └─────────────┬───────────────┘               │
 │                         ▼                               │
 │               ┌──────────────────┐                      │
 │               │  Axios Instance  │                      │
 │               └─────────┬────────┘                      │
 └─────────────────────────┼───────────────────────────────┘
                           │ HTTP / REST API (CORS enabled)
                           ▼
 ┌─────────────────────────────────────────────────────────┐
 │                Server App (Node.js + Express)           │
 │  Port: 8000                                             │
 │                                                         │
 │  ┌───────────────────────────────────────────────────┐  │
 │  │ Routes: /api/v1/users  |  /api/v1/captains        │  │
 │  └───────────────────────────────────────────────────┘  │
 │                         │                               │
 │                         ▼                               │
 │         ┌───────────────────────────────┐               │
 │         │ Middlewares (JWT & Validator) │               │
 │         └───────────────────────────────┘               │
 └─────────────────────────────────────────────────────────┘
```

### **Frontend (App)**
- **Framework**: Vite + React 18
- **Styling**: Tailwind CSS with custom theme extensions
- **State Management**: React Context API (`UserContext`, `CaptainContext`)
- **Routing**: `react-router-dom` (v6)
- **HTTP Client**: Axios with configured `baseURL` and CORS credentials

### **Backend (Server)**
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: `express-validator` middleware
- **Security & Auth**: JSON Web Tokens (JWT), `cookie-parser`, `bcrypt` password hashing, `cors`

---

## 📁 Project Directory Structure

```
The Uber Clone/
├── App/                         # Frontend React Application
│   ├── src/
│   │   ├── components/          # Reusable UI Components (Navbar, etc.)
│   │   ├── Context/             # React Context Providers
│   │   │   ├── UserContext.jsx
│   │   │   └── CaptainContext.jsx
│   │   ├── pages/               # React Route Views
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── UserLogni.jsx    # Rider login portal
│   │   │   ├── UserSignup.jsx   # Rider registration portal
│   │   │   ├── CaptionLogin.jsx # Captain login portal
│   │   │   └── CaptionSignin.jsx# Captain onboarding & vehicle setup
│   │   ├── services/            # Axios API config
│   │   ├── App.jsx              # Main router container
│   │   └── main.jsx             # Entry point wrapping providers
│   └── package.json
│
├── Server/                      # Backend Express REST API
│   ├── src/
│   │   ├── controllers/         # Request handlers (User & Captain)
│   │   ├── middleware/          # JWT auth verification middleware
│   │   ├── models/              # Mongoose database schemas
│   │   ├── routes/              # Express API endpoint definitions
│   │   │   ├── user.Routes.js
│   │   │   └── caption.Routes.js
│   │   ├── app.js               # Express middleware & app initialization
│   │   └── index.js             # DB connection & server startup
│   └── package.json
│
├── README.md                    # Project Documentation
└── walkthrought.md              # Detailed technical walkthrough
```

---

## 💻 Client Pages & React Router Guide

The React application renders inside a mobile-responsive viewport container handled in `App.jsx`.

| Route | React Component | Access / Role | Primary Responsibilities & Features |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public / All | Landing page presenting the PrimeRide brand, dynamic active session greeting badges (`Welcome back, Rider!` / `Welcome back, Captain!`), CTA button to login, and quick logout controls. |
| `/login` | `UserLogni.jsx` | Public (Rider) | Rider authentication portal. Validates email & password inputs, posts login credentials to Express backend, saves token/user info in `UserContext`, and displays interactive modal popups. |
| `/signup` | `UserSignup.jsx` | Public (Rider) | Rider registration form. Collects first name, last name, email, phone number, and password. Performs client & server side length and format checks before account creation. |
| `/captain-login` | `CaptionLogin.jsx` | Public (Captain) | Driver portal login page. Allows captains to authenticate with registered email/phone and password, supporting session persistence in `CaptainContext`. |
| `/captain-signup` | `CaptionSignin.jsx` | Public (Captain) | Comprehensive captain onboarding page. Captures driver details (Name, Gender, Email, Phone) as well as vehicle specifications (Vehicle Type: Bike/Car/Auto, Registration #, Color, Seating Capacity). |

---

## 🛰️ Backend Express API Routes Guide

All API endpoints are prefixed with `/api/v1`.

### 1. System Health Check
- `GET /api/v1/connectionCheck`: Returns connection status `{ message: "Backend connection successful!" }`.

---

### 2. User (Rider) Routes (`/api/v1/users`)

| Method | Endpoint | Protection | Description & Validation Rules |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Registers a new rider.<br>**Validation**: `FirstName` (min 3 chars), `LastName` (min 3 chars), `EmailId` (valid email), `PhoneNumber` (min 10 digits), `password` (min 6 chars). |
| `POST` | `/login` | Public | Authenticates existing user.<br>**Validation**: `EmailId` or `PhoneNumber` + `password` (min 6 chars). |
| `POST` | `/logout` | `verifyJWT` | Clears auth tokens and logs out user session. |
| `PATCH` | `/update-details` | `verifyJWT` | Updates rider profile details (name, email, phone number). |
| `PATCH` | `/update-password` | `verifyJWT` | Updates user password after checking `oldPassword` and `newPassword`. |
| `DELETE` | `/delete-account` | `verifyJWT` | Permanently deletes user account. |

---

### 3. Captain (Driver) Routes (`/api/v1/captains`)

| Method | Endpoint | Protection | Description & Validation Rules |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Onboards a new captain & vehicle.<br>**Validation**: `First_Name` & `Last_Name` (min 3 chars), `Gender` (`male`/`female`/`other`), `Email`, `Number` (min 10 digits), `Password` (min 6 chars), `Regrestration_Num`, `Color`, `Capacity` (min 1), `VehicleType` (`bike`/`car`/`auto`). |
| `POST` | `/login` | Public | Authenticates captain credentials via email/phone and password. |
| `POST` | `/logout` | `verifyCaptainJWT` | Clears captain authentication session. |
| `PATCH` | `/update-details` | `verifyCaptainJWT` | Updates captain personal details or vehicle specification payload. |
| `PATCH` | `/update-password` | `verifyCaptainJWT` | Updates captain account password. |
| `DELETE` | `/delete-account` | `verifyCaptainJWT` | Deletes captain account after password verification. |

---

## ⚡ State Management (Context API)

Centralized state management is implemented using React Context API at `App/src/Context/`:

1. **`UserContext` (`UserContext.jsx`)**:
   - Manages state: `user`, `isUserAuthenticated`.
   - Utility methods: `loginUser(userData)`, `logoutUser()`.
2. **`CaptainContext` (`CaptainContext.jsx`)**:
   - Manages state: `captain`, `isCaptainAuthenticated`.
   - Utility methods: `loginCaptain(captainData)`, `logoutCaptain()`.

Both context providers wrap the `BrowserRouter` tree in `main.jsx` ensuring global availability across all routes.

---

## 🚀 Getting Started & Setup Guide

### 📋 Prerequisites
- **Node.js**: v18.x or higher installed
- **npm** or **yarn**
- **MongoDB**: Local MongoDB instance running or MongoDB Atlas connection URI

---

### ⚙️ Environment Variables Setup

#### 1. Backend Server (`Server/.env`)
Create a `.env` file in the `Server` directory:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/primeride
ACCESS_TOKEN_SECRET=your_jwt_access_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_here
REFRESH_TOKEN_EXPIRY=10d
CORS_ORIGIN=http://localhost:5173
```

#### 2. Frontend App (`App/.env`)
Create a `.env` file in the `App` directory:
```env
VITE_BASEURL=http://localhost:8000
```

---

### 📦 Installation & Execution

#### Step 1: Start the Backend Server
```bash
cd Server
npm install
npm run dev
```
*Server will start listening on port `8000`.*

#### Step 2: Start the Frontend Client
```bash
cd App
npm install
npm run dev
```
*Vite dev server will start at `http://localhost:5173` (or `3000`).*

---

## 🤝 Summary

PrimeRide provides a solid foundation for ride-hailing applications with strict data validation, separated domain routes for riders and captains, and responsive mobile-first UI design. Feel free to explore [walkthrought.md](walkthrought.md) for more in-depth code snippets and implementation details!
