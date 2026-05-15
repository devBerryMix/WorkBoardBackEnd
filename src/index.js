require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const leavesRoutes = require('./routes/leaves');
const attendanceRoutes = require('./routes/attendance');
const { initPool, closePool } = require('./db/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/leaves', leavesRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
async function start() {
  try {
    await initPool();
  } catch (err) {
    console.warn('Oracle DB connection failed — running with mock data:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`WorkBoard API server is running on http://localhost:${PORT}`);
  });
}

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

start();
