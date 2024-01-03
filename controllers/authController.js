// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = 'your_secret_key';

const signup = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

module.exports = { signup, login };
