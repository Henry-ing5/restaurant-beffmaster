const form = document.getElementById('form-tarjeta'); // Captura el formulario

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if(validarFormulario()) {
        localStorage.setItem('metodoPago', 'tarjeta');
        window.location.href = '../confirmacion/confirmacion.html'; // Redirección
    } else {
        alert("⚠️ Completa todos los campos correctamente");
    }
});

function validarFormulario() {
    let valido = true;
    const campos = form.querySelectorAll('input');

    campos.forEach(input => {
        input.style.borderColor = '#e0e0e0';
        
        // Validación para CVV
        if (input.id === 'cvv' && !/^\d{3,4}$/.test(input.value)) {
            input.style.borderColor = '#e74c3c';
            valido = false;
        }
        
        // Validación para código postal
        if (input.id === 'cp' && !/^\d{5}$/.test(input.value)) {
            input.style.borderColor = '#e74c3c';
            valido = false;
        }
        
        // Validación para fecha de expiración (MM/AA)
        if (input.id === 'expiracion' && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(input.value)) {
            input.style.borderColor = '#e74c3c';
            valido = false;
        }
        
        if(!input.checkValidity()) {
            input.style.borderColor = '#e74c3c';
            valido = false;
        }
    });

    return valido;
}