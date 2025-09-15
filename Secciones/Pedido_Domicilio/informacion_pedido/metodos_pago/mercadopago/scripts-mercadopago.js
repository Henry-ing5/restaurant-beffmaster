document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar opción de pago
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            // Quitar la clase 'selected' de todas las opciones
            paymentOptions.forEach(function(opt) {
                opt.classList.remove('selected');
            });
            
            // Agregar la clase 'selected' a la opción seleccionada
            this.classList.add('selected');
        });
    });
    
    // Botón de pago redirige a la página de confirmación
    document.getElementById('pay-button').addEventListener('click', function() {
        const selectedOption = document.querySelector('.payment-option.selected');
        
        if (selectedOption) {
            window.location.href = '../confirmacion/confirmacion.html';
        } else {
            alert('Por favor, seleccione un método de pago');
        }
    });

    // Botón de volver redirige a la página de métodos de pago
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = '../metodos_pago.html';
    });
});