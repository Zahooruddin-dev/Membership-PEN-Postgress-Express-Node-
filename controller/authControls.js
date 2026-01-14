const db = require('../db/pools');
const bcrypt = require('bcrypt');

async function registerControl(req, res) {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: 'Email and password are required' });
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		await db.registerControl(email, hashedPassword);
		res.status(201).json({ message: 'User registered successfully' });
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
		res.json({ message: 'Login successful' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
}

module.exports = {
	registerControl,
	loginControl,
};
