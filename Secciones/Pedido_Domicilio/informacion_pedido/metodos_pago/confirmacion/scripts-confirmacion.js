document.addEventListener('DOMContentLoaded', async () => {
    const downloadBtn = document.getElementById('download-btn');
    const restaurante = {
        nombre: "BEEFMASTER",
        telefono: "55 1234 5678",
        iva: 16
    };

    // Precios por defecto (pueden ser actualizados desde Firestore si tienes una colección de productos)
    const precios = {
        'COWBOY': 349,
        'NEW YORK ANGUS': 599,
        'PICAÑADA PRIME': 604,
        'RIB EYE': 438,
        'COSTILLA BOTANERA': 162,
        'MARGARITA': 30,
        'PIÑA COLADA': 120,
        'CERVEZA': 40,
        'VINO TINTO': 119,
        'COCA COLA 600 ML': 30
    };

    downloadBtn.addEventListener('click', async () => {
        try {
            // 1. Obtener folio_d desde sessionStorage (ID del documento de Firestore)
            const folio_d = sessionStorage.getItem('ultimoFolio');
            const folio_formato = sessionStorage.getItem('ultimoFolioFormato') || folio_d;
            
            if (!folio_d) throw new Error("No se encontró número de pedido");

            console.log("Obteniendo pedido con folio:", folio_d);

            // 2. Obtener datos del pedido desde Firestore
            const pedidoDoc = await db.collection('domicilios').doc(folio_d).get();
            
            if (!pedidoDoc.exists) {
                throw new Error("No se encontró el pedido en la base de datos");
            }

            const pedidoData = pedidoDoc.data();
            console.log("Datos del pedido:", pedidoData);

            // 3. Obtener datos del cliente desde Firestore
            const clienteDoc = await db.collection('clientes').doc(pedidoData.folio_cliente).get();
            
            if (!clienteDoc.exists) {
                throw new Error("No se encontraron datos del cliente");
            }

            const clienteData = clienteDoc.data();
            console.log("Datos del cliente:", clienteData);

            // 4. Obtener cantidades desde localStorage
            const pedidoCompleto = JSON.parse(localStorage.getItem('pedidoCompleto')) || { 
                cortes: [], 
                bebidas: [] 
            };

            // 5. Configurar PDF
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
            doc.text(`• Nombre: ${clienteData.nombre}`, 15, 48);
            doc.text(`• Teléfono: ${clienteData.telefono}`, 15, 56);
            doc.text(`• Dirección: ${pedidoData.direccion}`, 15, 64);
            doc.text(`• Referencia: ${pedidoData.referencia}`, 15, 72);

            // ========== TABLA DE PRODUCTOS ==========
            const headers = [["Producto", "Cantidad", "Subtotal"]];
            const rows = [];

            // Procesar cortes (combinar datos Firestore + localStorage)
            if (pedidoData.cortes && pedidoData.cortes.length > 0) {
                pedidoData.cortes.forEach(nombre => {
                    const item = pedidoCompleto.cortes.find(c => c.nombre === nombre);
                    const cantidad = item ? parseInt(item.cantidad) || 1 : 1;
                    const precio = parseFloat(precios[nombre]) || 0;
                    const subtotal = precio * cantidad;
                    
                    rows.push([
                        nombre,
                        cantidad.toString(),
                        `$${subtotal.toFixed(2)}`
                    ]);
                });
            }

            // Procesar bebidas
            if (pedidoData.bebidas && pedidoData.bebidas.length > 0) {
                pedidoData.bebidas.forEach(nombre => {
                    const item = pedidoCompleto.bebidas.find(b => b.nombre === nombre);
                    const cantidad = item ? parseInt(item.cantidad) || 1 : 1;
                    const precio = parseFloat(precios[nombre]) || 0;
                    const subtotal = precio * cantidad;
                    
                    rows.push([
                        nombre,
                        cantidad.toString(),
                        `$${subtotal.toFixed(2)}`
                    ]);
                });
            }

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
            const total = parseFloat(pedidoData.total) || 0;
            const iva = total * (restaurante.iva / 100);
            const totalFinal = total + iva;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("DETALLE DE PAGO", 15, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(`• Subtotal: $${total.toFixed(2)}`, 15, yPos + 8);
            doc.text(`• IVA (${restaurante.iva}%): $${iva.toFixed(2)}`, 15, yPos + 16);
            doc.setFont("helvetica", "bold");
            doc.text(`• TOTAL: $${totalFinal.toFixed(2)}`, 15, yPos + 28);
            
            // Mostrar método de pago
            doc.setFont("helvetica", "bold");
            doc.text("MÉTODO DE PAGO", 15, yPos + 40);
            doc.setFont("helvetica", "normal");
            doc.text(`• ${pedidoData.metodo_pago || "No especificado"}`, 15, yPos + 48);

            // ========== PIE DE PÁGINA ==========
            doc.setFontSize(8);
            doc.text(`Folio del pedido: ${folio_formato}`, 15, 280);
            doc.text(restaurante.telefono, 15, 285);

            // 6. Descargar PDF
            doc.save(`Ticket-${folio_formato}.pdf`);

            console.log("Ticket generado exitosamente");

        } catch (error) {
            console.error("Error detallado:", error);
            alert(`Error al generar ticket: ${error.message}`);
        }
    });
});