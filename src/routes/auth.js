const express = require('express');
const router = express.Router();
const { mockUsers } = require('../data/users');

// Mock accounts: password is '1234' for all users
const mockAccounts = mockUsers.map((u) => ({
  email: u.email,
  password: '1234',
  userId: u.id,
}));

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const account = mockAccounts.find((acc) => acc.email === email && acc.password === password);

  if (!account) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = mockUsers.find((u) => u.id === account.userId);

  return res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      position: user.position,
      employeeNo: user.employeeNo,
      totalLeaves: user.totalLeaves,
      usedLeaves: user.usedLeaves,
    },
  });
});

module.exports = router;
