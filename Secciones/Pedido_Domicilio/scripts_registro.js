async function irASiguiente() {
    // Obtener valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();

    // Validaciones
    if (!nombre || nombre.length < 3) {
        alert('Nombre debe tener al menos 3 caracteres');
        return;
    }
    
    if (!telefono || !/^\d{10}$/.test(telefono)) {
        alert('Teléfono debe tener 10 dígitos');
        return;
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert('Correo electrónico inválido');
        return;
    }

    try {
        // Registrar cliente en backend
        const response = await fetch('http://localhost:5000/registrar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, correo })
        });

        const resultado = await response.json();

        if (!response.ok) {
            throw new Error(resultado.error || "Error en el registro");
        }

        // Guardar todos los datos en sesión
        sessionStorage.setItem('cliente', JSON.stringify({
            folio: resultado.folio,
            nombre: resultado.nombre,
            telefono: resultado.telefono,
            email: resultado.correo
        }));

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
function cerrarModal() {
    document.getElementById('modal-exito').style.display = 'none';
    window.location.href = "login.html";
}

// Función para cerrar modal de error
function cerrarModalErrorRegistro() {
    document.getElementById('modal-error-registro').style.display = 'none';
}