const db = require('../db/quries');
const bcrypt = require('bcrypt');

async function registerControl(req, res) {
	const { username, email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await db.createUser(username, email, hashedPassword);
		console.log(
			'User registered successfully',
			username,
			email,
			hashedPassword
		);
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}
async function loginControl(req, res) {
	try {
		const { email, password } = req.body;
		const user = await db.findUserByEmail(email);
		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}
async function createMessage(req, res) {
	const { title, message } = req.body;
	if (!title || !message) {
		return res.status(400).json({ message: 'Title and message are required' });
	}
	try {
		await db.createMessage(title, message);
		console.log('Message created successfully', title, message);
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}
async function showAllMessages(req, res) {
	try {
		const messages = await db.allMessages();
		res.render('index', { messages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = {
	registerControl,
	loginControl,
	createMessage,
	showAllMessages,
};
