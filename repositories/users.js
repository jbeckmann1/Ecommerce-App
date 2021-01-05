const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);
//Copy paste repository into the users repository
class UsersRepository extends Repository {
	//check if there is already a file/Create one
	async create(attrs) {
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		// Hashed password
		const buffer = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();
		const record = {
			//Take all the existing propertys put of the existing attributes object
			...attrs,
			//Overwrite the password with the hashed and saltet password
			password : `${buffer.toString('hex')}.${salt}`
		};
		records.push(record);

		await this.writeAll(records);
		return record;
	}
	async comparePasswords(saved, supplied) {
		//Splitting the password and salt and assigning the parts of the array into consts
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
		return hashed === hashedSuppliedBuf.toString('hex');
	}
}
//export an instance and not just the class
module.exports = new UsersRepository('users.json');
// just const in other file and methods can be used
