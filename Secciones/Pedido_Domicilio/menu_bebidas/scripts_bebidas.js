document.addEventListener('DOMContentLoaded', function() {
    const menuItemsContainer = document.querySelector('.menu-items');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const prices = {};
    const selectedItems = {};

    // Función para actualizar el subtotal
    function updateSubtotal() {
        let total = 0;
        const itemsArray = [];
        
        for (const item in selectedItems) {
            if (selectedItems[item] > 0) {
                total += prices[item] * selectedItems[item];
                itemsArray.push({
                    nombre: item,
                    cantidad: selectedItems[item],
                    precio: prices[item]
                });
            }
        }
        
        subtotalElement.textContent = `$${total} pesos`;
        localStorage.setItem('bebidasSeleccionadas', JSON.stringify(itemsArray));
        localStorage.setItem('subtotalBebidas', total);
    }
    
    // Función para actualizar la sección de selecciones
    function updateSelections() {
        const container = document.getElementById('selected-items-bebidas');
        container.innerHTML = '';
        
        for (const item in selectedItems) {
            if (selectedItems[item] > 0) {
                const selectedItem = document.createElement('div');
                selectedItem.className = 'selected-item';
                
                const itemName = document.createElement('h3');
                itemName.textContent = item;
                
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.className = 'quantity-input';
                quantityInput.value = selectedItems[item];
                quantityInput.min = 0;
                
                quantityInput.addEventListener('change', function() {
                    selectedItems[item] = parseInt(this.value) || 0;
                    updateSubtotal();
                    
                    // Actualizar el input en el menú principal
                    const menuItems = document.querySelectorAll('.menu-item');
                    menuItems.forEach(menuItem => {
                        const title = menuItem.querySelector('h3').textContent;
                        if (title === item) {
                            menuItem.querySelector('.quantity-input').value = this.value;
                        }
                    });
                });
                
                selectedItem.appendChild(itemName);
                selectedItem.appendChild(quantityInput);
                container.appendChild(selectedItem);
            }
        }
    }
    
    // Función para mostrar mensaje de loading
    function showLoading() {
        menuItemsContainer.innerHTML = '<p>Cargando bebidas...</p>';
    }
    
    // Función para mostrar error detallado
    function showError(error) {
        console.error('Error completo:', error);
        menuItemsContainer.innerHTML = `
            <div style="color: red; padding: 20px;">
                <h3>Error al cargar las bebidas</h3>
                <p><strong>Detalles:</strong> ${error.message}</p>
                <p><strong>Posibles causas:</strong></p>
                <ul>
                    <li>El servidor no está ejecutándose (Flask app)</li>
                    <li>Error de conexión a la base de datos</li>
                    <li>Problema de CORS</li>
                    <li>Puerto 5000 no disponible</li>
                </ul>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px; background: #007bff; color: white; border: none; cursor: pointer;">
                    Reintentar
                </button>
            </div>
        `;
    }
    
    // Función para cargar bebidas con mejor manejo de errores
    async function cargarBebidas() {
        try {
            showLoading();
            
            console.log('Intentando conectar a: http://localhost:5000/obtener-bebidas');
            
            const response = await fetch('http://localhost:5000/obtener-bebidas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Agregar timeout
                signal: AbortSignal.timeout(10000) // 10 segundos timeout
            });
            
            console.log('Respuesta recibida:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
            
            const bebidas = await response.json();
            console.log('Bebidas recibidas:', bebidas);
            
            if (!Array.isArray(bebidas)) {
                throw new Error('La respuesta no es un array válido');
            }
            
            // Limpiar el contenedor
            menuItemsContainer.innerHTML = '';
            
            bebidas.forEach(bebida => {
                // Validar que la bebida tenga los campos necesarios
                if (!bebida.nombre || bebida.precio === undefined) {
                    console.warn('Bebida inválida:', bebida);
                    return;
                }
                
                prices[bebida.nombre] = parseFloat(bebida.precio);
                selectedItems[bebida.nombre] = 0;
                
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <div class="item-details">
                        <h3>${bebida.nombre}</h3>
                        <p>${bebida.descripcion || 'Sin descripción'}</p>
                        <div class="price">$${parseFloat(bebida.precio).toFixed(2)} pesos</div>
                    </div>
                    <div class="item-controls">
                        <button class="decrease-btn">↓</button>
                        <input type="number" class="quantity-input" value="0" min="0">
                        <button class="increase-btn">↑</button>
                    </div>
                `;
                
                menuItemsContainer.appendChild(menuItem);
                
                // Configurar eventos
                const decreaseBtn = menuItem.querySelector('.decrease-btn');
                const increaseBtn = menuItem.querySelector('.increase-btn');
                const quantityInput = menuItem.querySelector('.quantity-input');
                
                decreaseBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value) || 0;
                    if (currentValue > 0) {
                        currentValue--;
                        quantityInput.value = currentValue;
                        selectedItems[bebida.nombre] = currentValue;
                        updateSelections();
                        updateSubtotal();
                    }
                });
                
                increaseBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value) || 0;
                    currentValue++;
                    quantityInput.value = currentValue;
                    selectedItems[bebida.nombre] = currentValue;
                    updateSelections();
                    updateSubtotal();
                });
                
                quantityInput.addEventListener('change', function() {
                    let currentValue = parseInt(this.value) || 0;
                    this.value = currentValue;
                    selectedItems[bebida.nombre] = currentValue;
                    updateSelections();
                    updateSubtotal();
                });
            });
            
            console.log('Bebidas cargadas exitosamente');
            
        } catch (error) {
            console.error('Error al cargar bebidas:', error);
            showError(error);
        }
    }

    // Configurar el botón de siguiente
    const nextBtn = document.getElementById('bebidas-next');
    nextBtn.addEventListener('click', function() {
        // Obtener cortes y bebidas como arrays estructurados
        const cortes = JSON.parse(localStorage.getItem('cortesSeleccionados') || '[]');
        const bebidas = Object.entries(selectedItems)
            .filter(([nombre, cantidad]) => cantidad > 0)
            .map(([nombre, cantidad]) => ({
                nombre,
                cantidad,
                precio: prices[nombre]
            }));

        // Calcular totales
        const subtotalCortes = cortes.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const subtotalBebidas = bebidas.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        const totalPedido = subtotalCortes + subtotalBebidas;
        
        // Guardar datos
        localStorage.setItem('pedidoCompleto', JSON.stringify({
            cortes,
            bebidas,
            subtotalCortes,
            subtotalBebidas
        }));
        localStorage.setItem('totalPedido', totalPedido);
        
        // Redirección
        window.location.href = '../resumen/resumen.html';
    });

    // Cargar bebidas al iniciar
    cargarBebidas();
});