const express = require('express');
const bcrypt = require('bcrypt');
const app = express();

const users = [];
app.get('/users', (req, res) => {
	res.json(users);
});

app.post('/register', express.json(), (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = { username, password: hashedPassword };
	users.push(user);
	res.json(user);
});
app.post('/login', express.json(), (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  res.json({ message: 'Login successful' });
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
