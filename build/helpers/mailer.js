"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageAltaReserva = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
// Cargar las variables de entorno
const CLIENT_ID = process.env.IDCLIENTE;
const CLIENT_SECRET = process.env.SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL = process.env.EMAIL;
const getNewAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }
        });
        if (response.data.access_token) {
            return response.data.access_token;
        }
        else {
            console.error("Error al obtener el access_token:", response.data);
            return null;
        }
    }
    catch (error) {
        console.error("Error al renovar el access_token:", error);
        return null;
    }
});
const createTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield getNewAccessToken();
    if (accessToken) {
        return nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken, // Usamos el access token obtenido
            }
        });
    }
    else {
        throw new Error("No se pudo obtener un nuevo access token.");
    }
});
const messageAltaReserva = (info) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = yield createTransporter();
        const email = yield transporter.sendMail({
            from: `Restaurante de Prueba <${EMAIL}>`, // Correo del remitente
            to: info.correo, // Correo del destinatario
            subject: "Tu reserva ha sido registrada y está pendiente de confirmación",
            text: `
Estimado/a ${info.nombre} ${info.apellido},

Queremos informarte que tu reserva ha sido cargada correctamente y se encuentra en estado pendiente. En cuanto la reserva sea confirmada, te enviaremos una notificación para que puedas proceder con tu visita.

A continuación, te proporcionamos los detalles de tu solicitud:

• Fecha y hora solicitada: ${info.fecha} a las ${info.hora}
• Número de personas: ${info.cantidad}
• Mesa solicitada: ${info.mesa}

Por favor, espera nuestra confirmación para asegurar la disponibilidad. Si necesitas modificar o cancelar tu solicitud, no dudes en contactarnos respondiendo a este correo.

Gracias por tu comprensión y por confiar en nosotros.

Atentamente,
Restaurante de Prueba
            `.trim() // Eliminar espacios innecesarios al inicio y fin
        });
        console.log("Email enviado con éxito:", email);
        return true;
    }
    catch (err) {
        console.error("Error al enviar el email:", err);
        return false;
    }
});
exports.messageAltaReserva = messageAltaReserva;
