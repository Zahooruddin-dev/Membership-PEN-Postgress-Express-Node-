const path = require('node:path');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const { registerControl, loginControl,createMessage } = require('./controller/authControls');
const initializePassport = require('./passport-config');
initializePassport(
	passport,
	(email) => users.find((user) => user.email === email),
	(id) => users.find((user) => user.id === id)
);

const users = [];

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.render('index', { name: req.user?.name });
});

app.get('/users', (req, res) => {
	res.json(users);
});

app.get('/api/auth/register', async (req, res) => {
	res.render('register');
});
app.get('/api/auth/login', async (req, res) => {
	res.render('login');
});

app.post('/api/auth/register', registerControl);
app.post('/api/auth/login', loginControl);


app.get('/api/create/message', async (req, res) => {
	res.render('message');
});
app.post('/api/create/message', createMessage)





function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/api/auth/login');
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}





app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
