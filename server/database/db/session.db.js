import Session from "../models/session.model.js";

class SessionDatabase {
	constructor() {
		this.session = Session;
	}

	async createSessionDB(session_name, session_number) {
		console.log(session_name, session_number);
		await this.session.create({ session_name, session_number, status: "CONNECTED" });
	}

	async deleteSessionDB(session_name) {
		const sesi = await this.session.findOne({ where: { session_name } });
		if (sesi) {
			sesi.destroy();
		}
	}

	async findOneSessionDB(session_name) {
		const sesi = await this.session.findOne({ where: { session_name } });
		if (sesi) {
			return sesi;
		} else {
			return false;
		}
	}

	async findAllSessionDB() {
		const array = await this.session.findAll();
		if (Array.isArray(array) && array.length !== 0) {
			return array;
		}
	}

	async updateStatusSessionDB(session_name, status) {
		const sesi = await this.session.findOne({ where: { session_name } });
		if (sesi) {
			await sesi.update({ status });
		}
	}

	async startProgram() {
		const array = await this.session.findAll();
		if (Array.isArray(array) && array.length !== 0) {
			array.map(async (value) => {
				value.status = "STOPPED";
				await this.session.update(
					{ status: "STOPPED" },
					{
						where: {
							session_name: value.session_name,
						},
					}
				);
			});
		}
	}
}

export default SessionDatabase;
