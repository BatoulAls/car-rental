const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// const helloRoutes = require('./routes/hello');
// app.use('/api/hello', helloRoutes);

module.exports = app;