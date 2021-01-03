const express = require('express');
//Just the function we need
const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});
router.post(
	'/signup',
	//Sanitization and Validation with express validator
	[
		check('email').trim().normalizeEmail().isEmail().withMessage('Must be a valid email').custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error('Email in use');
			}
		}),
		check('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password has to be between 4 and 20 Characters'),
		check('passwordConfirmation')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password has to be between 4 and 20 Characters')
			.custom((passwordConfirmation, { req }) => {
				if (req.body.password !== passwordConfirmation) {
					throw new Error('Password must match');
				}
			})
	],
	async (req, res) => {
		const error = validationResult(req);
		console.log(error);
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
	res.send(signinTemplate({ req }));
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepo.getOneBy({ email });
	if (!user) {
		return res.send(" User doesn't exist");
	}
	const validPassword = await usersRepo.comparePasswords(user.password, password);
	if (!validPassword) {
		return res.send('Wrong password');
	}
	req.session.userId = user.id;
	res.send('Your logged in');
});

module.exports = router;
