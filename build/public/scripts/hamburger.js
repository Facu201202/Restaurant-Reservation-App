"use strict";
const hamburger = document.querySelector(".hamburger");
const liElements = document.querySelector(".li-elements");
hamburger.addEventListener("click", () => {
    liElements.classList.toggle("show");
});
