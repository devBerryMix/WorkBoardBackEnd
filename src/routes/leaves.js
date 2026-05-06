const express = require('express');
const router = express.Router();
const { mockLeaveRequests } = require('../data/leaves');
const { mockUsers } = require('../data/users');

let leaves = JSON.parse(JSON.stringify(mockLeaveRequests));
let nextId = Math.max(...leaves.map((l) => parseInt(l.id))) + 1;

// GET /api/leaves
router.get('/', (req, res) => {
  return res.json(leaves);
});

// GET /api/leaves/user/:userId
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  const userLeaves = leaves.filter((l) => l.userId === userId);

  return res.json(userLeaves);
});

// GET /api/leaves/month/:year/:month - Get leaves for a specific month (for calendar view)
router.get('/month/:year/:month', (req, res) => {
  const { year, month } = req.params;
  const monthStr = String(month).padStart(2, '0');
  const yearMonth = `${year}-${monthStr}`;

  const monthLeaves = leaves.filter(
    (l) =>
      l.status === 'approved' &&
      ((l.startDate.startsWith(yearMonth) && l.startDate <= `${yearMonth}-31`) ||
        (l.endDate.startsWith(yearMonth) && l.endDate >= `${yearMonth}-01`))
  );

  const teamLeaveMembers = {};

  monthLeaves.forEach((leave) => {
    const user = mockUsers.find((u) => u.id === leave.userId);
    if (user) {
      if (!teamLeaveMembers[leave.startDate]) {
        teamLeaveMembers[leave.startDate] = [];
      }
      if (!teamLeaveMembers[leave.startDate].find((m) => m.userId === user.id)) {
        teamLeaveMembers[leave.startDate].push({
          userId: user.id,
          name: user.name,
          department: user.department,
        });
      }

      if (leave.startDate !== leave.endDate) {
        const start = new Date(leave.startDate);
        const end = new Date(leave.endDate);
        const current = new Date(start);

        while (current < end) {
          current.setDate(current.getDate() + 1);
          const dateStr = current.toISOString().split('T')[0];
          if (dateStr.startsWith(yearMonth)) {
            if (!teamLeaveMembers[dateStr]) {
              teamLeaveMembers[dateStr] = [];
            }
            if (!teamLeaveMembers[dateStr].find((m) => m.userId === user.id)) {
              teamLeaveMembers[dateStr].push({
                userId: user.id,
                name: user.name,
                department: user.department,
              });
            }
          }
        }
      }
    }
  });

  return res.json(teamLeaveMembers);
});

// POST /api/leaves - Create a new leave request
router.post('/', (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;

  if (!userId || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: 'userId, startDate, endDate, and reason are required' });
  }

  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newLeave = {
    id: String(nextId++),
    userId,
    startDate,
    endDate,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
  };

  leaves.push(newLeave);

  return res.status(201).json(newLeave);
});

module.exports = router;
