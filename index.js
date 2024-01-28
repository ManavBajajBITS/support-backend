// index.js for support-backend
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
const supportAgentsRouter = require('./src/api/supportAgents');
const supportTicketsRouter = require('./src/api/supportTickets');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Use API routers
app.use('/api/support-agents', supportAgentsRouter);
app.use('/api/support-tickets', supportTicketsRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
