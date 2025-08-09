require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const connectDB = require('./config/db');
// Connect to MongoDB
connectDB();

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);

const debtRoutes = require('./routes/debtRoutes');
app.use('/api/debts', debtRoutes);

const propertyRoutes = require('./routes/propertyRoutes');
app.use('/api/properties', propertyRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
