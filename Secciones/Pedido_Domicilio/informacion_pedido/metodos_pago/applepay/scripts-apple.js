document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-applepay');

    // Validación del código de verificación
    document.getElementById('verificacion').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').substring(0, 6);
    });

    // Envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if(validarFormulario()) {
            // Simular autenticación biométrica
            localStorage.setItem('metodoPago', 'applepay');
            window.location.href = 'confirmacion.html';
        }
    });

    function validarFormulario() {
        let valido = true;
        const campos = form.querySelectorAll('input');

        campos.forEach(input => {
            input.style.borderColor = '#e0e0e0';
            
            if(!input.checkValidity()) {
                input.style.borderColor = '#ff3b30';
                valido = false;
            }
        });

        return valido;
    }
});