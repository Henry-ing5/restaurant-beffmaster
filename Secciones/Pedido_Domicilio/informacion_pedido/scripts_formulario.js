document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".delivery-form");
    const cliente = JSON.parse(sessionStorage.getItem("cliente")) || {};

    // Autocompletar campos bloqueados
    const autocompletarCampos = () => {
        document.getElementById('nombre').value = cliente.nombre || "";
        document.getElementById('telefono').value = cliente.telefono || "";
        document.getElementById('nombre').readOnly = true;
        document.getElementById('telefono').readOnly = true;
    };
    if (cliente.folio) autocompletarCampos();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del pedido
        const pedidoCompleto = JSON.parse(localStorage.getItem('pedidoCompleto')) || {};
        const totalPedido = parseFloat(localStorage.getItem('totalPedido')) || 0;

        // Preparar datos para backend
        const datos = {
            cliente_folio: cliente.folio,
            direccion: document.getElementById('direccion').value.trim(),
            referencia: document.getElementById('referencia').value.trim(),
            alimentos: {
                cortes: pedidoCompleto.cortes.map(item => item.nombre),
                bebidas: pedidoCompleto.bebidas.map(item => item.nombre)
            },
            total: totalPedido
        };

        // Validar campos
        if (!datos.direccion || !datos.referencia) {
            alert('Complete dirección y referencia');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/guardar-domicilio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();
            
            if (!response.ok) throw new Error(resultado.error);

            // Guardar folio_d en sessionStorage para usar en confirmación
            sessionStorage.setItem('ultimoFolio', resultado.folio);

            // Redirección ORIGINAL sin cambios
            window.location.href = "metodos_pago/metodos_pago.html";
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});