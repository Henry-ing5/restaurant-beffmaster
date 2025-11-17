async function navegarlogin() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const loading = document.getElementById('loading');
    
    // Validación básica de correo
    if (!email || !email.includes('@')) {
        mostrarErrorLogin('Ingrese un correo válido');
        return;
    }

    if (!password) {
        mostrarErrorLogin('Ingrese su contraseña');
        return;
    }

    try {
        loading.style.display = 'flex';
        
        // Verificar cliente en backend
        const response = await fetch('http://localhost:5000/verificar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                correo: email, 
                password: password 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la verificación');
        }

        if (data.existe) {
            // Guardar TODOS los datos del cliente en sesión
            sessionStorage.setItem('cliente', JSON.stringify({
                folio: data.folio,
                nombre: data.nombre,
                telefono: data.telefono,
                email: email
            }));
            
            // Guardar customerId para usar en otras páginas
            localStorage.setItem('customerId', data.folio);
            
            window.location.href = "reserva.html";
        } else {
            mostrarErrorLogin('Correo o contraseña incorrectos');
        }
    } catch (error) {
        mostrarErrorLogin(error.message || 'Error de conexión');
    } finally {
        loading.style.display = 'none';
    }
}

function mostrarErrorLogin(mensaje) {
    const modalError = document.getElementById('modal-error-login');
    const mensajeError = document.getElementById('mensaje-error-login');
    mensajeError.textContent = mensaje;
    modalError.style.display = 'flex';
}

// Función de redirección a registro
function navegarregistro() {
    sessionStorage.removeItem('cliente');
    window.location.href = "registro.html";
}

// Función para cerrar modal de error
function cerrarModalErrorLogin() {
    document.getElementById('modal-error-login').style.display = 'none';
}

// Función para mostrar/ocultar contraseña
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}