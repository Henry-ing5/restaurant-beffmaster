function togglePassword() {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
}

async function navegarlogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Por favor completa todos los campos");
        return;
    }

    try {
        // Conectar con el backend para verificar credenciales
        const response = await fetch('http://localhost:5000/verificar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: email,
                password: password
            })
        });

        const resultado = await response.json();
        console.log("Respuesta del servidor:", resultado);

        if (response.ok && resultado.existe) {
            // Guardar sesión en localStorage con todos los datos del cliente
            localStorage.setItem("usuarioAutenticado", JSON.stringify({
                email: email,
                nombre: resultado.nombre,
                telefono: resultado.telefono,
                folio: resultado.folio,
                timestamp: new Date().getTime()
            }));
            
            console.log("Usuario autenticado, redirigiendo a secciones");
            // Redirigir a secciones
            window.location.href = "secciones.html";
        } else {
            // Mostrar error
            const mensajeError = resultado.error || "Correo o contraseña incorrectos";
            console.error("Error de autenticación:", mensajeError);
            document.getElementById("mensaje-error-login").textContent = mensajeError;
            document.getElementById("modal-error-login").style.display = "flex";
        }
    } catch (error) {
        console.error("Error en login:", error);
        document.getElementById("mensaje-error-login").textContent = "Error al conectar con el servidor. Asegúrate de que el backend está corriendo en localhost:5000";
        document.getElementById("modal-error-login").style.display = "flex";
    }
}

function navegarregistro() {
    // Redirigir a página de registro unificada
    window.location.href = "registro.html";
}

function cerrarModalErrorLogin() {
    document.getElementById("modal-error-login").style.display = "none";
}


