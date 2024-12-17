const formulario = document.getElementById("user-form") as HTMLFormElement
const mensaje = document.getElementById("message") as HTMLParagraphElement

formulario?.addEventListener("submit", async (e) => {
    e.preventDefault()
    try {

        const formData = new FormData(formulario);

        const data = {
            nombre: formData.get("nombre") as string,
            apellido: formData.get("apellido") as string,
            usuario: formData.get("usuario") as string,
            correo: formData.get("correo") as string,
            contraseña: formData.get("contraseña") as string
        }

        console.log( data)
        const respuesta = await fetch("/api/register", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })


        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`)
        }


        formulario.reset()
        console.log("Usuario creado con exito")
        mensaje.style.display = "block";
        const resJSON = await respuesta.json()

        setTimeout(() => {
            window.location.href = resJSON.redirect
        }, 2000);


    } catch (err) {
        mensaje.textContent = "Error al crear usuario"
        mensaje.style.display = "block"
        mensaje.style.color = "red"
        console.log("error:", err)
    }
})