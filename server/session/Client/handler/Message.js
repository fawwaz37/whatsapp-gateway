const { AutoReply, ButtonResponse, ListResponse } = require("../../../database/db/messageRespon.db.js");
const Client = require("./Client.js");
const Serialize = require("./Serialize.js");

module.exports = class Message extends Serialize {
  constructor(client, msg, session_name) {
    super();
    this.session = session_name;
    this.client = client;
    this.msg = msg.messages;
    this.type = msg.type;
  }

  async mainHandler() {
    try {
      if (!this.msg) return;
      const message = this.msg[0];
      if (message.key && message.key.remoteJid === "status@broadcast") return;
      if (!message.message) return;
      const m = await this.serial(this.client, message);

      const bot = new Client(this.client, m.from);
      const CMD = m.command ? m.command : null;
      if (!CMD) return this.messageHandler(m, bot);
    } catch (error) {
      console.log(error);
    }
  }

  async messageHandler(m, bot) {
    const buttonResponse = new ButtonResponse();
    const listResponse = new ListResponse();
    const replyResponse = new AutoReply();

    const keywordReply = await replyResponse.checkMessageUser(m.botNumber, m.body);
    const keywordButton = await buttonResponse.checkKeyword(m.body, m.from);
    const keywordList = await listResponse.checkKeyword(m.body, m.from);

    if (keywordButton) {
      await bot.reply(keywordButton.response, m.msg);
      return await buttonResponse.deleteKeyword(keywordButton.msg_id, keywordButton.keyword);
    } else if (keywordList) {
      await bot.reply(keywordList.response, m.msg);
    } else if (keywordReply) {
      await bot.reply(keywordReply.response, m.msg);
    }
    if (m.body == "Bot") {
      return bot.reply(`Yes Sir..`, m.msg);
    } else if (m.body == "Test") {
      await bot.reply("Okee", m.msg);
    }
  }
};
