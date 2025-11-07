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
        
        subtotalElement.textContent = `$${total.toFixed(2)} pesos`;
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
    
    // Inicializar los precios y configurar eventos
    function initializeMenu() {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(menuItem => {
            const titleElement = menuItem.querySelector('h3');
            const priceElement = menuItem.querySelector('.price');
            const decreaseBtn = menuItem.querySelector('.decrease-btn');
            const increaseBtn = menuItem.querySelector('.increase-btn');
            const quantityInput = menuItem.querySelector('.quantity-input');
            
            const itemName = titleElement.textContent;
            const priceText = priceElement.textContent;
            const price = parseFloat(priceText.replace('$', '').replace(' pesos', ''));
            
            // Guardar precio en el objeto
            prices[itemName] = price;
            selectedItems[itemName] = 0;
            
            // Configurar eventos para los botones
            decreaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value) || 0;
                if (currentValue > 0) {
                    currentValue--;
                    quantityInput.value = currentValue;
                    selectedItems[itemName] = currentValue;
                    updateSelections();
                    updateSubtotal();
                }
            });
            
            increaseBtn.addEventListener('click', function() {
                let currentValue = parseInt(quantityInput.value) || 0;
                currentValue++;
                quantityInput.value = currentValue;
                selectedItems[itemName] = currentValue;
                updateSelections();
                updateSubtotal();
            });
            
            quantityInput.addEventListener('change', function() {
                let currentValue = parseInt(this.value) || 0;
                this.value = currentValue;
                selectedItems[itemName] = currentValue;
                updateSelections();
                updateSubtotal();
            });
        });
        
        // Inicializar subtotal
        updateSubtotal();
    }

    // Configurar el botón de siguiente
    const nextBtn = document.getElementById('bebidas-next');
    nextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
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

    // Inicializar el menú
    initializeMenu();
});