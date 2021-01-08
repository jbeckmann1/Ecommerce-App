const express = require('express');

const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users.js');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const AdminProductsRouter = require('./routes/admin/products');
const productsRouter = require('./routes/products');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
//Configuration Object as a string
app.use(
	cookieSession({
		keys : [ 'jhdfegjlkhdfghkj' ]
	})
);

app.use(authRouter);
app.use(AdminProductsRouter);
app.use(productsRouter);

app.listen(3000, () => {
	console.log('listening');
});
