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
const loginForm = document.getElementById("user-form");
const mensajeLogin = document.getElementById("message");
loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    try {
        const loginFormData = new FormData(loginForm);
        const data = {
            usuario: loginFormData.get("usuario"),
            contraseña: loginFormData.get("contraseña")
        };
        console.log(data);
        const respuesta = yield fetch("/api/login", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!respuesta.ok) {
            throw new Error("Error al iniciar sesion");
        }
        const resJson = yield respuesta.json();
        window.location.href = resJson.redirect;
    }
    catch (err) {
        mensajeLogin.textContent = "Error al iniciar sesion";
        mensajeLogin.style.display = "block";
        mensajeLogin.style.color = "red";
        console.log("Error:", err);
    }
}));
