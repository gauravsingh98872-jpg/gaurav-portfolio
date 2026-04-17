const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// ─── Contact Schema ───────────────────────────────────────────────
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// ✅ FIX: OverwriteModelError se bachne ke liye
const Contact =
  mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// ─── POST /api/contacts ───────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name aur Email required hain'
      });
    }

    const newContact = new Contact({ name, email, phone, location });
    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Contact save ho gaya!',
      data: newContact
    });

  } catch (err) {
    console.error('❌ Contact save error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error. Try again.'
    });
  }
});

// ─── GET /api/contacts ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: contacts
    });

  } catch (err) {
    console.error('❌ Contact fetch error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});

module.exports = router;