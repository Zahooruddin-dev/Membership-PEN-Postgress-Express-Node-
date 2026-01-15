const path = require('node:path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');

const initializePassport = require('./passport-config');
const db = require('./db/quries');

const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();

initializePassport(
	passport,
	async (email) => await db.findUserByEmail(email),
	async (id) => await db.findUserById(id)
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated, (req, res) => {
	res.render('index', { user: req.user });
});

app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);

app.delete('/logout', (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect('/api/auth/login');
	});
});

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/api/auth/login');
}

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
