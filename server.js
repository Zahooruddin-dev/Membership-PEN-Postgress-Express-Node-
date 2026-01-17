const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const jwt = require('jsonwebtoken');
const initializePassport = require('./passport-config');
const db = require('./db/quries');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const sessionSecret = process.env.SESSION_SECRET || 'secret';
const PORT = process.env.PORT || 3000;

const app = express();

initializePassport(
	passport,
	async (email) => await db.findUserByEmail(email),
	async (id) => await db.findUserById(id),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: sessionSecret,
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, async (req, res) => {
	const messages = await db.allMessages();
	res.render('index', {
		user: req.user || { username: 'Guest', membership_status: 'N/A' },
		messages: messages || [],
	});
});

app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);
app.get('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect('/api/auth/login');
	});
});

app.post('/api/posts', verifyTOken, (req, res) => {
	res.json({
		message: 'success',
	});
});

app.post('/api/login', (req, res) => {
	const user = {
		id: 1,
		username: 'test',
		email: 'josh@gmail.com',
	};
	jwt.sign({ user }, 'secret', (err, token) => {
		res.json({
			token,
		});
	});
});

function verifyTOken(req, res) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split('');
	} else {
		res.status(403).send('Forbidden');
	}
}

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/api/auth/login');
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
