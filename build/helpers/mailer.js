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
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.IDCLIENTE,
        clientSecret: process.env.SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});
const messageAltaReserva = (info) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield transporter.sendMail({
            from: `Restaurante de Prueba ${process.env.EMAIL}`,
            to: info.correo,
            subject: "Tu reserva ha sido registrada y está pendiente de confirmación",
            text: `
Estimado/a ${info.nombre} ${info.apellido}:

Queremos informarte que tu reserva ha sido cargada correctamente y se encuentra en estado pendiente. En cuanto la reserva sea confirmada, te enviaremos una notificación para que puedas proceder con tu visita.

A continuación, te proporcionamos los detalles de tu solicitud:

\u2022 Fecha y hora solicitada: ${info.fecha} a las ${info.hora}
\u2022 Número de personas: ${info.cantidad}
\u2022 Mesa solicitada: ${info.mesa}

Por favor, espera nuestra confirmación para asegurar la disponibilidad. Si necesitas modificar o cancelar tu solicitud, no dudes en contactarnos respondiendo a este correo.

Gracias por tu comprensión y por confiar en nosotros.

Atentamente,
Restaurante de Prueba
            `.trim() //eliminar espacios innecesarios al inicio y fin.
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
