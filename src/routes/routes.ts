import express from "express";
const router = express.Router()


router.get("/", (_req, res) => {
  res.send("hola desde router get")  
})


router.post("/", (_req, res) => {
    res.send("router post")
})


export default router