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
const gridContainer = document.getElementById("grid-container");
const fechaButton = document.getElementById("form-fecha-button");
const reservarButton = document.getElementById("reservar-button");
const infoReserva = document.getElementById("info-reserva");
const messageForm = document.getElementById("message-form");
const reservarMessage = document.getElementById("reservar-message");
const fecha = document.getElementById("fecha");
const cantidad = document.getElementById("cantidad");
const CheckReservesImg = document.getElementById("CheckReservesImg");
let selectHour;
fechaButton.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
const createGrid = (cantidad, fecha, blockHours) => __awaiter(void 0, void 0, void 0, function* () {
    const hours = yield getHours();
    const cantidadN = Number(cantidad);
    if ((!cantidad || !fecha) || (cantidadN > 6 || cantidadN < 1)) {
        messageForm.textContent = `Campos incompletos o erróneos para iniciar la búsqueda`;
        messageForm.style.color = "red";
        messageForm.style.fontSize = "medium";
        messageForm.style.textAlign = "center";
    }
    else {
        CheckReservesImg.style.display = "none";
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
                    select(hour, cell);
                });
            }
            gridContainer.appendChild(cell);
        });
        infoReserva.textContent = `Para ${cantidad} persona/s, hay disponibles las siguentes horas el ${fecha}.`;
        messageForm.textContent = ``;
    }
});
const select = (hora, cell) => {
    selectHour = hora;
    const gridElements = document.querySelectorAll(".hour-element");
    gridElements.forEach((item) => item.classList.remove("selected"));
    cell.classList.add("selected");
};
reservarButton.addEventListener('click', (e) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        e.preventDefault();
        reservarMessage.style.color = "orange";
        reservarMessage.textContent = "Realizando Reserva...";
        const reserva = {
            fecha: fecha.value,
            cantidad: cantidad.value,
            hora: selectHour
        };
        const reservar = yield fetch("http://localhost:3000/api/alta/reserva", {
            method: 'POST',
            credentials: "include",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        });
        const resJson = yield reservar.json();
        if (!reservar.ok) {
            throw new Error(resJson.message);
        }
        reservarMessage.style.color = "green";
        reservarMessage.textContent = "Reserva realizada con exito, puede ver su reservar en la seccion mis reservas";
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
    catch (err) {
        reservarMessage.style.color = "red";
        reservarMessage.textContent = "Error al realizar reserva";
    }
}));
