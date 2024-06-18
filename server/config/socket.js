let connection = null;

class Socket {
  constructor() {
    this.socket = null;
  }

  static connect(server) {
    const io = require("socket.io")(server);
    io.on("connection", (socket) => {
      this.socket = socket;
    });
  }

  static emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  static init(server) {
    if (!connection) {
      connection = new Socket();
      connection.connect(server);
    }
  }

  static getConnection() {
    if (connection) {
      return connection;
    }
  }
}

module.exports = Socket;
