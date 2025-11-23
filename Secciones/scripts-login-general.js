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
        // Buscar cliente en Firestore por email
        const clientesRef = db.collection('clientes');
        const snapshot = await clientesRef.where('email', '==', email).get();

        if (snapshot.empty) {
            // No se encontró el correo
            document.getElementById("mensaje-error-login").textContent = "Correo no registrado";
            document.getElementById("modal-error-login").style.display = "flex";
            return;
        }

        // Obtener el primer (y único) documento
        const clienteDoc = snapshot.docs[0];
        const cliente = clienteDoc.data();

        // Verificar contraseña (texto plano)
        if (cliente.password === password) {
            // Guardar sesión en localStorage con todos los datos del cliente
            localStorage.setItem("usuarioAutenticado", JSON.stringify({
                email: email,
                nombre: cliente.nombre,
                telefono: cliente.telefono,
                folio: clienteDoc.id, // Usar el ID del documento como folio
                timestamp: new Date().getTime()
            }));
            
            console.log("Usuario autenticado, redirigiendo a secciones");
            // Redirigir a secciones
            window.location.href = "secciones.html";
        } else {
            // Contraseña incorrecta
            document.getElementById("mensaje-error-login").textContent = "Contraseña incorrecta";
            document.getElementById("modal-error-login").style.display = "flex";
        }
    } catch (error) {
        console.error("Error en login:", error);
        document.getElementById("mensaje-error-login").textContent = "Error al iniciar sesión. Verifica tu conexión a Internet.";
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


