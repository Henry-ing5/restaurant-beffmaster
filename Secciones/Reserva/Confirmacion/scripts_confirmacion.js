document.addEventListener('DOMContentLoaded', () => {
    const reservaData = JSON.parse(sessionStorage.getItem('reservaData'));
    
    if (!reservaData || !reservaData.telefono) {
        window.location.href = '../reserva.html';
        return;
    }

    // Mostrar datos
    document.getElementById('numeroMesa').textContent = reservaData.mesa;
    document.getElementById('fechaCompleta').textContent = `Fecha: ${reservaData.fecha}`;
    document.getElementById('horaReserva').textContent = `Hora: ${reservaData.hora}`;
    document.getElementById('telefono').textContent = `Teléfono: ${reservaData.telefono}`;

    // Generar PDF
    document.getElementById('descargarTicket').addEventListener('click', async () => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            // Usar el folio real de la reserva
            const folio = reservaData.folio; // <-- Cambio clave


            // Contenido del ticket mejorado
            const ticketContent = `
                <div style="
                    width: 300px;
                    min-height: 400px;
                    padding: 25px;
                    background: white;
                    border: 2px solid #e74c3c;
                    border-radius: 12px;
                    font-family: Arial;
                    margin: 0 auto;
                    box-sizing: border-box;
                ">
                    <h2 style="
                        color: #e74c3c;
                        text-align: center;
                        margin: 0 0 25px 0;
                        font-size: 24px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #eee;
                    ">
                        Beefmaster
                    </h2>
                    
                    <p style="
                        text-align: right;
                        color: #666;
                        margin: 0 0 20px 0;
                        font-size: 14px;
                        font-weight: 500;
                    ">
                        Folio: ${reservaData.folio || 'N/A'} <!-- Manejo de undefined -->
                    </p>
                    
                    <div style="margin: 25px 0;">
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #2c3e50;">Nombre:</strong> 
                            <span style="color: #444;">${reservaData.nombre}</span>
                        </p>
                        
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #2c3e50;">Mesa:</strong> 
                            <span style="color: #444;">${reservaData.mesa}</span>
                        </p>
                        
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #2c3e50;">Fecha:</strong> 
                            <span style="color: #444;">${reservaData.fecha.split(',')[0]}</span>
                        </p>
                        
                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #2c3e50;">Hora:</strong> 
                            <span style="color: #444;">${reservaData.hora}</span>
                        </p>

                        <p style="margin: 12px 0; font-size: 16px;">
                            <strong style="color: #2c3e50;">Teléfono:</strong> 
                            <span style="color: #444;">${reservaData.telefono}</span>
                        </p>
                    </div>
                    
                    <div style="
                        border-top: 2px dashed #e74c3c;
                        padding-top: 20px;
                        margin-top: 30px;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    ">
                        <div style="margin-bottom: 8px;">📞 555-123-4567</div>
                        <div>📍 Av. Principal 123</div>
                    </div>
                </div>
            `;

            // Elemento temporal
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = ticketContent;
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);

            // Configuración de html2canvas
            // Modificar la configuración de html2canvas y PDF:
            const canvas = await html2canvas(tempDiv, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null,
                width: 320,  // Aumentar ancho
                height: 450,  // Aumentar alto
                windowWidth: 320,
                windowHeight: 450
            });

            // Configurar PDF con márgenes más pequeños
            const pdfWidth = 190; 
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            doc.addImage(
                canvas,
                'PNG',
                3,  // Reducir margen izquierdo
                3,  // Reducir margen superior
                pdfWidth - 6, 
                pdfHeight - 6
            );
            
            doc.save(`Ticket_${folio}.pdf`);
            document.body.removeChild(tempDiv);

        } catch (error) {
            console.error('Error:', error);
            alert('Error al generar el ticket. Intente recargando la página.');
        }
    });
});