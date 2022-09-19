import chalk from "chalk";

const color = (text, color) => {
	return !color ? chalk.green(text) : color.startsWith("#") ? chalk.hex(color)(text) : chalk.keyword(color)(text);
};

const sleep = async (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export default { color, sleep };
