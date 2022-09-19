import { AutoReply } from "../../../database/db/messageRespon.db.js";

export default class AutoReplyController extends AutoReply {
	constructor() {
		super();
	}

	async createReply(req, res) {
		try {
			let { session, keyword, respon } = req.body;
			if (!session && !keyword && !respon) {
				return res.send({ status: 400, message: `Input Data Keyword & Response` });
			}
			let session_number = session.split(" (+")[1].replace(")", "").trim();
			let session_name = session.split(" (")[0];
			let check = await this.checkExistAutoReply(session_number, keyword);
			if (check) {
				return res.send({ status: 403, message: `Cannot Create Auto Reply With Keyword ${keyword} Again in Same Session ${session_number}` });
			} else {
				await this.createAutoReply(session_name, session_number, keyword, respon);
				return res.send({ status: 200, message: `Success Add Auto Reply With Keyword ${keyword}` });
			}
		} catch (error) {
			console.log(error);
			res.send({ status: 500, message: "Internal Server Error!" });
		}
	}

	async editReply(req, res) {
		try {
			let { session, keyword, newRespon, newKeyword } = req.body;
			if (!session && !keyword && !newRespon && !newKeyword) {
				return res.send({ status: 400, message: `Input Data Keyword & Response` });
			}
			await this.editReplyMessage(session, keyword, newKeyword, newRespon);
			return res.send({ status: 200, message: `Success Edit Auto Reply ${keyword} With Keyword ${newKeyword}` });
		} catch (error) {
			console.log(error);
			res.send({ status: 500, message: "Internal Server Error!" });
		}
	}

	async deleteReply(req, res) {
		try {
			let { session, keyword } = req.query;
			if (!session && !keyword) {
				return res.send({ status: 400, message: `Input Data!` });
			}
			await this.deleteReplyMessage(session, keyword);
			return res.send({ status: 200, message: `Success Delete Auto Reply With Keyword ${keyword}` });
		} catch (error) {
			console.log(error);
			res.send({ status: 500, message: "Internal Server Error!" });
		}
	}

	async deleteAllReply(req, res) {
		try {
			await this.deleteAllKeyword();
			return res.send({ status: 200, message: `Success Delete All Keyword Auto Reply` });
		} catch (error) {
			console.log(error);
			res.send({ status: 500, message: "Internal Server Error!" });
		}
	}
}
