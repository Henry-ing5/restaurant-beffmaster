document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos del localStorage
    const pedido = JSON.parse(localStorage.getItem('pedidoCompleto')) || { cortes: [], bebidas: [] };
    
    // Mostrar ID de comensal
    document.getElementById('customer-id').textContent += localStorage.getItem('customerId');

    // Función para formatear moneda
    const formatearMoneda = (monto) => `$${monto.toFixed(2)} pesos`;

    // Mostrar cortes
    const cortesContainer = document.getElementById('resumen-cortes');
    let htmlCortes = '';
    pedido.cortes.forEach(item => {
        if (item.cantidad > 0) {
            htmlCortes += `
                <div class="item-resumen">
                    <span>${item.nombre} (x${item.cantidad})</span>
                    <span>${formatearMoneda(item.precio * item.cantidad)}</span>
                </div>
            `;
        }
    });
    cortesContainer.innerHTML = htmlCortes;

    // Mostrar bebidas
    const bebidasContainer = document.getElementById('resumen-bebidas');
    let htmlBebidas = '';
    pedido.bebidas.forEach(item => {
        if (item.cantidad > 0) {
            htmlBebidas += `
                <div class="item-resumen">
                    <span>${item.nombre} (x${item.cantidad})</span>
                    <span>${formatearMoneda(item.precio * item.cantidad)}</span>
                </div>
            `;
        }
    });
    bebidasContainer.innerHTML = htmlBebidas;

    // Calcular totales
    const subtotalCortes = pedido.subtotalCortes || 0;
    const subtotalBebidas = pedido.subtotalBebidas || 0;
    const iva = (subtotalCortes + subtotalBebidas) * 0.16;
    const total = subtotalCortes + subtotalBebidas + iva;

    // Actualizar totales
    document.getElementById('subtotal-cortes').textContent = formatearMoneda(subtotalCortes);
    document.getElementById('subtotal-bebidas').textContent = formatearMoneda(subtotalBebidas);
    document.getElementById('iva').textContent = formatearMoneda(iva);
    document.getElementById('total-pagar').textContent = formatearMoneda(total);
});