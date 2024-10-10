"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user_controllers");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.send("hola desde router get");
});
router.post("/register", user_controllers_1.createUser);
router.post("/login", user_controllers_1.findUser);
router.post("/logout", user_controllers_1.logout);
router.get("/hours", user_controllers_1.getTable);
router.post("/reservas", user_controllers_1.findReservas);
exports.default = router;
