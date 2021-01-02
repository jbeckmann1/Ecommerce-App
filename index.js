const express = require('express');

const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users.js');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//Configuration Object as a string
app.use(
	cookieSession({
		keys : [ 'jhdfegjlkhdfghkj' ]
	})
);

app.use(authRouter);

app.listen(3000, () => {
	console.log('listening');
});
