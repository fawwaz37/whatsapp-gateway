const fs = require("fs");
const express = require("express");
const SessionDatabase = require("../../database/db/session.db.js");
const { AutoReply } = require("../../database/db/messageRespon.db.js");
const HistoryMessage = require("../../database/db/history.db.js");
const router = express.Router();

const { SESSION_PATH, LOG_PATH } = process.env;

const db = new SessionDatabase();

router.get("/", async (req, res) => {
  let sessionCheck = fs.readdirSync(SESSION_PATH).filter((x) => x != "store")[0];
  let session_name = sessionCheck ? sessionCheck : null;
  let loggerPath = fs.existsSync(`${LOG_PATH}/${session_name}.txt`) ? `${LOG_PATH.replace("./public/", "")}/${session_name}.txt` : null;
  const session = session_name ? await db.findOneSessionDB(session_name) : null;
  res.render("dashboard/dashboard", {
    loggerPath,
    session,
    session_name,
    layout: "layouts/main",
  });
});

router.get("/send-message", async (req, res) => {
  const session = await db.findAllSessionDB();
  res.render("dashboard/sendMessage", {
    session,
    layout: "layouts/main",
  });
});

router.get("/auto-reply", async (req, res) => {
  const session = await db.findAllSessionDB();
  const replyList = await new AutoReply().checkReplyMessage();
  res.render("dashboard/autoReply", {
    session,
    replyList,
    layout: "layouts/main",
  });
});

router.get("/api-doc", async (req, res) => {
  res.render("dashboard/apidoc", {
    layout: "layouts/main",
  });
});

router.get("/history-message", async (req, res) => {
  let db = await new HistoryMessage().getAllMessage();
  res.render("dashboard/history", {
    layout: "layouts/main",
    db,
  });
});

module.exports = router;
