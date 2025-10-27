const express = require('express');
const router = express.Router();
let users = [];

const generateId = () => Date.now().toString();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } else res.status(401).json({ message: 'Invalid email or password' });
});
router.post('/signup', (req, res) => {
  const { name, email, password, role = 'user' } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const newUser = { _id: generateId(), name, email, password, role };
  users.push(newUser);
  const token = Buffer.from(`${newUser._id}:${Date.now()}`).toString('base64');
  res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

module.exports = router;