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
        // Verificar si el correo ya está registrado
        const clientesRef = db.collection('clientes');
        const emailQuery = await clientesRef.where('email', '==', correo).get();
        
        if (!emailQuery.empty) {
            throw new Error("Correo ya está registrado. Use otro.");
        }

        // Verificar si el teléfono ya está registrado
        const telefonoQuery = await clientesRef.where('telefono', '==', telefono).get();
        
        if (!telefonoQuery.empty) {
            throw new Error("Teléfono ya está registrado. Use otro.");
        }

        // Registrar cliente en Firestore (sin encriptar la contraseña)
        await clientesRef.add({
            nombre: nombre,
            telefono: telefono,
            email: correo,
            password: password, // Guardar en texto plano
            fecha_registro: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Mostrar modal de éxito
        document.getElementById('modal-exito').style.display = 'flex';
        
    } catch (error) {
        const modalError = document.getElementById('modal-error-registro');
        const mensajeError = document.getElementById('mensaje-error-registro');
        mensajeError.textContent = error.message;
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

function volverAlLogin() {
    window.location.href = "login.html";
}
