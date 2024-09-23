import {Router, Request, Response} from "express";
import { createUser, findUser, logout } from "../controllers/user_controllers";
const router = Router()


router.get("/", (_req: Request, res: Response) => {
  res.send("hola desde router get")  
})


router.post("/register", createUser)
router.post("/login", findUser)
router.post("/logout", logout)


export default router