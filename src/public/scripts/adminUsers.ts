const userTbody = document.getElementById("users-body") as HTMLTableElement
const userInputSearch = document.getElementById("inputSearch") as HTMLInputElement
const modifyForm = document.getElementById("user-form") as HTMLFormElement
const passwordForm = document.getElementById("contraseña") as HTMLInputElement
const message = document.getElementById("message") as HTMLParagraphElement

window.addEventListener("DOMContentLoaded", async () => {
    const users = await allUsers()
    createUsersTable(users)
})



const allUsers = async () => {
    try {
        const res = await fetch("/api/allUsers", {
            method: "GET"
        })

        const resJson = await res.json()
        console.log(resJson)
        return resJson.users
    } catch (err) {
        console.error("Error al mostrar usuarios")
    }
}


const createUsersTable = async (users: any) => {
    userTbody.textContent = ""
    users.forEach((user: any) => {
        const tr = document.createElement("tr") as HTMLTableRowElement
        const tdUserName = document.createElement("td") as HTMLTableCellElement
        tdUserName.textContent = user.usuario
        tdUserName.style.fontWeight = "bold"

        const tdName = document.createElement("td") as HTMLTableCellElement
        tdName.textContent = user.nombre + " " + user.apellido


        const tdMail = document.createElement("td") as HTMLTableCellElement
        tdMail.textContent = "Correo: " + user.correo
        tdMail.style.color = "rgb(119 113 113 / 83%)"

        const tdRol = document.createElement("td") as HTMLTableCellElement
        tdRol.textContent = "Rol: " + user.rol
        tdRol.style.color = "rgb(119 113 113 / 83%)"

        const tdi = document.createElement("td") as HTMLTableCellElement
        const i = document.createElement("i") as HTMLIFrameElement
        i.classList.add("fa-solid", "fa-pen")
        i.addEventListener("click", () => {

            loadForm(user)
        })
        tdi.appendChild(i)

        tr.appendChild(tdUserName)
        tr.appendChild(tdName)
        tr.appendChild(tdMail)
        tr.appendChild(tdRol)
        tr.appendChild(tdi)
        userTbody.appendChild(tr)
    })

}

modifyForm.addEventListener("submit", (event) => {
    event.preventDefault()
    const formData = new FormData(modifyForm)
    modifyUser(formData)
})

const modifyUser = async (info: FormData) => {
    let res: any
    try {
        const changes = {
            id: info.get("userId") as string,
            nombre: info.get("nombre") as string,
            apellido: info.get("apellido") as string,
            correo: info.get("correo") as string,
            usuario: info.get("usuario") as string,
            contraseña: info.get("contraseña") as string
        }

        res = await fetch("/api/modifyUser", {
            method: "POST",
            credentials: 'include',
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                data: changes
            })
        })

        const resJson = await res.json()
        message.textContent = resJson.message

        setTimeout(() => {
            modifyForm.reset()
            message.textContent = ""
        }, 1200);

    } catch (err) {
        const resJson = await res.json()
        message.textContent = resJson.message
        message.style.color = "red"

        setTimeout(() => {
            modifyForm.reset()
            message.textContent = ""
        }, 1200);
    }
}

userInputSearch.addEventListener("input", function () {
    const filtro: string = this.value.toLowerCase()
    const filas = document.querySelectorAll("#users-body tr") as NodeListOf<HTMLTableRowElement>
    filas.forEach(fila => {
        const nombre: string | undefined = fila.cells[1].textContent?.toLocaleLowerCase()
        fila.style.display = nombre?.includes(filtro) ? "" : "none"
    })
})


const loadForm = (user: any) => {
    modifyForm.userId.value = user.id_usuario
    modifyForm.nombre.value = user.nombre
    modifyForm.apellido.value = user.apellido
    modifyForm.correo.value = user.correo
    modifyForm.usuario.value = user.usuario
}

const togglePasswordField = () => {
    passwordForm.disabled = !passwordForm.disabled
    if (passwordForm.disabled) passwordForm.value = ""
}