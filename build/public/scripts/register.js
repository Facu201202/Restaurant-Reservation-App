"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const formulario = document.getElementById("user-form");
const mensaje = document.getElementById("message");
formulario === null || formulario === void 0 ? void 0 : formulario.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    try {
        const formData = new FormData(formulario);
        const data = {
            nombre: formData.get("nombre"),
            apellido: formData.get("apellido"),
            usuario: formData.get("usuario"),
            correo: formData.get("correo"),
            contraseña: formData.get("contraseña")
        };
        console.log(data);
        const respuesta = yield fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }
        formulario.reset();
        console.log("Usuario creado con exito");
        mensaje.style.display = "block";
        const resJSON = yield respuesta.json();
        setTimeout(() => {
            window.location.href = resJSON.redirect;
        }, 2000);
    }
    catch (err) {
        mensaje.textContent = "Error al crear usuario";
        mensaje.style.display = "block";
        mensaje.style.color = "red";
        console.log("error:", err);
    }
}));
