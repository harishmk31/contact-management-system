# Contact App - Full Stack (Node.js, Express, MongoDB, Mongoose & React)

A modern, responsive Contact Management System built with **React + Vite** on the frontend and **Node.js + Express + MongoDB + Mongoose** on the backend.

---

## 1. Architecture Overview

```
Frontend (React + Vite)  ──[Axios/JSON on :3000]──►  Backend (Express REST API on :5000)  ──►  MongoDB (contact_management)
```

- **Frontend**: React 19, Vite, Lucide React icons, Vanilla CSS custom design system (no generic frameworks).
- **Backend**: Node.js, Express, Mongoose ODM, CORS, Dotenv.
- **Database**: MongoDB (`contact_management`).

---

## 2. Project Directory Structure

```
contact-app/
├── backend:
│   ├── config/
│   │   └── db.js                 # Database connection logic
│   ├── controllers/
│   │   ├── contactController.js  # CRUD controller business logic
│   │   └── errorHandler.js       # Centralized error handler middleware
│   ├── models/
│   │   └── Contact.js            # Mongoose Schema & validation rules
│   ├── routes/
│   │   └── contactRoutes.js      # REST API route definitions
│   ├── .env                      # Backend environment variables (PORT, MONGODB_URI)
│   ├── .gitignore                # Ignores .env and node_modules
│   ├── package.json              # Backend dependencies
│   ├── server.js                 # Express server entry point (with CORS enabled)
│   └── test-api.js               # Verification script
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AddContactModal.jsx     # Modal with real-time validation for adding contacts
    │   │   ├── EditContactModal.jsx    # Modal for editing name, phone, and email
    │   │   ├── ContactDetailsModal.jsx # Read-only modal with creation timestamps & metadata
    │   │   ├── ConfirmDeleteModal.jsx  # Safety confirmation dialog before deletion
    │   │   ├── ContactTable.jsx        # Responsive table with avatar badges & actions
    │   │   ├── DashboardStats.jsx      # Summary metric cards (Total, Filtered, Status)
    │   │   ├── Navbar.jsx              # Header with server port and DB status
    │   │   ├── Sidebar.jsx             # Collapsible left navigation sidebar
    │   │   └── Toast.jsx               # Floating toast notifications (success/error)
    │   ├── services/
    │   │   └── contactService.js       # Centralized Axios API service layer
    │   ├── styles/
    │   │   └── dashboard.css           # Custom CSS design system
    │   ├── App.jsx                     # Top-level state and CRUD coordination
    │   ├── index.css                   # Global CSS reset & fonts
    │   └── main.jsx                    # React DOM entry point
    ├── package.json                    # Frontend dependencies
    └── vite.config.js                  # Vite configuration
```

---

## 3. How to Run the Application

### Step 1: Start the Backend Server (Port 5000)
```powershell
cd "c:\Users\Harish\Desktop\Full Stack Development\contact-app"
npm install
npm run dev    # or 'node server.js'
```
You should see:
```
[Server Running]: http://localhost:5000
[MongoDB Connected]: Host -> 127.0.0.1, Database -> contact_management
```

### Step 2: Start the Frontend React Application (Port 3000)
Open a second terminal window:
```powershell
cd "c:\Users\Harish\Desktop\Full Stack Development\contact-app\frontend"
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```
You should see:
```
  VITE ready in 250 ms
  ➜  Local:   http://127.0.0.1:3000/
```

### Step 3: Open in Browser
Visit **`http://127.0.0.1:3000/`** (or `http://localhost:3000/`) to use the full application.

---

## 4. API Endpoints Used by Frontend

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/contacts` | Fetch all contacts | `200` |
| `POST` | `/contacts` | Create a new contact | `201`, `400`, `409` |
| `GET` | `/contacts/:id` | Fetch contact by `contactId` or `_id` | `200`, `404` |
| `PUT` | `/contacts/:id` | Update contact by `contactId` or `_id` | `200`, `400`, `404`, `409` |
| `DELETE` | `/contacts/:id` | Delete contact by `contactId` or `_id` | `200`, `404` |

---

## 5. Key Frontend Features

1. **Dashboard & Metric Cards**: Displays real-time counts of total contacts and live filter statistics.
2. **Search by Multiple Fields**: Instant filtering by Name, Phone, Email, or Contact ID.
3. **Client-side & Server-side Validation**:
   - Phone must be exactly 10 digits (`/^\d{10}$/`).
   - Email format is checked before submission.
   - Required fields are highlighted with clear error indicators.
   - Server-side validation and duplicate errors (e.g. duplicate email/ID) are captured and displayed in an alert banner.
4. **Full CRUD Interactivity**:
   - **Add**: Form modal with validation, submit spinner, and instant table reload.
   - **View**: Details modal displaying full metadata and creation/update timestamps.
   - **Edit**: Modal allowing updates with validation checks.
   - **Delete**: Confirmation dialog displaying the contact's name and ID before deletion.
5. **Toast Notifications**: Automatic non-intrusive toasts for creation, updates, and deletion.
