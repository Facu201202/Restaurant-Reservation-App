import { Response, Request } from "express";
import { agregar, traerUno, traerTodo, encontrarReservas, encontrarMesas, agregarReserva, buscarReservas, eliminarReserva, actualizarReserva } from "../config/db";
import { Usuario, UserInfo, Reserva, InfoMessage } from "../interfaces/interfaces";
import bcryptjs from "bcryptjs"
import { createToken, createAdminToken } from "../middlewares/auth";
import { messageAltaReserva } from "../helpers/mailer";



/*Funcion para crear un usuario encriptado */

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {

        const salt = await bcryptjs.genSalt(5);
        const hashPassword = await bcryptjs.hash(req.body.contraseña, salt);

        const newUser: Usuario = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            usuario: req.body.usuario,
            correo: req.body.correo,
            contrasenia: hashPassword,
            rol: "usuario"
        }


        if (!newUser.nombre || !newUser.apellido || !newUser.correo || !newUser.contrasenia) {
            throw new Error("campo imcompleto")
        }

        const nuevo = await agregar(newUser);

        return res.status(200).send({
            message: "Usuario creado con exito",
            status: nuevo,
            redirect: "/login"
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error en la base de datos",
            Error: err
        })
    }
}


export const findUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await traerUno(req.body.usuario);


        if (!user || user.length === 0) {
            return res.status(401).send({
                message: "Usuario no encontrado"
            });
        }

        const rol = user[0].rol === "usuario" ? 2 : 1;

        const userInfo: UserInfo = {
            usuario: user[0].usuario,
            contraseña: user[0].contrasenia,
            scope: rol
        };


        const checkPassword = await bcryptjs.compare(req.body.contraseña, userInfo.contraseña);
        const checkUser = req.body.usuario === userInfo.usuario;


        if (!checkUser) {
            return res.status(401).send({
                message: "Usuario no encontrado"
            });
        }

        if (!checkPassword) {
            return res.status(401).send({
                message: "Contraseña incorrecta"
            });
        }

        //Define que tipo de rol lleva el token

        let token: string;
        let redirect: string;

        if (rol === 2) {
            token = createToken(userInfo)
            redirect = "/user"
        } else {
            token = createAdminToken(userInfo)
            redirect = "/adminToday"
        }

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
        });

        //retorna el estado de la peticion mas la ubicacion de redireccionamiento

        return res.status(200).send({
            message: "Login correcto",
            redirect: redirect
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Error en la autenticación",
        });
    }
}


/*Funcion para traer los horarios totales*/

export const getTable = async (_req: Request, res: Response): Promise<Response> => {
    const hours = await traerTodo("horas");
    return res.status(200).send({
        message: "Horarios encontrados",
        hours: hours
    })


}


/*Funcion para traer las reservas, mesas y horarios para luego identificar que horarios no van a estar disponibles*/

export const findReservas = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reservas = await encontrarReservas(req.body.fecha)
        const mesas = await encontrarMesas(req.body.cantidad)
        const hours = await traerTodo("horas")
        const noDisponible: string[] = disponibilidad(reservas, mesas)
        const blockHours: string[] = disableHours(hours, noDisponible)


        return res.status(200).send({
            message: "Reservas encontradas",
            mesasNoDisponibles: blockHours
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error al buscar reservas",
            error: err
        })
    }

}

/*Funcion para cerrar sesion*/

export const logout = async (_req: Request, res: Response) => {

    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true, path: '/' });
    res.status(200).send({
        message: "Logout exitoso",
        redirect: "/login"
    })

}



const AgruparPorHora = (reservas: any[], mesas: any[]) => {
    // Agrupar reservas por hora
    const gruposPorHora = reservas.reduce((acumulador: any, reserva: any) => {
        if (!acumulador[reserva.hora_detalle]) {
            acumulador[reserva.hora_detalle] = [];
        }
        acumulador[reserva.hora_detalle].push(reserva);
        return acumulador;
    }, {});

    const idMesas: number[] = mesas.map((element: any) => element.id_mesa);

    return { gruposPorHora, idMesas }
}

/*Funcion que agrupa las reservas por hora para luego identificar los horarios no disponibles y retornarlos*/

const disponibilidad = (reservas: any[], mesas: any[]): string[] => {
    const AgruparHora = AgruparPorHora(reservas, mesas)
    const { gruposPorHora, idMesas } = AgruparHora

    const horasNoDisponibles: string[] = [];

    Object.keys(gruposPorHora).forEach(hora => {
        const grupo = gruposPorHora[hora];


        const noDisponible = idMesas.every(idMesa =>
            grupo.some((reserva: any) => reserva.id_mesa === idMesa)
        );

        if (noDisponible) {
            horasNoDisponibles.push(hora);
        }
    });

    return horasNoDisponibles
};


