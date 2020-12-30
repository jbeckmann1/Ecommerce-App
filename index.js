const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users.js');
const users = require('./repositories/users.js');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`
    <div>
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
	else await usersRepo.create({ email, password });
	res.send('Account created!!!');
});
app.listen(3000, () => {
	console.log('listening');
});
