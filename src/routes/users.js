const express = require('express');
const router = express.Router();
const { mockUsers } = require('../data/users');

// GET /api/users/:userId
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const user = mockUsers.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    department: user.department,
    position: user.position,
    employeeNo: user.employeeNo,
    totalLeaves: user.totalLeaves,
    usedLeaves: user.usedLeaves,
  });
});

// GET /api/users
router.get('/', (req, res) => {
  return res.json(
    mockUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      department: u.department,
      position: u.position,
      employeeNo: u.employeeNo,
      totalLeaves: u.totalLeaves,
      usedLeaves: u.usedLeaves,
    }))
  );
});

module.exports = router;
