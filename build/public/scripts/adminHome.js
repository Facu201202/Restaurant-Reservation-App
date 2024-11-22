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
const tbody = document.getElementById("todayReserves-body");
const reserveContent = document.getElementsByClassName("reserve-content")[0];
const peopleContent = document.getElementsByClassName("people-content")[0];
const inputSearch = document.getElementById("inputSearch");
const dateContainer = document.getElementById("date");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");
let userAmount = 0;
let reservesAmount = 0;
const statusOptions = ["Pendiente", "Aprobada", "Cancelada", "Finalizada"];
const date = new Date();
const formatDate = (fecha) => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
window.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    const fecha = formatDate(date);
    dateContainer.textContent = fecha;
    const reservas = yield reservesToday(fecha);
    createTable(reservas);
}));
leftArrow.addEventListener("click", () => changeDay(-1));
rightArrow.addEventListener("click", () => changeDay(1));
const changeDay = (dia) => __awaiter(void 0, void 0, void 0, function* () {
    date.setDate(date.getDate() + dia);
    const fechaFormateada = formatDate(date);
    dateContainer.textContent = fechaFormateada;
    const reservas = yield reservesToday(fechaFormateada);
    createTable(reservas);
});
const reservesToday = (fecha) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch("http://localhost:3000/api/today", {
            method: "POST",
            credentials: 'include',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                date: fecha
            })
        });
        const resJson = yield res.json();
        return resJson.today;
    }
    catch (err) {
        console.log("error");
    }
});
const createTable = (reserves) => __awaiter(void 0, void 0, void 0, function* () {
    tbody.textContent = "";
    reservesAmount = 0;
    userAmount = 0;
    reserves.forEach((reserve) => {
        reservesAmount += 1;
        const tr = document.createElement("tr");
        const tdHour = document.createElement("td");
        tdHour.textContent = reserve.hora;
        tdHour.style.color = "#fea941";
        const tdName = document.createElement("td");
        tdName.textContent = reserve.nombre + " " + reserve.apellido;
        tdName.style.fontWeight = "bold";
        const tdTable = document.createElement("td");
        tdTable.textContent = "Mesa: " + reserve.mesa;
        tdTable.style.color = "rgb(119 113 113 / 83%)";
        const tdAmount = document.createElement("td");
        tdAmount.textContent = "Cantidad: " + reserve.cantidad;
        userAmount += reserve.cantidad;
        tdAmount.style.color = "rgb(119 113 113 / 83%)";
        const tdStatus = document.createElement("td");
        const selectStatus = document.createElement("select");
        statusOptions.forEach((option) => {
            const selectOption = document.createElement("option");
            selectOption.value = option;
            selectOption.textContent = option;
            if (selectOption.value.toLowerCase() === reserve.estado.toLowerCase()) {
                selectOption.selected = true;
            }
            selectStatus.appendChild(selectOption);
        });
        selectStatus.addEventListener("change", (e) => {
            const event = e.target;
            cambiarEstado(event, reserve.id);
        });
        tdStatus.appendChild(selectStatus);
        tr.appendChild(tdHour);
        tr.appendChild(tdName);
        tr.appendChild(tdTable);
        tr.appendChild(tdAmount);
        tr.appendChild(tdStatus);
        tbody.appendChild(tr);
    });
    reserveContent.textContent = reservesAmount.toString();
    peopleContent.textContent = userAmount.toString();
});
inputSearch.addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("#todayReserves-body tr");
    filas.forEach(fila => {
        var _a;
        const nombre = (_a = fila.cells[1].textContent) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase();
        fila.style.display = (nombre === null || nombre === void 0 ? void 0 : nombre.includes(filtro)) ? "" : "none";
    });
});
const cambiarEstado = (evento, reserva) => __awaiter(void 0, void 0, void 0, function* () {
    const statusSelect = evento.value;
    const confirmedStatus = confirm(`¿Desea cambiar el estado de la reserva a ${statusSelect}?`);
    if (confirmedStatus) {
        try {
            const res = yield fetch("http://localhost:3000/api/updateReserve", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: reserva,
                    status: statusSelect
                })
            });
            const resJson = yield res.json();
            alert(resJson.message);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        catch (err) {
            alert("Error:" + err);
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    }
    else {
        window.location.reload();
    }
});
