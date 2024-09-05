"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes/routes"));
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
//api
app.use("/api", routes_1.default);
// rutas
app.get('/inicio', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'src', 'public', 'index.html'));
});
