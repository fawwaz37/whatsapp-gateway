import express from "express";
const router = express.Router();

import ControllerApi from "./api.controller.js";

const controller = new ControllerApi();

router.get("/", (req, res) => {
	res.send("okee");
});

router.post("/sendtext", controller.sendText.bind(controller));
router.post("/sendmedia", controller.sendMedia.bind(controller));
router.post("/sendsticker", controller.sendSticker.bind(controller));
router.post("/sendcontact", controller.sendContact.bind(controller));
router.post("/sendbutton", controller.sendButton.bind(controller));
router.post("/sendlist", controller.sendListMessage.bind(controller));
router.post("/sendlocation", controller.sendLocation.bind(controller));
router.post("/sendproduct", controller.sendProduct.bind(controller));

router.get("/del-history", controller.deleteHistory.bind(controller));
router.get("/delall-history", controller.deleteAllHistory.bind(controller));

export default router;
