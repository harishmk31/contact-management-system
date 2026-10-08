const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./controllers/errorHandler");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ==============================
// HEALTH CHECK
// ==============================

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running"
    });
});


// ==============================
// API WELCOME
// ==============================

app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Contact Management System API",
        endpoints: {
            getAllContacts: "GET /contacts",
            getContactById: "GET /contacts/:id",
            createContact: "POST /contacts",
            updateContact: "PUT /contacts/:id",
            deleteContact: "DELETE /contacts/:id"
        }
    });
});


// ==============================
// CONTACT API ROUTES
// ==============================

app.use("/contacts", contactRoutes);


// ==============================
// REACT FRONTEND
// ==============================

const frontendPath = path.join(
    __dirname,
    "frontend",
    "dist"
);

// Serve React static files
app.use(express.static(frontendPath));


// ==============================
// REACT SPA FALLBACK
// ==============================

app.get("*", (req, res) => {

    res.sendFile(
        path.join(frontendPath, "index.html"),
        (error) => {

            if (error) {
                res.status(404).send(
                    "Frontend build not found. Run npm run build inside frontend."
                );
            }

        }
    );

});


// ==============================
// ERROR HANDLER
// ==============================

app.use(errorHandler);


// ==============================
// START SERVER
// ==============================

const server = app.listen(
    PORT,
    HOST,
    () => {

        console.log("=================================");
        console.log("Contact Management System");
        console.log("=================================");
        console.log(`Server running on ${HOST}:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/health`);
        console.log(`API: http://localhost:${PORT}/api`);
        console.log("=================================");

    }
);


// ==============================
// MONGODB CONNECTION
// ==============================

connectDB()
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:");
        console.error(error.message);

        console.log(
            "Server will continue running, but database operations may not work."
        );
    });


// ==============================
// ERROR HANDLING
// ==============================

process.on("unhandledRejection", (err) => {

    console.error(
        `[Unhandled Rejection]: ${err.message}`
    );

});

process.on("uncaughtException", (err) => {

    console.error(
        `[Uncaught Exception]: ${err.message}`
    );

});


// ==============================
// EXPORT
// ==============================

module.exports = app;