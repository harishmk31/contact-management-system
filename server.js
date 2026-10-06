const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./controllers/errorHandler');

// 1. Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB
connectDB();

// 3. Initialize Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for frontend clients
app.use(cors());

// 4. Built-in Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Health check / welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Contact Management System API',
    endpoints: {
      getAllContacts: 'GET /contacts',
      getContactById: 'GET /contacts/:id',
      createContact: 'POST /contacts',
      updateContact: 'PUT /contacts/:id',
      deleteContact: 'DELETE /contacts/:id',
    },
  });
});

// 6. Mount API routes
app.use('/contacts', contactRoutes);

// 7. Handle 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route Not Found`,
  });
});

// 8. Mount centralized error handling middleware (must be last)
app.use(errorHandler);

// 9. Start the HTTP server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server Running]: http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (e.g. database down during runtime)
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
