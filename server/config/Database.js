import { Sequelize } from "sequelize";
import { modules } from "../../lib/index.js";
import { moment } from "./index.js";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: DB_DIALECT,
	logging: false,
});

function connectDatabase() {
	sequelize
		.authenticate()
		.then(() => {
			console.log(modules.color("[APP]", "#EB6112"), modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"), modules.color(`Connection Database has been established Successfully`, "#82E0AA"));
		})
		.catch((error) => {
			console.error(error);
		});

	sequelize.sync({ force: false, alter: false }).then(() => {
		console.log(modules.color("[APP]", "#EB6112"), modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"), modules.color(`Re-Sync Database`, "#82E0AA"));
	});
}

export { connectDatabase, sequelize };
