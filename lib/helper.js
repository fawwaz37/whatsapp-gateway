import axios from "axios";
const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

const downloadAxios = (url) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				responseType: "arraybuffer",
			})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			});
	});
};
const phoneNumber = (number) => {
	if (number.endsWith("@s.whatsapp.net")) return number;
	if (number.endsWith("@g.us")) return number;
	if (number.includes("-")) {
		return number + "@g.us";
	}
	const phone = number.replace(/\D/g, "");
	if (phone.startsWith("08")) {
		const slice = phone.slice(1);
		return `62${slice}@s.whatsapp.net`;
	} else {
		return phone + "@s.whatsapp.net";
	}
};

const randomText = (length) => {
	const result = [];
	for (let i = 0; i < length; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
	return result.join("");
};

export default { phoneNumber, randomText, downloadAxios };
