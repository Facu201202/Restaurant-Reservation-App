import express from "express";
import path from 'path';
import routes from "./routes/routes";



const PORT = 3000;

//server
const app = express();
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Configuración 
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
app.use(express.static(path.join(__dirname, '..', 'build', 'public')));

//api
app.use("/api", routes);


// rutas
app.get('/inicio', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get("/login", (_req, res) =>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})


app.get("/register", (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
}) 