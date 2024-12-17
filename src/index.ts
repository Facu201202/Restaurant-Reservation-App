import express from "express";
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import routes from "./routes/routes";
import { validarAdminToken, validarToken } from "./middlewares/auth";
import cookieParser from "cookie-parser"

const PORT = process.env.PORT || 3000;

//server
const app = express();
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Configuración 
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
app.use(express.static(path.join(__dirname, '..', 'build', 'public')));
app.use(cookieParser())

//api
app.use("/api", routes);


// rutas
app.get('/inicio', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'index.html'));
});

app.get("/login", (_req, res) =>{
    res.sendFile(path.join(__dirname,  '..', 'src', 'public', 'login.html'))
})

app.get("/register", (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'register.html'))
}) 


//rutas de usuario 

app.get("/user", validarToken, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'userPages', 'home.html'));
})

app.get("/myReserve", validarToken, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'userPages', 'myReserve.html'))
})


//rutas admin 

app.get("/adminToday", validarAdminToken, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'adminPages', 'home.html'))
}) 

app.get("/usersList", validarAdminToken, (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'src', 'public', 'adminPages', 'userAdmin.html'))
})
