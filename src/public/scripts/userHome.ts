const logoutBtn = document.getElementById("button-nav") as HTMLButtonElement
const gridContainer = document.getElementById("grid-container") as HTMLDivElement
const fechaButton = document.getElementById("form-fecha-button") as HTMLButtonElement
const reservarButton = document.getElementById("reservar-button") as HTMLButtonElement
const infoReserva = document.getElementById("info-reserva") as HTMLParagraphElement
const messageForm = document.getElementById("message-form") as HTMLParagraphElement

logoutBtn.addEventListener("click", async () => {
    try {

        const res: Response = await fetch("http://localhost:3000/api/logout", {
            method: 'POST',
            credentials: "include"
        })

        if (res.ok) {
            const response = await res.json()
            window.location.href = response.redirect
        }

    } catch (err) {
        console.log("ERROR AL CERRAR SESION", err)
    }
})

fechaButton.addEventListener("click", async (e) => {
    try {
        const fecha = document.getElementById("fecha") as HTMLInputElement;
        const cantidad = document.getElementById("cantidad") as HTMLInputElement;

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
        const horas: string[] = [];
        reservasJson.reservas.forEach((e: any) => {
            horas.push(e.hora_detalle)
        })
        createGrid( data.cantidad, data.fecha, reservasJson.mesasNoDisponibles);

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


const createGrid = async ( cantidad: string, fecha: string, NoDisponibles: string[]) => {
    const hours: Hours[] = await getHours();
    const blockHours: string[] = disableHours(hours, NoDisponibles)

    if (!cantidad || !fecha) {
        messageForm.textContent = `Complete los campos para iniciar la busqueda`
        messageForm.style.color = "red"
        messageForm.style.fontSize = "medium"
        messageForm.style.textAlign = "center"
    } else {
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
                    select(hour.hora, cell)
                })
            }
            gridContainer.appendChild(cell)
        });

        infoReserva.textContent = `Para ${cantidad} persona/s, quedan disponibles las siguentes horas el ${fecha}.`
        messageForm.textContent = ``
    }
}

const disableHours = (allHours: Hours[], notAvailableHours: string[]): string[] =>{
    const blockHours: string[] = [];
    allHours.forEach((hour: Hours, index: number) => {
        if(notAvailableHours.includes(hour.hora)){
            for(let i = 0; i <= 4; i++){
                if(hour.hora[0] === "19" && allHours[index - 1].hora[0] === "10"){
                    break
                }else{
                    blockHours.push(allHours[index + i].hora) 
                }
            }
        }   
    })

    return blockHours
}

const select = (hora: string, cell: HTMLDivElement) => {
    let selectHour = hora;
    const gridElements = document.querySelectorAll(".hour-element") as NodeListOf<HTMLDivElement>;

    gridElements.forEach((item: HTMLDivElement) => item.classList.remove("selected"));
    cell.classList.add("selected")
    console.log(selectHour)
}
