// app.js

const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// JWT_SECRET and authenticateToken functions remain the same

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
