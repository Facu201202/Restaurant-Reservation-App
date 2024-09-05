const hamburger = document.querySelector(".hamburger") as HTMLDivElement
const liElements = document.querySelector(".li-elements") as HTMLUListElement


hamburger.addEventListener("click", () =>{
    liElements.classList.toggle("show");
})