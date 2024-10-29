"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user_controllers");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/", (_req, res) => {
    res.send("hola desde router get");
});
router.post("/register", user_controllers_1.createUser);
router.post("/login", user_controllers_1.findUser);
router.post("/logout", user_controllers_1.logout);
router.get("/hours", user_controllers_1.getTable);
router.post("/reservas", user_controllers_1.findReservas);
router.post("/alta/reserva", auth_1.validarToken, user_controllers_1.altaReserva);
router.post("/misReservas", auth_1.validarToken, user_controllers_1.verReservas);
router.delete("/misReservas", auth_1.validarToken, user_controllers_1.bajaReserva);
exports.default = router;
