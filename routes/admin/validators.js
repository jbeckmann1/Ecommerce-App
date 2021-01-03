const { check } = reqire('express-validator');
const usersRepo = require('../../repositories');
module.exports = {
	requireEmail                : check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) {
				throw new Error('Email in use');
			}
		}),
	requirePassword             : check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Password has to be between 4 and 20 Characters'),
	requirePasswordConfirmation : check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Password has to be between 4 and 20 Characters')
		.custom((passwordConfirmation, { req }) => {
			if (req.body.password !== passwordConfirmation) {
				throw new Error('Password must match');
			}
		})
};
