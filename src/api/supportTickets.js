// api/supportTickets.js
const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const SupportAgent = require('../models/SupportAgent');

// Function to get the index of the next active agent in round-robin fashion
async function getNextAgentIndex() {
  try {
    const lastAssignedTicket = await SupportTicket.findOne({}, {}, { sort: { 'dateCreated': -1 } });

    if (!lastAssignedTicket) {
      // If no ticket has been assigned yet, start from the first agent
      return 0;
    }

    const lastAssignedAgentId = lastAssignedTicket.assignedAgent;

    // Get all active agents
    const activeAgents = await SupportAgent.find({ active: true });

    // Find the index of the last assigned agent
    const lastAssignedAgentIndex = activeAgents.findIndex(agent => agent._id.equals(lastAssignedAgentId));

    // Calculate the index of the next active agent in round-robin fashion
    const nextAgentIndex = (lastAssignedAgentIndex + 1) % activeAgents.length;

    return nextAgentIndex;
  } catch (error) {
    console.error('Error getting next agent index:', error);
    throw error;
  }
}

router.post('/', async (req, res) => {
  try {
    const { topic, description, severity, type } = req.body;

    // Get all active agents
    const activeAgents = await SupportAgent.find({ active: true });

    if (activeAgents.length === 0) {
      return res.status(400).json({ message: 'No active agents available' });
    }

    // Find the next active agent based on round-robin assignment
    const nextAgentIndex = await getNextAgentIndex();

    // Assign the ticket to the next active agent
    const assignedAgent = activeAgents[nextAgentIndex]._id;

    // Create the ticket with assigned agent and status 'assigned'
    const newTicket = new SupportTicket({
      topic,
      description,
      severity,
      type,
      assignedAgent,
      status: 'Assigned', // Set status as 'Assigned'
    });

    // Save the ticket
    const savedTicket = await newTicket.save();

    res.json(savedTicket);
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    let query = SupportTicket.find();

    // Add population to include assigned agent's details
    query = query.populate('assignedAgent', 'name email');

    // Filter
    if (req.query.status) {
      query = query.where('status').equals(req.query.status);
    }
    if (req.query.assignedTo) {
      query = query.where('assignedTo').equals(req.query.assignedTo);
    }
    if (req.query.severity) {
      query = query.where('severity').equals(req.query.severity);
    }
    if (req.query.type) {
      query = query.where('type').equals(req.query.type);
    }

    // Sort
    if (req.query.sortBy === 'resolvedOn') {
      query = query.sort({ resolvedOn: req.query.sortDirection === 'desc' ? -1 : 1 });
    } else if (req.query.sortBy === 'dateCreated') {
      query = query.sort({ dateCreated: req.query.sortDirection === 'desc' ? -1 : 1 });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await SupportTicket.countDocuments();
    const tickets = await query.limit(limit).skip(startIndex).exec();

    const pagination = {
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalItems: total,
    };

    res.json({ tickets, pagination });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;