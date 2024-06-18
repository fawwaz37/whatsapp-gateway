let chalk;
(async () => {
  chalk = (await import("chalk")).default;
})();

const color = (text, color) => {
  return !color ? chalk.green(text) : color.startsWith("#") ? chalk.hex(color)(text) : chalk.keyword(color)(text);
};

const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = { color, sleep };
