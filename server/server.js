require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const paymentRoutes = require('./routes/paymentRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/payment', paymentRoutes);
app.use('/api/courses', require('./routes/courseRoute')); 

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});