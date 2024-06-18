const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/Database.js");
const History = require("./history.model.js");

const Session = sequelize.define(
  "Session",
  {
    session_name: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      allowNull: false,
    },
    session_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: "sessions", timestamps: true }
);

Session.removeAttribute("id");

Session.hasMany(History, { foreignKey: "session_name" });
History.belongsTo(Session, { foreignKey: "session_name" });

module.exports = Session;
