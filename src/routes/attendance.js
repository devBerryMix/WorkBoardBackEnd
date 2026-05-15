const express = require('express');
const router = express.Router();
const { resolveRequester } = require('../middleware/requester');

// userId → [{ date, checkIn?, checkOut?, status }]
const records = {};

// GET /api/attendance/user/:userId?requesterId=1&year=2026&month=05
router.get('/user/:userId', resolveRequester, (req, res) => {
  if (req.params.userId !== req.requester.id) {
    return res.status(403).json({ error: 'Access denied: you can only view your own attendance' });
  }

  const { year, month } = req.query;
  const userRecords = records[req.params.userId] || [];

  if (year && month) {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    return res.json(userRecords.filter((r) => r.date.startsWith(prefix)));
  }

  return res.json(userRecords);
});

// POST /api/attendance/checkin
// Body: { requesterId, userId }
router.post('/checkin', resolveRequester, (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  if (userId !== req.requester.id) {
    return res.status(403).json({ error: 'Access denied: you can only check in for yourself' });
  }

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const checkIn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (!records[userId]) records[userId] = [];

  const idx = records[userId].findIndex((r) => r.date === today);

  if (idx !== -1 && records[userId][idx].checkIn) {
    return res.status(409).json({ error: 'Already checked in today' });
  }

  if (idx === -1) {
    records[userId].unshift({ date: today, checkIn, status: 'present' });
  } else {
    records[userId][idx] = { ...records[userId][idx], checkIn };
  }

  return res.status(201).json(records[userId].find((r) => r.date === today));
});

module.exports = router;
