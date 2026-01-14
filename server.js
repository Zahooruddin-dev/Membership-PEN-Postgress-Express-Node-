const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const LocalStrategy = require('passport-local').Strategy;

const initializePassport = require('./passport-config');
initializePassport(
	passport,
	(email) => users.find((user) => user.email === email),
	(id) => users.find((user) => user.id === id)
);

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});
const users = [];
app.get('/users', (req, res) => {
	res.json(users);
});

app.post('/api/auth/register', express.json(), (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = { username, password: hashedPassword };
	users.push(user);
	res.json(user);
});
app.post('/api/auth/login', express.json(), (req, res) => {
	const { username, password } = req.body;
	const user = users.find((u) => u.username === username);
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
