"use strict";
const nav = document.getElementById("menu-elements");
const abrir = document.getElementById("abrir");
const cerrar = document.getElementById("cerrar");
abrir.addEventListener("click", () => {
    nav.classList.add("nav-visibie");
});
cerrar.addEventListener("click", () => {
    nav.classList.remove("nav-visibie");
});
