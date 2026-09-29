# Server API Routes Documentation

This document provides a comprehensive overview of all API routes created in the **Uber Clone Server**.

---

## 📌 Base URL
`http://localhost:<PORT>/api/v1`

---

## 🟢 1. Health & Connection Route

### `GET /api/v1/connectionCheck`
- **Description:** Health check endpoint to verify backend connection status.
- **Authentication Required:** No
- **Request Body:** None
- **Response Example:**
  ```json
  {
    "message": "Backend connection successful!"
  }
  ```

---

## 👤 2. User Routes (`/api/v1/users`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| **POST** | `/register` | ❌ No | Register a new user/rider account |
| **POST** | `/login` | ❌ No | Authenticate user via Email or Phone Number |
| **GET** | `/profile` | 🔐 Yes (`JWT`) | Fetch profile details of logged-in user |
| **POST** | `/logout` | 🔐 Yes (`JWT`) | Log out user, invalidate refresh token, & clear cookies |
| **PATCH** | `/update-details` | 🔐 Yes (`JWT`) | Update user profile info (name, email, phone) |
| **PATCH** | `/update-password` | 🔐 Yes (`JWT`) | Update account password |
| **DELETE**| `/delete-account` | 🔐 Yes (`JWT`) | Permanently delete user account |

---

### Detailed Endpoint Specification: User Routes

#### 1. `POST /api/v1/users/register`
- **Description:** Creates a new rider account.
- **Validation Rules:**
  - `FirstName`: String (min 3 chars)
  - `LastName`: String (min 3 chars)
  - `EmailId`: Valid Email string
  - `PhoneNumber`: String (min 10 digits)
  - `password`: String (min 6 chars)
- **Success Response (201 Created):** Returns user object and access token.

#### 2. `POST /api/v1/users/login`
- **Description:** Authenticates user and sets HTTP-only cookies (`accessToken`, `refreshToken`).
- **Validation Rules:**
  - `EmailId`: Optional (Valid Email string)
  - `PhoneNumber`: Optional (min 10 digits)
  - `password`: String (min 6 chars)
- **Success Response (200 OK):** Returns user object, `accessToken`, and `refreshToken`.

#### 3. `GET /api/v1/users/profile`
- **Description:** Retrieves the authenticated user's profile information.
- **Header/Cookie:** `Authorization: Bearer <token>` or `accessToken` cookie.
- **Success Response (200 OK):** Returns user profile object without password.

#### 4. `POST /api/v1/users/logout`
- **Description:** Unsets stored Refresh Token from DB and clears auth cookies.
- **Header/Cookie:** `Authorization: Bearer <token>` or `accessToken` cookie.
- **Success Response (200 OK):** Returns success message.

#### 5. `PATCH /api/v1/users/update-details`
- **Description:** Updates FirstName, LastName, EmailId, or PhoneNumber.
- **Validation Rules:** Optional field validation; direct password modification blocked.
- **Success Response (200 OK):** Returns updated user object.

#### 6. `PATCH /api/v1/users/update-password`
- **Description:** Changes user password after validating the old password.
- **Validation Rules:**
  - `oldPassword`: String (min 6 chars)
  - `newPassword`: String (min 6 chars)
- **Success Response (200 OK):** Returns password updated confirmation.

#### 7. `DELETE /api/v1/users/delete-account`
- **Description:** Permanently removes user account from database and clears cookies.
- **Header/Cookie:** `Authorization: Bearer <token>` or `accessToken` cookie.
- **Success Response (200 OK):** Returns deletion confirmation message.

---

