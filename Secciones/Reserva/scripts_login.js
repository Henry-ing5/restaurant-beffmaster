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
            // Guardar datos CORRECTAMENTE
            sessionStorage.setItem('cliente', JSON.stringify({
                folio: data.folio,
                nombre: data.nombre,
                telefono: data.telefono,
                correo: email
            }));
            
            window.location.href = "reserva.html";
        } else {
        document.getElementById('modal-error-login').style.display = 'flex';
        } 
    } catch (error) {
        alert(error.message || 'Error de conexión');
    } finally {
        loading.style.display = 'none';
    }
}

function navegarregistro() {
    sessionStorage.removeItem('cliente');
    window.location.href = "registro.html";
}

function cerrarModalErrorLogin() {
    document.getElementById('modal-error-login').style.display = 'none';
}