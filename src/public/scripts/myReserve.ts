const reservasContainer = document.getElementById("card-reserva-container") as HTMLDivElement

const mostrarMisReservas = async () => {
    try{
        const respuesta = await fetch("http://localhost:3000/api/misReservas",{
            method: 'POST',
            credentials: 'include'
        })

        const resJson = await respuesta.json()
        reservasCard(resJson.reservas)
        console.log(resJson.reservas)    
    }catch(err){
        console.log(err)
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

        const title = document.createElement("h3");
        const fechaAdaptada = obtenerFecha(reserva.fecha)
        title.textContent = fechaAdaptada
        title.classList.add("card-title")

        const cardBody = document.createElement("div")
        cardBody.classList.add("card-body")


        const divHora = document.createElement("div")
        const hora = document.createElement("p")
        hora.textContent = "Hora: " +  reserva.hora_detalle
        divHora.appendChild(hora)
        divHora.classList.add("card-item")


        const divPersonas = document.createElement("div")
        const personas = document.createElement("p")
        personas.textContent = "Personas: "  + reserva.cantidad
        divPersonas.appendChild(personas)
        divPersonas.classList.add("card-item")

        const divMesa = document.createElement("div")
        const mesa = document.createElement("p")
        mesa.textContent = "Mesa: " + reserva.id_mesa
        divMesa.appendChild(mesa)
        divMesa.classList.add("card-item")


        const estadoContainer = document.createElement("div")
        estadoContainer.classList.add("estado-container")
        estadoContainer.classList.add("card-item")

        const estado = document.createElement("p")
        const estadoText = document.createElement("p")
        estadoText.textContent =  "Estado: " 
        estado.textContent = reserva.estado
        estado.classList.add("estado")
        
        estadoContainer.appendChild(estadoText)
        estadoContainer.appendChild(estado)
     

        divCard.appendChild(title)
        cardBody.appendChild(divHora)
        cardBody.appendChild(divPersonas)
        cardBody.appendChild(divMesa)
        cardBody.appendChild(estadoContainer)
        divCard.appendChild(cardBody)

        reservasContainer.appendChild(divCard)
    })
    

}