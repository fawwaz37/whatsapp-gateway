import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const Session = sequelize.define(
	"Session",
	{
		session_name: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		session_number: {
			type: DataTypes.BIGINT(200),
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "sessions", timestamps: true }
);

export default Session;
