const express = require('express');
const router = express.Router();
const { mockUsers } = require('../data/users');
const { resolveRequester } = require('../middleware/requester');

function formatUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    group: u.group,
    departmentId: u.departmentId,
    department: u.department,
    position: u.position,
    employeeNo: u.employeeNo,
    totalLeaves: u.totalLeaves,
    usedLeaves: u.usedLeaves,
  };
}

// GET /api/users?requesterId=1
router.get('/', resolveRequester, (req, res) => {
  const sameDeptUsers = mockUsers
    .filter((u) => u.departmentId === req.requester.departmentId)
    .map(formatUser);

  return res.json(sameDeptUsers);
});

// GET /api/users/:userId?requesterId=1
router.get('/:userId', resolveRequester, (req, res) => {
  const target = mockUsers.find((u) => u.id === req.params.userId);

  if (!target) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (target.departmentId !== req.requester.departmentId) {
    return res.status(403).json({ error: 'Access denied: different department' });
  }

  return res.json(formatUser(target));
});

module.exports = router;
