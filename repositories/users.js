const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
	//check if there is already a file/Create one
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a repository requires a filename');
		}
		try {
			this.filename = filename;
			fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}
	async getAll() {
		// OPen the file calls this.filename
		// Read its contents
		// Parse the contents
		//Return the parsed data
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding : 'utf8'
			})
		);
	}
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

	async writeAll(records) {
		//rewrite the file and formatting it
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}
	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}
	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}
	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) {
			throw new error(`Record with id ${id} not found`);
		}
		//Update the records with attrs
		Object.assign(record, attrs);
		await this.writeAll(records);
	}
	async getOneBy(filters) {
		const records = await this.getAll();

		for (let record of records) {
			let found = true;
			//looping through an object -> for in Loop(for every key)
			for (let key in filters) {
				if (record[key] !== filters[key]) {
					found = false;
				}
			}
			if (found) {
				return record;
			}
		}
	}
}
//export an instance and not just the class
module.exports = new UsersRepository('users.json');
// just const in other file and methods can be used
