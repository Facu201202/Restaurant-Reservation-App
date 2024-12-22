const reservasContainer = document.getElementById("card-reserva-container") as HTMLDivElement

const mostrarMisReservas = async () => {
    try{
        const respuesta = await fetch("/api/misReservas",{
            method: 'POST',
            credentials: 'include'
        })

        const resJson = await respuesta.json()
        reservasCard(resJson.reservas)
    }catch(err){
        console.error("Error al mostrar reservas personales")
    }
}

const obtenerFecha  = (s: string): string => {
    const fecha: Date = new Date(s);
    return fecha.toISOString().split("T")[0]
}

document.addEventListener("DOMContentLoaded", () =>{
    mostrarMisReservas()
})

const reservasCard = (reservas: any[]) =>{

    reservas.forEach(reserva => {
        const divCard = document.createElement("div");
        divCard.classList.add("card-reserva");

        const divTitle = document.createElement("div")
        divTitle.classList.add("card-title")
        const title = document.createElement("h3");
        const fechaAdaptada = obtenerFecha(reserva.fecha)
        title.textContent = fechaAdaptada
        title.classList.add("card-fecha")
        const iconTrash = document.createElement("i")
        iconTrash.classList.add("fa-regular", "fa-trash-can")

        iconTrash.addEventListener('click', () => {
            cancelarReserva(fechaAdaptada, reserva.id_reserva)
        })

        divTitle.appendChild(title)
        divTitle.appendChild(iconTrash)

        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body")


        const divHora = document.createElement("div")
        const iconHora = document.createElement("i")
        iconHora.classList.add("fa-regular", "fa-clock")
        const hora = document.createElement("p")
        hora.textContent = "Hora: " +  reserva.hora_detalle
        divHora.appendChild(iconHora)
        divHora.appendChild(hora)
        divHora.classList.add("card-item")


        const divPersonas = document.createElement("div")
        const iconPersonas = document.createElement("i")
        iconPersonas.classList.add("fa-regular", "fa-user")
        const personas = document.createElement("p")
        personas.textContent = "Personas: "  + reserva.cantidad
        divPersonas.appendChild(iconPersonas)
        divPersonas.appendChild(personas)
        divPersonas.classList.add("card-item")

        const divMesa = document.createElement("div")
        const iconMesa = document.createElement("i")
        iconMesa.classList.add("fa-solid", "fa-chair")
        const mesa = document.createElement("p")
        mesa.textContent = "Mesa: " + reserva.id_mesa
        divMesa.appendChild(iconMesa)
        divMesa.appendChild(mesa)
        divMesa.classList.add("card-item")


        const estadoContainer = document.createElement("div")
        const iconEstado = document.createElement("i")
        iconEstado.classList.add("fa-regular", "fa-square-check")
        estadoContainer.classList.add("estado-container")
        estadoContainer.classList.add("card-item")

        const estado = document.createElement("p")
        const estadoText = document.createElement("p")
        estadoText.textContent =  "Estado: " 
        estado.textContent = reserva.estado
        estado.classList.add(reserva.estado)
        estadoContainer.appendChild(iconEstado)
        estadoContainer.appendChild(estadoText)
        estadoContainer.appendChild(estado)
     

        divCard.appendChild(divTitle)
        cardBody.appendChild(divHora)
        cardBody.appendChild(divPersonas)
        cardBody.appendChild(divMesa)
        cardBody.appendChild(estadoContainer)
        divCard.appendChild(cardBody)

        reservasContainer.appendChild(divCard)
    })
    

}


const cancelarReserva = async (fecha: string, reserva: number) => {
    const confirmed = confirm(`¿Estás seguro de que deseas cancelar la reserva del ${fecha} ?`);

    if(confirmed){
        try{
            const respuesta =  await fetch("/api/misReservas", {
                method: 'DELETE',
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: reserva
                })
            })

            const resJSon = await respuesta.json()
            alert(resJSon.message)
            setTimeout(() => {
                window.location.reload()
            }, 1500);
            

        }catch(err){
            console.error("Error al cancelar reserva")
        }

    }else{
        window.location.reload()
    }
}