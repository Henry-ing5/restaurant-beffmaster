document.addEventListener('DOMContentLoaded', () => {
    let mesaSeleccionada = null;
    const mesas = document.querySelectorAll('.mesa');
    const formReserva = document.getElementById('formReserva');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    let intervaloActualizacion;

    // Configurar fecha mínima
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.min = hoy;
    fechaInput.value = hoy; // Establece el día actual por defecto

    // Función para actualizar mesas
    const actualizarMesasOcupadas = async (fecha) => {
        try {
            // Verificar que la fecha sea válida
            if (!fecha) {
                console.error("Fecha no especificada para la consulta");
                return;
            }
            
            console.log(`Consultando mesas ocupadas para la fecha: ${fecha}`);
            
            // Consultar Firestore por reservas de la fecha seleccionada
            const reservasRef = db.collection('reservas');
            const snapshot = await reservasRef.where('fecha', '==', fecha).get();
            
            const mesas_ocupadas = [];
            snapshot.forEach(doc => {
                mesas_ocupadas.push(String(doc.data().numero_mesa));
            });
            
            console.log("Mesas ocupadas recibidas:", mesas_ocupadas);
            
            // Primero, restablecer todas las mesas
            mesas.forEach(mesa => {
                mesa.classList.remove('ocupada');
                mesa.style.pointerEvents = 'auto';
            });
            
            // Luego, marcar las ocupadas
            mesas.forEach(mesa => {
                const numeroMesa = mesa.textContent.trim();
                if (mesas_ocupadas.includes(numeroMesa)) {
                    console.log(`Mesa ${numeroMesa} marcada como ocupada`);
                    mesa.classList.add('ocupada');
                    mesa.style.pointerEvents = 'none';
                    
                    // Si la mesa ocupada es la que estaba seleccionada, deseleccionarla
                    if (mesa === mesaSeleccionada) {
                        mesa.classList.remove('seleccionada');
                        mesaSeleccionada = null;
                    }
                }
            });
        } catch (error) {
            console.error("Error al actualizar mesas:", error);
        }
    };

    // Actualización automática cada 5 segundos
    const iniciarActualizacion = () => {
        if (intervaloActualizacion) clearInterval(intervaloActualizacion);
        
        const fecha = fechaInput.value;
        if (!fecha) {
            console.warn("No hay fecha seleccionada para iniciar actualización");
            return;
        }
        
        console.log(`Iniciando actualización para fecha ${fecha}`);
        actualizarMesasOcupadas(fecha);
        
        intervaloActualizacion = setInterval(() => {
            console.log("Ejecutando actualización automática");
            actualizarMesasOcupadas(fecha);
        }, 5000);
    };

    // Eventos
    fechaInput.addEventListener('change', () => {
        const fechaSeleccionada = fechaInput.value;
        
        // Ajustar hora mínima si es hoy
        if (fechaSeleccionada === hoy) {
            const ahora = new Date();
            const horaMinima = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`;
            horaInput.min = horaMinima;
        } else {
            horaInput.min = '10:00';
        }
        
        console.log(`Fecha cambiada a: ${fechaSeleccionada}`);
        
        // Reiniciar selección de mesa al cambiar fecha
        if (mesaSeleccionada) {
            mesaSeleccionada.classList.remove('seleccionada');
            mesaSeleccionada = null;
        }
        
        iniciarActualizacion();
    });

    // Cargar datos del cliente desde localStorage
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
    if (!usuarioAutenticado) {
        console.warn("No se encontraron datos del usuario. Redirigiendo a login.");
        window.location.href = '../login.html';
        return;
    }
    
    // Usar datos del usuario autenticado
    const nombreCliente = usuarioAutenticado.nombre;
    document.getElementById('nombreCliente').value = nombreCliente;
    document.getElementById('telefonoCliente').value = usuarioAutenticado.telefono || '';
    document.getElementById('folioCliente').value = usuarioAutenticado.folio || '';

    // Selección de mesas
    mesas.forEach(mesa => {
        mesa.addEventListener('click', () => {
            // Evitar selección si está ocupada
            if (mesa.classList.contains('ocupada')) {
                console.log(`Mesa ${mesa.textContent.trim()} está ocupada, no se puede seleccionar`);
                return;
            }
            
            // Seleccionar/deseleccionar mesa
            if (mesa === mesaSeleccionada) {
                mesa.classList.remove('seleccionada');
                mesaSeleccionada = null;
                console.log(`Mesa ${mesa.textContent.trim()} deseleccionada`);
            } else {
                if (mesaSeleccionada) {
                    mesaSeleccionada.classList.remove('seleccionada');
                }
                mesa.classList.add('seleccionada');
                mesaSeleccionada = mesa;
                console.log(`Mesa ${mesa.textContent.trim()} seleccionada`);
            }
        });
    });

    // Envío del formulario
    formReserva.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!mesaSeleccionada) {
            alert('Por favor, selecciona una mesa');
            return;
        }
    
        const datos = {
            numero_mesa: parseInt(mesaSeleccionada.textContent),
            numero_personas: parseInt(document.getElementById('personas').value),
            hora: horaInput.value,
            fecha: fechaInput.value,
            folio_c: usuarioAutenticado.folio
        };
    
        console.log("Enviando datos de reserva:", datos);
    
        try {
            // Guardar reserva en Firestore
            const reservasRef = db.collection('reservas');
            const docRef = await reservasRef.add({
                numero_mesa: datos.numero_mesa,
                numero_personas: datos.numero_personas,
                hora: datos.hora,
                fecha: datos.fecha,
                folio_c: datos.folio_c,
                fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const folio_r = `RE-${docRef.id.substring(0, 8).toUpperCase()}`;
            
            console.log("Reserva exitosa, folio:", folio_r);
            
            // Actualizar inmediatamente
            await actualizarMesasOcupadas(datos.fecha);
            
            // Guardar datos de la reserva en sessionStorage
            const reservaData = {
                folio: folio_r,  // Usar el folio generado
                mesa: datos.numero_mesa,
                fecha: datos.fecha,
                hora: datos.hora,
                telefono: usuarioAutenticado.telefono || '',
                nombre: nombreCliente
            };
            sessionStorage.setItem('reservaData', JSON.stringify(reservaData));
            
            // Mostrar modal
            document.getElementById('modal-reserva-exitosa').style.display = 'flex';        
                
        } catch (error) {
            console.error("Error en el proceso de reserva:", error);
            alert(`Error: ${error.message}`);
        }
    });

    // Iniciar al cargar la página
    setTimeout(() => {
        console.log("Iniciando carga inicial de mesas ocupadas");
        iniciarActualizacion();
    }, 500);
});

function cerrarModalReserva() {
    document.getElementById('modal-reserva-exitosa').style.display = 'none';
    window.location.href = `Confirmacion/confirmacion.html?folio=${JSON.parse(sessionStorage.getItem('reservaData')).folio}`;
}