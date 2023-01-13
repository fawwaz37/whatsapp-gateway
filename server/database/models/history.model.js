import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const History = sequelize.define(
	"History",
	{
		session_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		target: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		date: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		caption: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "historys", timestamps: false }
);

export default History;
