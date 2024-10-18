import {Router, Request, Response} from "express";
import { createUser, findUser, getTable, logout, findReservas, altaReserva, verReservas } from "../controllers/user_controllers";
import { validarToken } from "../middlewares/auth";
const router = Router()


router.get("/", (_req: Request, res: Response) => {
  res.send("hola desde router get")  
})


router.post("/register", createUser)
router.post("/login", findUser)
router.post("/logout", logout)
router.get("/hours", getTable)
router.post("/reservas", findReservas)
router.post("/alta/reserva", validarToken, altaReserva)
router.post("/misReservas", validarToken, verReservas)

export default router