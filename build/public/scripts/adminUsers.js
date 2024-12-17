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
const userTbody = document.getElementById("users-body");
const userInputSearch = document.getElementById("inputSearch");
const modifyForm = document.getElementById("user-form");
const passwordForm = document.getElementById("contraseña");
const message = document.getElementById("message");
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield allUsers();
    createUsersTable(users);
}));
const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch("/api/allUsers", {
            method: "GET"
        });
        const resJson = yield res.json();
        console.log(resJson);
        return resJson.users;
    }
    catch (err) {
        console.log(err);
    }
});
const createUsersTable = (users) => __awaiter(void 0, void 0, void 0, function* () {
    userTbody.textContent = "";
    users.forEach((user) => {
        const tr = document.createElement("tr");
        const tdUserName = document.createElement("td");
        tdUserName.textContent = user.usuario;
        tdUserName.style.fontWeight = "bold";
        const tdName = document.createElement("td");
        tdName.textContent = user.nombre + " " + user.apellido;
        const tdMail = document.createElement("td");
        tdMail.textContent = "Correo: " + user.correo;
        tdMail.style.color = "rgb(119 113 113 / 83%)";
        const tdRol = document.createElement("td");
        tdRol.textContent = "Rol: " + user.rol;
        tdRol.style.color = "rgb(119 113 113 / 83%)";
        const tdi = document.createElement("td");
        const i = document.createElement("i");
        i.classList.add("fa-solid", "fa-pen");
        i.addEventListener("click", () => {
            loadForm(user);
        });
        tdi.appendChild(i);
        tr.appendChild(tdUserName);
        tr.appendChild(tdName);
        tr.appendChild(tdMail);
        tr.appendChild(tdRol);
        tr.appendChild(tdi);
        userTbody.appendChild(tr);
    });
});
modifyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(modifyForm);
    modifyUser(formData);
});
const modifyUser = (info) => __awaiter(void 0, void 0, void 0, function* () {
    let res;
    try {
        const changes = {
            id: info.get("userId"),
            nombre: info.get("nombre"),
            apellido: info.get("apellido"),
            correo: info.get("correo"),
            usuario: info.get("usuario"),
            contraseña: info.get("contraseña")
        };
        res = yield fetch("/api/modifyUser", {
            method: "POST",
            credentials: 'include',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                data: changes
            })
        });
        const resJson = yield res.json();
        message.textContent = resJson.message;
        setTimeout(() => {
            modifyForm.reset();
            message.textContent = "";
        }, 1200);
    }
    catch (err) {
        const resJson = yield res.json();
        message.textContent = resJson.message;
        message.style.color = "red";
        setTimeout(() => {
            modifyForm.reset();
            message.textContent = "";
        }, 1200);
    }
});
userInputSearch.addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("#users-body tr");
    filas.forEach(fila => {
        var _a;
        const nombre = (_a = fila.cells[1].textContent) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
        fila.style.display = (nombre === null || nombre === void 0 ? void 0 : nombre.includes(filtro)) ? "" : "none";
    });
});
const loadForm = (user) => {
    modifyForm.userId.value = user.id_usuario;
    modifyForm.nombre.value = user.nombre;
    modifyForm.apellido.value = user.apellido;
    modifyForm.correo.value = user.correo;
    modifyForm.usuario.value = user.usuario;
};
const togglePasswordField = () => {
    passwordForm.disabled = !passwordForm.disabled;
    if (passwordForm.disabled)
        passwordForm.value = "";
};
