const express = require('express');
const passport = require('passport');
const {
	registerControl,
} = require('../controller/authControls');

const router = express.Router();

router.get('/register', checkNotAuthenticated, (req, res) => {
	res.render('register');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
	res.render('login', { error: req.flash('error') });
});


router.post('/register', checkNotAuthenticated, registerControl);

router.post(
	'/login',
	checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/api/auth/login',
		failureFlash: true,
	})
);

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}

module.exports = router;
