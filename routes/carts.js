const express = require('express');
const router = express.Router();
const productsRepo = require('../repositories/products');
const cartsRepo = require('../repositories/carts');

// Receive Post Request to add item to cart
router.post('/cart/products', async (req, res) => {
	let cart;
	if (!req.session.cartId) {
		cart = await cartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	}
	else {
		cart = await cartsRepo.getOne(req.session.cartId);
	}

	const existingItem = cart.items.find((item) => item.id === req.body.productId);
	if (existingItem) {
		existingItem.quantity++;
	}
	else {
		cart.items.push({ id: req.body.productId, quantity: 1 });
	}
	await cartsRepo.update(cart.id, {
		items : cart.items
	});
	res.send('Product added');
});
// Receive Get request to show all items in cart

//receive a post request to delete an item from a cart

module.exports = router;
