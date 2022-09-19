import { DataTypes } from "sequelize";
import { sequelize } from "../../config/Database.js";

const ButtonResponseModel = sequelize.define(
	"ButtonResponse",
	{
		session_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		target_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		msg_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		keyword: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		response: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{ tableName: "buttonresponses", timestamps: true }
);

export default ButtonResponseModel;
