const express = require('express');
const {
	createMessage,
	showAllMessages,
} = require('../controller/authControls');

const router = express.Router();

router.get('/create/message', checkAuthenticated, (req, res) => {
	res.render('message');
});

router.post('/create/message', checkAuthenticated, createMessage);

router.get('/messages', showAllMessages);

function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/api/auth/login');
}

module.exports = router;
