const db = require('../db/quries');
const bcrypt = require('bcrypt');

async function registerControl(req, res) {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.render('register', {
			error: 'All fields are required',
		});
	}

	try {
		const existingUser = await db.findUserByEmail(email);
		if (existingUser) {
			return res.render('register', {
				error: 'Email already registered',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await db.createUser(username, email, hashedPassword);

		return res.redirect('/api/auth/login');
	} catch (error) {
		console.error(error);
		return res.render('register', {
			error: 'Registration failed',
		});
	}
}

async function loginControl(req, res) {
	return res.redirect('/');
}

async function createMessage(req, res) {
	const { title, message } = req.body;
	if (!title || !message) {
		return res.status(400).json({ message: 'Title and message are required' });
	}
	try {
		const userId = req.user.id; // add this
		await db.createMessage(title, message, userId);
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

async function showAllMessages(req, res) {
	try {
		const messages =
			req.user.membership_status === 'Premium'
				? await db.allMessages()
				: await db.premiumMessages();

		return res.render('index', {
			user: req.user,
			messages,
		});
	} catch (error) {
		console.error(error);
		return res.render('index', {
			user: req.user,
			messages: [],
		});
	}
}

module.exports = {
	registerControl,
	loginControl,
	createMessage,
	showAllMessages,
};
