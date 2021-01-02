const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});
router.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;
	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) {
		return res.send('Email in use');
	}
	if (password !== passwordConfirmation) {
		res.send('Password must match');
	}
	// Create a user in our user reepo to represent this person
	const user = await usersRepo.create({ email, password });

	//Store the id of that user inside the users cookie
	req.session.userId = user.id; //req.session is an object Added by cookie session which can be configured
	res.send('Account created!!!');
});

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
