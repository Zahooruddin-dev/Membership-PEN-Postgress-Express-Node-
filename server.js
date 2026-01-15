const path = require('node:path');
const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const {
	registerControl,
	loginControl,
	createMessage,
	showAllMessages,
} = require('./controller/authControls');
const db = require('./db/quries');
const initializePassport = require('./passport-config');
initializePassport(
	passport,
	async (email) => {
		const user = await db.findUserByEmail(email);
		return user;
	},
	async (id) => {
		const user = await db.findUserById(id);
		return user;
	}
);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res) => {
	res.render('index', { name: req.user?.name });
});

app.get('/users', (req, res) => {
	res.json(users);
});

app.get('/api/auth/register', checkNotAuthenticated, async (req, res) => {
	res.render('register');
});
app.get('/api/auth/login', checkNotAuthenticated, async (req, res) => {
	res.render('login');
});

app.post('/api/auth/register', checkNotAuthenticated, registerControl);
app.post(
	'/api/auth/login',
	checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/api/auth/login',
		failureFlash: true,
	})
);

app.get('/api/create/message', async (req, res) => {
	res.render('message');
});
app.post('/api/create/message', createMessage);

app.get('/messages', showAllMessages);

app.delete('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/login');
	});
});

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
