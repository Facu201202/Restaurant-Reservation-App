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
