async function navegarlogin() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const loading = document.getElementById('loading');
    
    // Validación básica de correo
    if (!email || !email.includes('@')) {
        alert('Ingrese un correo válido');
        return;
    }

    try {
        loading.style.display = 'flex';
        
        // Verificar cliente en backend
        const response = await fetch('http://localhost:5000/verificar-cliente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: email })
        });

        const data = await response.json();


        if (data.existe) {
            // Guardar TODOS los datos del cliente en sesión
            sessionStorage.setItem('cliente', JSON.stringify({
                folio: data.folio,
                nombre: data.nombre,
                telefono: data.telefono,
                email: email
            }));
            window.location.href = "menu_cortes/cortes.html";
        } else {
            document.getElementById('modal-error-login').style.display = 'flex';
        }
    } catch (error) {
        alert(error.message || 'Error de conexión');
    } finally {
        loading.style.display = 'none';
    }
}

// Función de redirección a registro
function navegarregistro() {
    sessionStorage.removeItem('cliente'); // Limpiar sesión previa
    window.location.href = "registro.html";
}

// Función para cerrar modal de error
function cerrarModalErrorLogin() {
    document.getElementById('modal-error-login').style.display = 'none';
}