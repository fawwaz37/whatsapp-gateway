import { Sequelize } from "sequelize";
import mysql from "mysql2";
import { modules } from "../../lib/index.js";
import { moment } from "./index.js";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } = process.env;

let connection = mysql.createPool({ waitForConnections: true, connectTimeout: 30000, host: DB_HOST, port: DB_PORT, user: DB_USER, password: DB_PASSWORD });
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: DB_DIALECT,
	logging: false,
});

async function connectDatabase() {
	connection.query(`use \`${DB_NAME}\`;`, (err) => {
		if (err) {
			console.log(modules.color("[APP]", "#EB6112"), modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"), modules.color(`Create new Database Success!`, "#82E0AA"));
			connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
		}
	});
	await modules.sleep(2000);
	await sequelize
		.authenticate()
		.then(() => {
			console.log(modules.color("[APP]", "#EB6112"), modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"), modules.color(`Connection Database has been established Successfully`, "#82E0AA"));
		})
		.catch((error) => {
			console.error(error);
		});

	await sequelize.sync({ force: false, alter: false }).then(() => {
		console.log(modules.color("[APP]", "#EB6112"), modules.color(moment().format("DD/MM/YY HH:mm:ss"), "#F8C471"), modules.color(`Re-Sync Database`, "#82E0AA"));
	});
}

export { connectDatabase, sequelize, connection };