/*Funcion que toma las horas no disponibles y bloquea las proximas dos, devuelve un array con todos estos*/

const disableHours = (allHours: any, notAvailableHours: string[]): string[] => {
    const blockHours: string[] = [];
    allHours.forEach((hour: any, index: number) => {
        if (notAvailableHours.includes(hour.hora)) {
            for (let i = 0; i <= 4; i++) {
                if (hour.hora[0] === "19" && allHours[index - 1].hora[0] === "10") {
                    break
                } else {
                    blockHours.push(allHours[index + i].hora)
                }
            }
        }
    })
    return blockHours
}

const mesasDisponibles = (hora: string, mesas: number[], reservas: any): number[] => {
    const reservasEnHora = reservas[hora]

    if (!reservasEnHora) {
        return mesas
    }

    const mesasReservadas = reservasEnHora.map((reserva: { id_mesa: number }) => reserva.id_mesa)

    return mesas.filter((idMesa) => !mesasReservadas.includes(idMesa))
}



export const altaReserva = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { fecha, cantidad, hora }: { fecha: string, cantidad: number, hora: any } = req.body;
        const mesas = await encontrarMesas(cantidad)
        const reservas = await encontrarReservas(fecha)
        const user = await traerUno(req.user?.usuario);
        const AgruparHora = AgruparPorHora(reservas, mesas)
        const { gruposPorHora, idMesas } = AgruparHora
        const mesasLibres = mesasDisponibles(hora.hora, idMesas, gruposPorHora)

        const fechaActual: Date = new Date()
        fechaActual.setDate(fechaActual.getDate() + 1)
        const fechaReserva: Date = new Date(fecha)

        if (fechaActual > fechaReserva) throw new Error("La fecha de reserva debe tener al menos un dia de antelacion")
        if (cantidad > 6 || cantidad < 1) throw new Error("La cantidad seleccionada se encuentra fuera del rango permitido")

        const reserva: Reserva = {
            id_usuario: user[0].id_usuario,
            id_mesa: mesasLibres[0],
            cantidad: cantidad,
            fecha: fecha,
            hora: hora.id_hora,
            estado: "Pendiente"
        }

        const createInfoMessage: InfoMessage = {
            nombre: user[0].nombre,
            apellido: user[0].apellido,
            correo: user[0].correo,
            cantidad: cantidad,
            fecha: fecha,
            hora: hora.hora,
            mesa: mesasLibres[0]
        }

        await agregarReserva(reserva)

        const mail = await messageAltaReserva(createInfoMessage)

        if (!mail) {
            throw new Error("Error al mandar el mail")
        }

        return res.status(200).send({
            message: "Reserva realizada con exito"
        })

    } catch (err) {
        return res.status(500).send({
            message: "Error al realizar la reserva" + err,

        })
    }
}


export const verReservas = async (req: Request, res: Response): Promise<Response> => {
    try {
        const user = await traerUno(req.user?.usuario);
        const userReserves = await buscarReservas(user[0].id_usuario)

        return res.status(200).send({
            message: "reservas encontradas",
            reservas: userReserves
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: "Error al buscar reservas", err
        })
    }
}


export const bajaReserva = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reserva = req.body.id
        await eliminarReserva(reserva)
        return res.status(200).send({
            message: "Reserva eliminada con exito"
        })
    } catch (err) {
        return res.status(500).send({
            message: "Error al borrar reserva:" + err
        })
    }
}


export const reserveToday = async (req:Request, res: Response): Promise<Response> =>{
    try{
        const fecha = req.body.date
        const reservas = await encontrarReservas(fecha)

        let totalReservas = reservas.map(reserva => ({
            id: reserva.id_reserva,
            hora: reserva.hora_detalle,
            nombre: reserva.nombre,
            apellido: reserva.apellido,
            mesa: reserva.id_mesa,
            cantidad: reserva.cantidad,
            estado: reserva.estado
        }))

        
        return res.status(200).send({
            message: `Reservas del dia ${fecha}`,
            today: totalReservas
        })

    }catch(err){
        return res.status(400).send({
            message: "Error a buscar reservas del dia",
            Error: err
        })
    }
   


}


export const updateReserve = async (req: Request, res:Response): Promise<Response> => {
    try{
        await actualizarReserva(req.body.id, req.body.status)
        return res.status(200).send({
            message: "Reserva modificada con exito"
        })

    }catch(err){
        return res.status(500).send({
            message: "Error al modificar la reserva" + err
        })
    }
}