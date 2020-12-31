const express = require('express');

const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users.js');
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//Configuration Object as a string
app.use(
	cookieSession({
		keys : [ 'jhdfegjlkhdfghkj' ]
	})
);

app.get('/', (req, res) => {
	res.send(`
    <div>
    Your Id is: ${req.session.userId}
    <form method="POST">
    <input name="email" placeholder="email" />
    <input name="password" placeholder="password" />
    <input name="passwordConfirmation" placeholder="Confirm password" />
    <button> Sign Up</button>
    </form>
    `);
});
app.post('/', async (req, res) => {
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
app.listen(3000, () => {
	console.log('listening');
});
