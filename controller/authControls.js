


async function registerControl(req, res) {
	const { username, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	const user = { username, password: hashedPassword };
	users.push(user);
	res.json(user);
}
async function loginControl(req, res) {
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
}

module.exports = {
	registerControl,
	loginControl,
};
