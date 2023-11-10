const express = require("express");
const router = new express.Router();
const User = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/authenticate", User.Authenticate);

router.post("/logout", auth, User.logout);

router.get("/alluser", auth, User.getUsersList);

router.get("/user/:_id", User.getUserById);

module.exports = router;
