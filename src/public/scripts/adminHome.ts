const tbody = document.getElementById("todayReserves-body") as HTMLTableElement
const reserveContent = document.getElementsByClassName("reserve-content")[0] as HTMLParagraphElement
const peopleContent = document.getElementsByClassName("people-content")[0] as HTMLParagraphElement
const inputSearch = document.getElementById("inputSearch") as HTMLInputElement
const dateContainer = document.getElementById("date") as HTMLDivElement
const leftArrow = document.getElementById("leftArrow") as HTMLIFrameElement
const rightArrow = document.getElementById("rightArrow") as HTMLIFrameElement
let userAmount: number = 0
let reservesAmount: number = 0
const statusOptions: string[] = ["Pendiente", "Aprobada", "Cancelada", "Finalizada"]
const date: Date = new Date()

const formatDate = (fecha: Date): string => {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

window.addEventListener("DOMContentLoaded", async () =>{
    const fecha: string = formatDate(date)
    dateContainer.textContent = fecha
    const reservas = await reservesToday(fecha)
    createTable(reservas)
})

leftArrow.addEventListener("click", () => changeDay(-1))
rightArrow.addEventListener("click", () => changeDay(1))

const changeDay = async (dia: number) => {
    date.setDate(date.getDate() + dia)
    const fechaFormateada = formatDate(date)
    dateContainer.textContent = fechaFormateada
    const reservas = await reservesToday(fechaFormateada)
    createTable(reservas)
}

const reservesToday = async (fecha: string) => {
    try {
        const res = await fetch("/api/today", {
            method: "POST",
            credentials: 'include',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                date: fecha
            })
        })

        const resJson = await res.json()
        return resJson.today
    } catch (err) {
        console.error("Error en las reservas")
    }

}



const createTable = async (reserves: any) => {
    tbody.textContent = ""
    reservesAmount = 0
    userAmount = 0
    reserves.forEach((reserve: any) => {
        reservesAmount += 1
        const tr = document.createElement("tr") as HTMLTableRowElement
        const tdHour = document.createElement("td") as HTMLTableCellElement
        tdHour.textContent = reserve.hora
        tdHour.style.color = "#fea941"

        const tdName = document.createElement("td") as HTMLTableCellElement
        tdName.textContent = reserve.nombre + " " + reserve.apellido
        tdName.style.fontWeight = "bold"

        const tdTable = document.createElement("td") as HTMLTableCellElement
        tdTable.textContent = "Mesa: " + reserve.mesa
        tdTable.style.color = "rgb(119 113 113 / 83%)"

        const tdAmount = document.createElement("td") as HTMLTableCellElement
        tdAmount.textContent = "Cantidad: " + reserve.cantidad
        userAmount += reserve.cantidad
        tdAmount.style.color = "rgb(119 113 113 / 83%)"

        const tdStatus = document.createElement("td") as HTMLTableCellElement
        const selectStatus = document.createElement("select") as HTMLSelectElement

        statusOptions.forEach((option) =>{
            const selectOption = document.createElement("option")
            selectOption.value = option
            selectOption.textContent = option

            if(selectOption.value.toLowerCase() === reserve.estado.toLowerCase()){
                selectOption.selected = true 
            } 

            selectStatus.appendChild(selectOption)
        })

        selectStatus.addEventListener("change", (e: Event) => {
            const event = e.target as HTMLSelectElement
            cambiarEstado(event, reserve.id)
        })

        tdStatus.appendChild(selectStatus)

        tr.appendChild(tdHour)
        tr.appendChild(tdName)
        tr.appendChild(tdTable)
        tr.appendChild(tdAmount)
        tr.appendChild(tdStatus)
        tbody.appendChild(tr)
    })
    
    reserveContent.textContent = reservesAmount.toString()
    peopleContent.textContent = userAmount.toString()
}


inputSearch.addEventListener("input", function() {
    const filtro: string = this.value.toLowerCase()
    const filas = document.querySelectorAll("#todayReserves-body tr") as NodeListOf<HTMLTableRowElement>
    filas.forEach(fila => {
        const nombre: string | undefined = fila.cells[1].textContent?.toLocaleLowerCase()
        fila.style.display = nombre?.includes(filtro) ? "" : "none"
    })
})

const cambiarEstado = async(evento: HTMLSelectElement, reserva: number) => {
    const statusSelect = evento.value
    const confirmedStatus = confirm(`¿Desea cambiar el estado de la reserva a ${statusSelect}?`);
    
    if(confirmedStatus){
        try{
            const res = await fetch("/api/updateReserve", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: reserva,
                    status: statusSelect
                })
            })
    
            const resJson = await res.json()
            alert(resJson.message)
            setTimeout(() => {
                window.location.reload()
            }, 1500);
            
        }catch(err){
            alert("Error:" + err)
            setTimeout(() => {
                window.location.reload()
            }, 500);
            
        }

    }else{
        window.location.reload()
    }
}