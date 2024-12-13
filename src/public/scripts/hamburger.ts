const nav = document.getElementById("menu-elements") as HTMLDivElement
const abrir = document.getElementById("abrir") as HTMLIFrameElement
const cerrar = document.getElementById("cerrar") as HTMLIFrameElement

abrir.addEventListener("click", () => {
    nav.classList.add("nav-visibie")
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("nav-visibie")
}) 