## 🚘 3. Captain (Driver) Routes (`/api/v1/captains`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| **POST** | `/register` | ❌ No | Register a new driver/captain with vehicle details |
| **POST** | `/login` | ❌ No | Authenticate captain via Email or Phone Number |
| **GET** | `/profile` | 🔐 Yes (`Captain JWT`) | Fetch profile & vehicle details of logged-in captain |
| **POST** | `/logout` | 🔐 Yes (`Captain JWT`) | Log out captain & clear auth cookies |
| **PATCH** | `/update-details` | 🔐 Yes (`Captain JWT`) | Update captain profile or vehicle details |
| **PATCH** | `/update-password` | 🔐 Yes (`Captain JWT`) | Update captain account password |
| **DELETE**| `/delete-account` | 🔐 Yes (`Captain JWT`) | Permanently delete captain account |

---

### Detailed Endpoint Specification: Captain Routes

#### 1. `POST /api/v1/captains/register`
- **Description:** Registers a new captain along with their vehicle details.
- **Validation Rules:**
  - `First_Name`: String (min 3 chars)
  - `Last_Name`: String (min 3 chars)
  - `Gender`: Allowed values: `"male"`, `"female"`, `"other"`
  - `Number`: String (min 10 digits)
  - `Email`: Valid Email string
  - `Password`: String (min 6 chars)
  - `Regrestration_Num`: Required string (Vehicle registration number)
  - `Color`: Required string (Vehicle color)
  - `Capacity`: Integer (min 1)
  - `VehicleType`: Allowed values: `"bike"`, `"car"`, `"auto"`
- **Success Response (201 Created):** Returns captain object and access token.

#### 2. `POST /api/v1/captains/login`
- **Description:** Authenticates captain and sets HTTP-only cookies (`accessToken`, `refreshToken`).
- **Validation Rules:**
  - `Email`: Optional (Valid Email string)
  - `Number`: Optional (min 10 digits)
  - `Password`: String (min 6 chars)
- **Success Response (200 OK):** Returns captain object, `accessToken`, and `refreshToken`.

#### 3. `GET /api/v1/captains/profile`
- **Description:** Retrieves the logged-in captain's profile and vehicle specifications.
- **Header/Cookie:** `Authorization: Bearer <token>` or `accessToken` cookie.
- **Success Response (200 OK):** Returns captain profile data.

#### 4. `POST /api/v1/captains/logout`
- **Description:** Clears captain authentication cookies (`accessToken`, `refreshToken`).
- **Header/Cookie:** `Authorization: Bearer <token>` or `accessToken` cookie.
- **Success Response (200 OK):** Returns logout success message.

#### 5. `PATCH /api/v1/captains/update-details`
- **Description:** Updates nested `Caption_Details` or `Vehicle` parameters.
- **Validation Rules:** Validates nested field formats; password changes forbidden on this route.
- **Success Response (200 OK):** Returns updated captain object.

#### 6. `PATCH /api/v1/captains/update-password`
- **Description:** Updates the captain's account password.
- **Validation Rules:**
  - `oldPassword`: String (min 6 chars)
  - `newPassword`: String (min 6 chars)
- **Success Response (200 OK):** Returns success message.

#### 7. `DELETE /api/v1/captains/delete-account`
- **Description:** Deletes captain profile after password verification.
- **Validation Rules:**
  - `Password`: String (min 6 chars)
- **Success Response (200 OK):** Returns account deletion message.

---

## 🔒 Authentication & Middleware Summary

- **User Authentication Middleware:** `verifyJWT` ([auth.middleware.js](file:///c:/Users/admin/Desktop/WebDevFinal/Project/The%20Uber%20Clone/Server/src/middleware/auth.middleware.js#L7-L28))
  - Extracts JWT token from `req.cookies.accessToken` or `Authorization: Bearer <token>`.
  - Attaches user object to `req.user`.

- **Captain Authentication Middleware:** `verifyCaptainJWT` ([auth.middleware.js](file:///c:/Users/admin/Desktop/WebDevFinal/Project/The%20Uber%20Clone/Server/src/middleware/auth.middleware.js#L30-L51))
  - Extracts JWT token from `req.cookies.accessToken` or `Authorization: Bearer <token>`.
  - Attaches captain object to `req.captain`.
