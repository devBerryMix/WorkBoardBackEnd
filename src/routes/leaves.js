const express = require('express');
const router = express.Router();
const { mockLeaveRequests } = require('../data/leaves');
const { mockUsers } = require('../data/users');
const { resolveRequester } = require('../middleware/requester');

let leaves = JSON.parse(JSON.stringify(mockLeaveRequests));
let nextId = Math.max(...leaves.map((l) => parseInt(l.id))) + 1;

function deptUserIds(departmentId) {
  return new Set(mockUsers.filter((u) => u.departmentId === departmentId).map((u) => u.id));
}

// GET /api/leaves?requesterId=1
router.get('/', resolveRequester, (req, res) => {
  const allowed = deptUserIds(req.requester.departmentId);
  return res.json(leaves.filter((l) => allowed.has(l.userId)));
});

// GET /api/leaves/user/:userId?requesterId=1  (본인 데이터만 허용)
router.get('/user/:userId', resolveRequester, (req, res) => {
  if (req.params.userId !== req.requester.id) {
    return res.status(403).json({ error: 'Access denied: you can only view your own leaves' });
  }

  return res.json(leaves.filter((l) => l.userId === req.params.userId));
});

// GET /api/leaves/month/:year/:month?requesterId=1&targetDepartmentId=D002
router.get('/month/:year/:month', resolveRequester, (req, res) => {
  const { year, month } = req.params;
  const monthStr = String(month).padStart(2, '0');
  const yearMonth = `${year}-${monthStr}`;
  const targetDeptId = req.query.targetDepartmentId || req.requester.departmentId;
  const allowed = deptUserIds(targetDeptId);

  const monthLeaves = leaves.filter(
    (l) =>
      l.status === 'approved' &&
      allowed.has(l.userId) &&
      ((l.startDate.startsWith(yearMonth) && l.startDate <= `${yearMonth}-31`) ||
        (l.endDate.startsWith(yearMonth) && l.endDate >= `${yearMonth}-01`))
  );

  const result = {};

  monthLeaves.forEach((leave) => {
    const user = mockUsers.find((u) => u.id === leave.userId);
    if (!user) return;

    const addToDate = (dateStr) => {
      if (!dateStr.startsWith(yearMonth)) return;
      if (!result[dateStr]) result[dateStr] = [];
      if (!result[dateStr].find((m) => m.userId === user.id)) {
        result[dateStr].push({ userId: user.id, name: user.name, department: user.department });
      }
    };

    addToDate(leave.startDate);

    if (leave.startDate !== leave.endDate) {
      const current = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      while (current < end) {
        current.setDate(current.getDate() + 1);
        addToDate(current.toISOString().split('T')[0]);
      }
    }
  });

  return res.json(result);
});

// POST /api/leaves
// Body: { requesterId, userId, startDate, endDate, reason }
router.post('/', resolveRequester, (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;

  if (!userId || !startDate || !endDate || !reason) {
    return res.status(400).json({ error: 'userId, startDate, endDate, and reason are required' });
  }

  if (userId !== req.requester.id) {
    return res.status(403).json({ error: 'Access denied: you can only submit leaves for yourself' });
  }

  const target = mockUsers.find((u) => u.id === userId);
  if (!target) {
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
