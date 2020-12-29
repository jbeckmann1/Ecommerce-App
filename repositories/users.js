const fs = require('fs');

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
		const records = await this.getAll();
		records.push(attrs);
		//rewrite
		await fs.promises.writeFile(this.filename, JSON.stringify(records));
	}
}

const test = async () => {
	const repo = new UsersRepository('users.json');
	await repo.create({ email: 'test@test.com', password: 'password' });
	const users = await repo.getAll();
	console.log(users);
};

test();
