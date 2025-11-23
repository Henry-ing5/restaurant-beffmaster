document.addEventListener('DOMContentLoaded', () => {
    // Función para guardar el método de pago y redirigir
    const seleccionarMetodoPago = async (metodo) => {
        try {
            const folio_d = sessionStorage.getItem('ultimoFolio');
            if (!folio_d) {
                alert("Error: No se encontró el folio del pedido");
                return;
            }

            // Guardar en sessionStorage para uso en la página de confirmación
            sessionStorage.setItem('metodoPago', metodo);
            
            // Actualizar el pedido en Firestore con el método de pago
            await db.collection('domicilios').doc(folio_d).update({
                metodo_pago: metodo
            });


            // Redirigir a la página correspondiente según el método de pago
            let ruta;
            switch(metodo) {
                case 'Tarjeta':
                    ruta = 'tarjeta/tarjeta.html';
                    break;
                case 'Apple Pay':
                    ruta = 'applepay/apple.html';
                    break;
                case 'Google Pay':
                    ruta = 'googlepay/googlepay.html';
                    break;
                case 'PayPal':
                    ruta = 'paypal/paypal.html';
                    break;
                case 'Mercado Pago':
                    ruta = 'mercadopago/mercadopago.html';
                    break;
                case 'Efectivo':
                    ruta = 'confirmacion/confirmacion.html';
                    break;
                default:
                    ruta = 'confirmacion/confirmacion.html';
            }
            
            window.location.href = ruta;
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    // Asignar los event listeners para cada método de pago
    document.getElementById('tarjeta-btn').addEventListener('click', () => {
        seleccionarMetodoPago('Tarjeta');
    });

    document.getElementById('applepay-btn').addEventListener('click', () => {
        seleccionarMetodoPago('Apple Pay');
    });
    
    document.getElementById('googlepay-btn').addEventListener('click', () => {
        seleccionarMetodoPago('Google Pay');
    });
    
    document.getElementById('paypal-btn').addEventListener('click', () => {
        seleccionarMetodoPago('PayPal');
    });
    
    document.getElementById('efectivo-btn').addEventListener('click', () => {
        seleccionarMetodoPago('Efectivo');
    });
    
    document.getElementById('mercadopago-btn').addEventListener('click', () => {
        seleccionarMetodoPago('Mercado Pago');
    });
});