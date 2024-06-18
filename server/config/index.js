require("dotenv/config");
const { modules } = require("../../lib/index.js");
const SessionDatabase = require("../database/db/session.db.js");
const ConnectionSession = require("../session/Session.js");
const App = require("./App.js");
const { connectDatabase } = require("./Database.js");
const { moment } = require("../../lib/moment.js");
const Socket = require("./socket.js");

const server = new App();

const { SESSION_NAME, AUTO_START } = process.env;

const serverHttp = server.app.listen(server.PORT, async () => {
  await connectDatabase();
  if (AUTO_START == "y") {
    await new ConnectionSession().createSession(SESSION_NAME);
  } else {
    await new SessionDatabase().startProgram();
  }
  console.log(
    modules.color("[APP]", "#EB6112"),
    modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"),
    modules.color(`App Listening at http://localhost:${server.PORT}`, "#82E0AA")
  );
});

Socket.connect(serverHttp);
