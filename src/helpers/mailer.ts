import nodemailer from "nodemailer"
import path from 'path';
import dotenv from "dotenv"
import { InfoMessage } from "../interfaces/interfaces";

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') })

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.IDCLIENTE,
        clientSecret: process.env.SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})


export const messageAltaReserva = async (info: InfoMessage): Promise<boolean> => {
    try {
        const email = await transporter.sendMail({
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
    } catch (err) {
        console.error("Error al enviar el email:", err);
        return false;
    }
};
