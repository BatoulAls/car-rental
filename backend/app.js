const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working ✅');
});

// Routes
const homeRoutes = require('./routes/home');
app.use('/api/home', homeRoutes);

const carRoutes = require('./routes/car');
app.use('/api/cars', carRoutes);

const brandRoutes = require('./routes/brand');
app.use('/api/brands', brandRoutes);

const vendorRoutes = require('./routes/vendor');
app.use('/api/vendors', vendorRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const bookingRoutes = require('./routes/booking');
app.use('/api/bookings', bookingRoutes);

module.exports = app;