const express = require("express");
const router = express.Router();

const ControllerUser = require("./session.controller.js");

const controller = new ControllerUser();

router.post("/create-session", controller.createOneSession.bind(controller));
router.get("/start-session", controller.startOneSession.bind(controller));
router.get("/stop-session", controller.stopOneSession.bind(controller));
router.get("/delete-session/:session", controller.deleteUserSession.bind(controller));

module.exports = router;
