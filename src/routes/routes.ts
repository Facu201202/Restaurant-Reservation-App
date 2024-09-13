import {Router, Request, Response} from "express";
import { createUser } from "../controllers/user_controllers";
const router = Router()


router.get("/", (_req: Request, res: Response) => {
  res.send("hola desde router get")  
})


router.post("/register", createUser)


export default router