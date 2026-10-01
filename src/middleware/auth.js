export function authenticateTenant(req, res, next) {
  const apiKey = req.headers['authorization'];
  if (!apiKey) {
    return res.status(401).json({ error: 'Missing Authorization bearer token.' });
  }
  // Extend for tenant database key validation as needed
  next();
}
