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
        localStorage.setItem('cortesSeleccionados', JSON.stringify(itemsArray));
        localStorage.setItem('subtotalCortes', total);
    }
    
    // Función para actualizar la sección de selecciones
    function updateSelections() {
        const container = document.getElementById('selected-items-cortes');
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
        menuItemsContainer.innerHTML = '<p>Cargando cortes...</p>';
    }
    
    // Función para mostrar error detallado
    function showError(error) {
        console.error('Error completo:', error);
        menuItemsContainer.innerHTML = `
            <div style="color: red; padding: 20px;">
                <h3>Error al cargar los cortes</h3>
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
    
    // Función para cargar cortes con mejor manejo de errores
    async function cargarCortes() {
        try {
            showLoading();
            
            console.log('Intentando conectar a: http://localhost:5000/obtener-cortes');
            
            const response = await fetch('http://localhost:5000/obtener-cortes', {
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
            
            const cortes = await response.json();
            console.log('Cortes recibidos:', cortes);
            
            if (!Array.isArray(cortes)) {
                throw new Error('La respuesta no es un array válido');
            }
            
            // Limpiar el contenedor
            menuItemsContainer.innerHTML = '';
            
            cortes.forEach(corte => {
                // Validar que el corte tenga los campos necesarios
                if (!corte.nombre || corte.precio === undefined) {
                    console.warn('Corte inválido:', corte);
                    return;
                }
                
                prices[corte.nombre] = parseFloat(corte.precio);
                selectedItems[corte.nombre] = 0;
                
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <div class="item-details">
                        <h3>${corte.nombre}</h3>
                        <p>${corte.descripcion || 'Sin descripción'}</p>
                        <div class="price">$${parseFloat(corte.precio).toFixed(2)} pesos</div>
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
                        selectedItems[corte.nombre] = currentValue;
                        updateSelections();
                        updateSubtotal();
                    }
                });
                
                increaseBtn.addEventListener('click', function() {
                    let currentValue = parseInt(quantityInput.value) || 0;
                    currentValue++;
                    quantityInput.value = currentValue;
                    selectedItems[corte.nombre] = currentValue;
                    updateSelections();
                    updateSubtotal();
                });
                
                quantityInput.addEventListener('change', function() {
                    let currentValue = parseInt(this.value) || 0;
                    this.value = currentValue;
                    selectedItems[corte.nombre] = currentValue;
                    updateSelections();
                    updateSubtotal();
                });
            });
            
            console.log('Cortes cargados exitosamente');
            
        } catch (error) {
            console.error('Error al cargar cortes:', error);
            showError(error);
        }
    }
    
    // Cargar cortes al iniciar
    cargarCortes();
});