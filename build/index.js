"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes/routes"));
const auth_1 = require("./middlewares/auth");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const PORT = 3000;
//server
const app = (0, express_1.default)();
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
// Configuración 
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'src', 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'build', 'public')));
app.use((0, cookie_parser_1.default)());
//api
app.use("/api", routes_1.default);
// rutas
app.get('/inicio', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
app.get("/login", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'login.html'));
});
app.get("/register", (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'register.html'));
});
//rutas de usuario 
app.get("/user", auth_1.validarToken, (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'userPages', 'home.html'));
});
app.get("/myReserve", auth_1.validarToken, (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'userPages', 'myReserve.html'));
});
//rutas admin 
app.get("/adminToday", auth_1.validarAdminToken, (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'adminPages', 'home.html'));
});
