// api/supportAgents.js
const express = require('express');
const router = express.Router();
const SupportAgent = require('../models/SupportAgent');

router.post('/', async (req, res) => {
    try {
      const { name, email, phone, description, active, dateCreated } = req.body;
      const newAgent = new SupportAgent({
        name,
        email,
        phone,
        description,
        active,
        dateCreated,
      });
      const savedAgent = await newAgent.save();
      res.json(savedAgent);
    } catch (error) {
      console.error('Error creating support agent:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;