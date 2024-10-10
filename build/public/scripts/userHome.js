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
const logoutBtn = document.getElementById("button-nav");
const gridContainer = document.getElementById("grid-container");
const fechaButton = document.getElementById("form-fecha-button");
const reservarButton = document.getElementById("reservar-button");
const infoReserva = document.getElementById("info-reserva");
const messageForm = document.getElementById("message-form");
logoutBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch("http://localhost:3000/api/logout", {
            method: 'POST',
            credentials: "include"
        });
        if (res.ok) {
            const response = yield res.json();
            window.location.href = response.redirect;
        }
    }
    catch (err) {
        console.log("ERROR AL CERRAR SESION", err);
    }
}));
fechaButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fecha = document.getElementById("fecha");
        const cantidad = document.getElementById("cantidad");
        e.preventDefault();
        const data = {
            fecha: fecha.value,
            cantidad: cantidad.value
        };
        const reservas = yield fetch("http://localhost:3000/api/reservas", {
            method: 'POST',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const reservasJson = yield reservas.json();
        const horas = [];
        reservasJson.reservas.forEach((e) => {
            horas.push(e.hora_detalle);
        });
        createGrid(data.cantidad, data.fecha, reservasJson.mesasNoDisponibles);
    }
    catch (err) {
        console.log("error al mostar horas", err);
    }
}));
const getHours = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const respuesta = yield fetch("http://localhost:3000/api/hours", {
            method: 'GET'
        });
        const resJson = yield respuesta.json();
        return resJson.hours;
    }
    catch (err) {
        console.log("error al traer horarios", err);
    }
});
const createGrid = (cantidad, fecha, NoDisponibles) => __awaiter(void 0, void 0, void 0, function* () {
    const hours = yield getHours();
    const blockHours = disableHours(hours, NoDisponibles);
    if (!cantidad || !fecha) {
        messageForm.textContent = `Complete los campos para iniciar la busqueda`;
        messageForm.style.color = "red";
        messageForm.style.fontSize = "medium";
        messageForm.style.textAlign = "center";
    }
    else {
        gridContainer.textContent = "";
        hours.forEach((hour) => {
            const cell = document.createElement('div');
            cell.textContent = hour.hora;
            cell.classList.add("hour-element");
            if (blockHours.includes(hour.hora)) {
                cell.classList.add("disable");
            }
            else {
                cell.classList.add("enable");
                cell.addEventListener("click", () => {
                    select(hour.hora, cell);
                });
            }
            gridContainer.appendChild(cell);
        });
        infoReserva.textContent = `Para ${cantidad} persona/s, quedan disponibles las siguentes horas el ${fecha}.`;
        messageForm.textContent = ``;
    }
});
const disableHours = (allHours, notAvailableHours) => {
    const blockHours = [];
    allHours.forEach((hour, index) => {
        if (notAvailableHours.includes(hour.hora)) {
            for (let i = 0; i <= 4; i++) {
                if (hour.hora[0] === "19" && allHours[index - 1].hora[0] === "10") {
                    break;
                }
                else {
                    blockHours.push(allHours[index + i].hora);
                }
            }
        }
    });
    return blockHours;
};
const select = (hora, cell) => {
    let selectHour = hora;
    const gridElements = document.querySelectorAll(".hour-element");
    gridElements.forEach((item) => item.classList.remove("selected"));
    cell.classList.add("selected");
    console.log(selectHour);
};
