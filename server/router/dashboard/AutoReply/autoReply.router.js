const express = require("express");
const router = express.Router();

const ControllerAutoReply = require("./autoReply.controller.js");

const controller = new ControllerAutoReply();

router.post("/create-reply", controller.createReply.bind(controller));
router.post("/edit-reply", controller.editReply.bind(controller));
router.get("/delete-reply", controller.deleteReply.bind(controller));
router.get("/deleteall-reply", controller.deleteAllReply.bind(controller));

module.exports = router;
