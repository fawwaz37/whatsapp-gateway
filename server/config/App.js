const express = require("express");
const expressLayout = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const fileUpload = require("express-fileupload");

// const { connectDatabase } = require("./Database.js");
const routerUser = require("../router/session/session.router.js");
const routerDashboard = require("../router/dashboard/dashboard.router.js");
const routerApi = require("../router/api/api.router.js");
const routerAutoReply = require("../router/dashboard/AutoReply/autoReply.router.js");

class App {
  constructor() {
    this.app = express();
    this.plugins();
    this.route();
    this.PORT = process.env.PORT || 8080;
  }

  plugins() {
    this.app.set("trust proxy", 1);
    this.app.set("view engine", "ejs");
    this.app.use(expressLayout);
    this.app.use(express.static("public/mazer"));
    this.app.use(express.static("public"));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(session({ secret: "secret", resave: false, saveUninitialized: true, cookie: { maxAge: 60000 } }));
    this.app.use(flash());
    this.app.use(function (req, res, next) {
      res.locals.success_msg = req.flash("success_msg");
      res.locals.error_msg = req.flash("error_msg");
      res.locals.side = req.flash("side");
      res.locals.url = req.originalUrl;
      next();
    });
    this.app.use(
      fileUpload({
        fileSize: 10 * 1024 * 1024,
      })
    );

    // connectDatabase();
  }

  route() {
    this.app.get("/", (req, res) => {
      res.redirect("/dashboard");
    });

    this.app.use("/dashboard", routerDashboard);
    this.app.use("/session", routerUser);
    this.app.use("/api", routerApi);
    this.app.use("/reply", routerAutoReply);
  }
}

module.exports = App;
