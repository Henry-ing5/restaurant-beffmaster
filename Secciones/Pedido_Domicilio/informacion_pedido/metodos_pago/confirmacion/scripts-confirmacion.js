document.addEventListener('DOMContentLoaded', async () => {
    const downloadBtn = document.getElementById('download-btn');
    const restaurante = {
        nombre: "BEEFMASTER",
        telefono: "55 1234 5678",
        iva: 16
    };

    // Obtener precios desde la base de datos
    let precios = {};

    try {
        // Obtener cortes y bebidas
        const [cortesRes, bebidasRes] = await Promise.all([
            fetch('http://localhost:5000/obtener-cortes'),
            fetch('http://localhost:5000/obtener-bebidas')
        ]);
        
        const cortes = await cortesRes.json();
        const bebidas = await bebidasRes.json();
        
        // Combinar en un solo objeto de precios - CONVERSIÓN A NÚMERO
        cortes.forEach(corte => {
            precios[corte.nombre] = parseFloat(corte.precio) || 0;
        });
        bebidas.forEach(bebida => {
            precios[bebida.nombre] = parseFloat(bebida.precio) || 0;
        });
    } catch (error) {
        console.error("Error al obtener precios:", error);
        // Precios por defecto en caso de error
        precios = {
            'COWBOY': 385,
            'NEW YORK ANGUS': 615,
            'PICANHADA PRIME': 460,
            'RIB EYE': 305,
            'COSTILLA BOTANERA': 180,
            'MARGARITA': 100,
            'PIÑA COLADA': 100,
            'CERVEZA': 100,
            'VINO ROJO': 100,
            'COCA COLA 600 ML': 40
        };
    }

    downloadBtn.addEventListener('click', async () => {
        try {
            // 1. Obtener folio_d desde sessionStorage
            const folio_d = sessionStorage.getItem('ultimoFolio');
            if (!folio_d) throw new Error("No se encontró número de pedido");

            // 2. Obtener datos del backend (solo nombres)
            const response = await fetch(`http://localhost:5000/obtener-pedido/${folio_d}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Error al obtener pedido");
            }
            const pedido = await response.json();

            // 3. Obtener cantidades desde localStorage
            const pedidoCompleto = JSON.parse(localStorage.getItem('pedidoCompleto')) || { 
                cortes: [], 
                bebidas: [] 
            };

            // 4. Configurar PDF
            window.jsPDF = window.jspdf.jsPDF;
            const doc = new jsPDF();

            // ========== ENCABEZADO ==========
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.text(restaurante.nombre, 15, 20);
            doc.setFontSize(10);
            doc.text(`Teléfono: ${restaurante.telefono}`, 15, 28);

            // ========== DATOS DEL CLIENTE ==========
            doc.setFontSize(12);
            doc.text("DATOS DEL CLIENTE", 15, 40);
            doc.setFont("helvetica", "normal");
            doc.text(`• Nombre: ${pedido.nombre}`, 15, 48);
            doc.text(`• Teléfono: ${pedido.telefono}`, 15, 56);
            doc.text(`• Dirección: ${pedido.direccion}`, 15, 64);
            doc.text(`• Referencia: ${pedido.referencia}`, 15, 72);

            // ========== TABLA DE PRODUCTOS ==========
            const headers = [["Producto", "Cantidad", "Subtotal"]];
            const rows = [];

            // Procesar cortes (combinar datos BD + localStorage)
            pedido.cortes.forEach(nombre => {
                const item = pedidoCompleto.cortes.find(c => c.nombre === nombre);
                const cantidad = item ? parseInt(item.cantidad) || 1 : 1;
                const precio = parseFloat(precios[nombre]) || 0; // CONVERSIÓN EXPLÍCITA
                const subtotal = precio * cantidad;
                
                rows.push([
                    nombre,
                    cantidad.toString(),
                    `${subtotal.toFixed(2)}`
                ]);
            });

            // Procesar bebidas
            pedido.bebidas.forEach(nombre => {
                const item = pedidoCompleto.bebidas.find(b => b.nombre === nombre);
                const cantidad = item ? parseInt(item.cantidad) || 1 : 1;
                const precio = parseFloat(precios[nombre]) || 0; // CONVERSIÓN EXPLÍCITA
                const subtotal = precio * cantidad;
                
                rows.push([
                    nombre,
                    cantidad.toString(),
                    `${subtotal.toFixed(2)}`
                ]);
            });

            doc.autoTable({
                startY: 80,
                head: headers,
                body: rows,
                theme: 'grid',
                headStyles: { 
                    fillColor: [76, 175, 80], // Verde
                    textColor: 255,
                    fontSize: 10
                },
                styles: { 
                    fontSize: 9,
                    cellPadding: 3
                },
                columnStyles: {
                    0: { cellWidth: 120 }, // Ancho aumentado para productos
                    1: { cellWidth: 30 },  // Cantidad
                    2: { cellWidth: 40 }   // Subtotal
                }
            });

            // ========== TOTALES ==========
            const yPos = doc.lastAutoTable.finalY + 10;
            const total = parseFloat(pedido.total) || 0; // CONVERSIÓN EXPLÍCITA
            const iva = total * (restaurante.iva / 100); // Corrección: dividir entre 100
            const totalFinal = total + iva;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("DETALLE DE PAGO", 15, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`• Subtotal: ${total.toFixed(2)}`, 15, yPos + 8);
            doc.text(`• IVA (${restaurante.iva}%): ${iva.toFixed(2)}`, 15, yPos + 16);
            doc.setFont("helvetica", "bold");
            doc.text(`• TOTAL: ${totalFinal.toFixed(2)}`, 15, yPos + 28);
            
            // Mostrar método de pago
            doc.setFont("helvetica", "bold");
            doc.text("MÉTODO DE PAGO", 15, yPos + 40);
            doc.setFont("helvetica", "normal");
            doc.text(`• ${pedido.metodo_pago || "No especificado"}`, 15, yPos + 48);

            // ========== PIE DE PÁGINA ==========
            doc.setFontSize(8);
            doc.text(`Folio del pedido: ${folio_d}`, 15, 280);
            doc.text(restaurante.telefono, 15, 285);

            // 4. Descargar PDF
            doc.save(`Ticket-${folio_d}.pdf`);

        } catch (error) {
            console.error("Error detallado:", error);
            alert(`Error al generar ticket: ${error.message}`);
        }
    });
});