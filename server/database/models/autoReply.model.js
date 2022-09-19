import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const AutoReplyModel = sequelize.define(
	"AutoReply",
	{
		session_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		session_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		keyword: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		response: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "autoreplys", timestamps: true }
);

export default AutoReplyModel;
