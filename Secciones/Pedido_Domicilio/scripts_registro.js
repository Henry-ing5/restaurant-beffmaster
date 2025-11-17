async function irASiguiente() {
    // Obtener valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value;
    const confirmarPassword = document.getElementById('confirmar-password').value;

    // Validaciones
    if (!nombre || nombre.length < 3) {
        mostrarError('Nombre debe tener al menos 3 caracteres');
        return;
    }
    
    if (!telefono || !/^\d{10}$/.test(telefono)) {
        mostrarError('Teléfono debe tener 10 dígitos');
        return;
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        mostrarError('Correo electrónico inválido');
        return;
    }

    if (!password || password.length < 6) {
        mostrarError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    if (password !== confirmarPassword) {
        mostrarError('Las contraseñas no coinciden');
        return;
    }

    try {
        // Registrar cliente en backend
        const response = await fetch('http://localhost:5000/registrar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                nombre, 
                telefono, 
                correo, 
                password 
            })
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.error || "Error en el registro");
        }

        // No guardamos en sesión hasta que hagan login
        document.getElementById('modal-exito').style.display = 'flex';
        
    } catch (error) {
        const modalError = document.getElementById('modal-error-registro');
        const mensajeError = document.getElementById('mensaje-error-registro');
        
        if (error.message.includes('duplicad')) {
            const campo = error.message.includes('correo') ? 'Correo' : 'Teléfono';
            mensajeError.textContent = `${campo} ya está registrado. Use otro.`;
        } else {
            mensajeError.textContent = error.message;
        }
        
        modalError.style.display = 'flex';
        console.error("Detalles del error:", error);
    }
}

function mostrarError(mensaje) {
    const modalError = document.getElementById('modal-error-registro');
    const mensajeError = document.getElementById('mensaje-error-registro');
    mensajeError.textContent = mensaje;
    modalError.style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-exito').style.display = 'none';
    window.location.href = "login.html";
}

function cerrarModalErrorRegistro() {
    document.getElementById('modal-error-registro').style.display = 'none';
}