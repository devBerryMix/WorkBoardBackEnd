const { mockUsers } = require('../data/users');

// Resolves requesterId from query (GET) or body (POST/PUT)
// and attaches req.requester so route handlers can use it.
function resolveRequester(req, res, next) {
  const requesterId = req.query.requesterId ?? req.body?.requesterId;

  if (!requesterId) {
    return res.status(400).json({ error: 'requesterId is required' });
  }

  const requester = mockUsers.find((u) => u.id === requesterId);
  if (!requester) {
    return res.status(404).json({ error: 'Requester not found' });
  }

  req.requester = requester;
  next();
}

module.exports = { resolveRequester };
