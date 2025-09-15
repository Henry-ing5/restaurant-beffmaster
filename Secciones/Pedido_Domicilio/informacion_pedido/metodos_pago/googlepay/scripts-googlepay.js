document.addEventListener('DOMContentLoaded', function() {
    // Botón de Google Pay redirige a la página de confirmación
    document.getElementById('gpay-button').addEventListener('click', function() {
        window.location.href = '../confirmacion/confirmacion.html';
    });

    // Botón de volver redirige a la página de métodos de pago
    document.getElementById('back-button').addEventListener('click', function() {
        window.location.href = '../metodos_pago.html';
    });
});