import {Router, Request, Response} from "express";
import { createUser, findUser, getTable, logout, findReservas, altaReserva, verReservas, bajaReserva, reserveToday, updateReserve, getUsers, modifyUser} from "../controllers/user_controllers";
import { validarToken, validarAdminToken } from "../middlewares/auth";
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
router.delete("/misReservas", validarToken, bajaReserva)
router.post("/today", validarAdminToken, reserveToday)
router.post("/updateReserve",validarAdminToken, updateReserve )
router.get("/allUsers", validarAdminToken, getUsers)
router.post("/modifyUser", validarAdminToken, modifyUser)


export default router