const gridContainer = document.getElementById("grid-container") as HTMLDivElement
const fechaButton = document.getElementById("form-fecha-button") as HTMLButtonElement
const reservarButton = document.getElementById("reservar-button") as HTMLButtonElement
const infoReserva = document.getElementById("info-reserva") as HTMLParagraphElement
const messageForm = document.getElementById("message-form") as HTMLParagraphElement
const reservarMessage = document.getElementById("reservar-message") as HTMLParagraphElement
const fecha = document.getElementById("fecha") as HTMLInputElement;
const cantidad = document.getElementById("cantidad") as HTMLInputElement;
const CheckReservesImg = document.getElementById("CheckReservesImg") as HTMLImageElement
let selectHour: Hours


fechaButton.addEventListener("click", async (e) => {
    try {
        e.preventDefault()
        const data = {
            fecha: fecha.value,
            cantidad: cantidad.value
        }

        const reservas = await fetch("http://localhost:3000/api/reservas", {
            method: 'POST',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const reservasJson = await reservas.json();
        createGrid(data.cantidad, data.fecha, reservasJson.mesasNoDisponibles);

    } catch (err) {
        console.log("error al mostar horas", err)
    }
})


const getHours = async () => {
    try {
        const respuesta = await fetch("http://localhost:3000/api/hours", {
            method: 'GET'
        })

        const resJson = await respuesta.json();
        return resJson.hours

    } catch (err) {
        console.log("error al traer horarios", err)
    }

}

interface Hours {
    id_hora: number,
    hora: string
}


const createGrid = async (cantidad: string, fecha: string, blockHours: string[]) => {
    const hours: Hours[] = await getHours();
    const cantidadN: number = Number(cantidad)
    if ((!cantidad || !fecha) || (cantidadN > 6 || cantidadN < 1)) {
        messageForm.textContent = `Campos incompletos o erróneos para iniciar la búsqueda`
        messageForm.style.color = "red"
        messageForm.style.fontSize = "medium"
        messageForm.style.textAlign = "center"
    } else {
        CheckReservesImg.style.display = "none"
        gridContainer.textContent = "";
        hours.forEach((hour: Hours) => {
            const cell = document.createElement('div');
            cell.textContent = hour.hora;
            cell.classList.add("hour-element");
            if (blockHours.includes(hour.hora)) {
                cell.classList.add("disable")
            } else {
                cell.classList.add("enable")
                cell.addEventListener("click", () => {
                    select(hour, cell)
                })
            }
            gridContainer.appendChild(cell)
        });

        infoReserva.textContent = `Para ${cantidad} persona/s, hay disponibles las siguentes horas el ${fecha}.`
        messageForm.textContent = ``
    }
}


const select = (hora: Hours, cell: HTMLDivElement) => {
    selectHour = hora
    const gridElements = document.querySelectorAll(".hour-element") as NodeListOf<HTMLDivElement>;

    gridElements.forEach((item: HTMLDivElement) => item.classList.remove("selected"));
    cell.classList.add("selected")
}

reservarButton.addEventListener('click', async (e) => {
    try {
        e.preventDefault()

        reservarMessage.style.color = "orange"
        reservarMessage.textContent = "Realizando Reserva..."

        const reserva = {
            fecha: fecha.value,
            cantidad: cantidad.value,
            hora: selectHour
        }

        const reservar = await fetch("http://localhost:3000/api/alta/reserva", {

            method: 'POST',
            credentials: "include",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(reserva)
        })

        const resJson = await reservar.json()
        if (!reservar.ok) {
            throw new Error(resJson.message)
        }

        reservarMessage.style.color = "green"
        reservarMessage.textContent = "Reserva realizada con exito, puede ver su reservar en la seccion mis reservas"

        setTimeout(() => {
            window.location.reload()
        }, 2000)

    } catch (err) {
        reservarMessage.style.color = "red"
        reservarMessage.textContent = "Error al realizar reserva"
    }
})