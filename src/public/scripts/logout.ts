const logoutBtnMain = document.getElementById("button-nav") as HTMLButtonElement
const logoutBtnSecond = document.getElementById("button-nav-second") as HTMLButtonElement

logoutBtnMain.addEventListener("click", async () => {
    logout()
})

logoutBtnSecond.addEventListener("click", async () => {
    logout()
})


const logout = async () => {
    try {

        const res: Response = await fetch("/api/logout", {
            method: 'POST',
            credentials: "include"
        })

        if (res.ok) {
            const response = await res.json()
            window.location.href = response.redirect
        }

    } catch (err) {
        console.error("ERROR AL CERRAR SESION")
    }
}