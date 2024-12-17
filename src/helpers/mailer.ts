import nodemailer from "nodemailer";
import path from 'path';
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Cargar las variables de entorno
const CLIENT_ID = process.env.IDCLIENTE;
const CLIENT_SECRET = process.env.SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const EMAIL = process.env.EMAIL;

const getNewAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }
        });

        if (response.data.access_token) {
            return response.data.access_token;
        } else {
            console.error("Error al obtener el access_token:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error al renovar el access_token:", error);
        return null;
    }
};

const createTransporter = async () => {
    const accessToken = await getNewAccessToken();

    if (accessToken) {
        return nodemailer.createTransport({
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
    } else {
        throw new Error("No se pudo obtener un nuevo access token.");
    }
};

export const messageAltaReserva = async (info: { correo: string, nombre: string, apellido: string, fecha: string, hora: string, cantidad: number, mesa: number }): Promise<boolean> => {
    try {
        const transporter = await createTransporter();

        const email = await transporter.sendMail({
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
    } catch (err) {
        console.error("Error al enviar el email:", err);
        return false;
    }
};
