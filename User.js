// app.js

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Note = require('./models/Note');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/your_database_name', { useNewUrlParser: true, useUnifiedTopology: true });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(limiter);

const JWT_SECRET = 'your_secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Authentication endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json({ error: 'User not found' });

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ username: user.username, userId: user._id }, JWT_SECRET);
      res.json({ accessToken });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error during login' });
  }
});

// Note endpoints
app.get('/api/notes', authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving notes' });
  }
});

// Add the remaining endpoints (GET /api/notes/:id, POST /api/notes, PUT /api/notes/:id, DELETE /api/notes/:id, POST /api/notes/:id/share, GET /api/search?q=:query)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
