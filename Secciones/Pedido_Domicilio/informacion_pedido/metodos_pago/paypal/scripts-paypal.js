document.addEventListener('DOMContentLoaded', function() {
    // Botón de PayPal redirige a la página de confirmación
    document.getElementById('paypal-button').addEventListener('click', function() {
        window.location.href = '../confirmacion/confirmacion.html';
    });

    // Botón de volver redirige a la página de métodos de pago
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = '../metodos_pago.html';
    });
});