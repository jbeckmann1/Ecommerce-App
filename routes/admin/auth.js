const express = require('express');
//Just the function we need
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requirePasswordMatch
} = require('./validators');
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});
router.post(
	'/signup',
	//Sanitization and Validation with express validator
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.send(signupTemplate({ req, errors }));
			console.log('In');
		}
		const { email, password, passwordConfirmation } = req.body;
		// Create a user in our user reepo to represent this person
		const user = await usersRepo.create({ email, password });
		//Store the id of that user inside the users cookie
		req.session.userId = user.id; //req.session is an object Added by cookie session which can be configured
		res.send('Account created!!!');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/signin');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post('/signin', [ requireEmailExists, requirePasswordMatch ], async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.send(signinTemplate({ req, errors }));
	}

	const { email } = req.body;
	const user = await usersRepo.getOneBy({ email });
	req.session.userId = user.id;
	res.send('Your logged in');
});

module.exports = router;
