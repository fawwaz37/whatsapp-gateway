const History = require("../models/history.model.js");
const { moment } = require("../../../lib/moment.js");

class HistoryMessage {
  constructor() {
    this.history = History;
  }

  async pushNewMessage(session_name, type, target, caption) {
    let date = moment().format("DD/MM/YY HH:mm:ss");
    await this.history.create({ session_name, target, type, date, caption });
  }

  async getAllMessage() {
    const result = await this.history.findAll();
    return result;
  }

  async deleteHistory(id) {
    const find = await this.history.findByPk(id);
    if (find) {
      await find.destroy();
    }
  }

  async deleteAllHistory() {
    await this.history.destroy({ truncate: true });
  }
}

module.exports = HistoryMessage;
