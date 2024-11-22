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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTable = exports.reservesToday = void 0;
let userAmount = 0;
let reservesAmount = 0;
const statusOptions = ["Pendiente", "Aprobada", "Cancelada", "Finalizada"];
const reservesToday = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch("http://localhost:3000/api/today", {
            method: "GET"
        });
        const resJson = yield res.json();
        return resJson.today;
    }
    catch (err) {
        console.log("error");
    }
});
exports.reservesToday = reservesToday;
const createTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const reserves = yield (0, exports.reservesToday)();
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
exports.createTable = createTable;
