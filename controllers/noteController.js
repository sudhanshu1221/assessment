// controllers/noteController.js

const Note = require('../models/Note');

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving notes' });
  }
};

// Implement the remaining functions for noteController (getNoteById, createNote, updateNote, deleteNote, shareNote, searchNotes)

module.exports = { getAllNotes };
