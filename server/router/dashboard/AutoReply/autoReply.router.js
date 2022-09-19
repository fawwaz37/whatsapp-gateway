import express from "express";
const router = express.Router();

import ControllerAutoReply from "./autoReply.controller.js";

const controller = new ControllerAutoReply();

router.post("/create-reply", controller.createReply.bind(controller));
router.post("/edit-reply", controller.editReply.bind(controller));
router.get("/delete-reply", controller.deleteReply.bind(controller));
router.get("/deleteall-reply", controller.deleteAllReply.bind(controller));

export default router;
