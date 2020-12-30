const fs = require('fs');
const crypto = require('crypto');

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
		const records = await this.getAll();
		records.push(attrs);

		await this.writeAll(records);
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
}

const test = async () => {
	const repo = new UsersRepository('users.json');

	await repo.update('81bfargraga3', { password: 'password' });
};

test();
