const loginForm = document.getElementById("user-form") as HTMLFormElement
const mensajeLogin = document.getElementById("message") as HTMLParagraphElement

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    try{
        const loginFormData = new FormData(loginForm);

        const data = {
            usuario: loginFormData.get("usuario") as string,
            contraseña: loginFormData.get("contraseña") as string
        }

        console.log( data)
    
        const respuesta = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
    
        if(!respuesta.ok){
            throw new Error("Error al iniciar sesion")
        }

        const resJson = await respuesta.json();

        window.location.href = resJson.redirect

    }catch(err){
        mensajeLogin.textContent = "Error al iniciar sesion"
        mensajeLogin.style.display = "block"
        mensajeLogin.style.color = "red"
        console.log("Error:", err)
    }

})