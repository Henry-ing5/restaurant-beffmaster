// scripts_formulario.js - SOLO PositionStack
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".delivery-form");
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado')) || {};
    const btnUbicacion = document.getElementById('btn-ubicacion');
    
    let coordenadasActuales = { latitud: null, longitud: null };
    
    // 🔑 REEMPLAZA ESTA API KEY CON LA TUYA
    const POSITIONSTACK_API_KEY = '695d811b232ecf07c226a55153c8ddcd'; // Regístrate en positionstack.com
    
    if (!usuarioAutenticado.folio) {
        window.location.href = '../../login.html';
        return;
    }

    const autocompletarCampos = () => {
        document.getElementById('nombre').value = usuarioAutenticado.nombre || "";
        document.getElementById('telefono').value = usuarioAutenticado.telefono || "";
        document.getElementById('nombre').readOnly = true;
        document.getElementById('telefono').readOnly = true;
    };
    autocompletarCampos();

    const obtenerUbicacionActual = () => {
        btnUbicacion.classList.add('loading');
        
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta la geolocalización.");
            btnUbicacion.classList.remove('loading');
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitud = position.coords.latitude;
                const longitud = position.coords.longitude;
                
                coordenadasActuales.latitud = latitud;
                coordenadasActuales.longitud = longitud;
                
                // Usar SOLO PositionStack
                obtenerDireccionPositionStack(latitud, longitud);
            },
            (error) => {
                btnUbicacion.classList.remove('loading');
                let mensajeError = "No se pudo obtener tu ubicación. ";
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mensajeError += "Permiso de ubicación denegado.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensajeError += "Información de ubicación no disponible.";
                        break;
                    case error.TIMEOUT:
                        mensajeError += "Solicitud de ubicación expirada.";
                        break;
                    default:
                        mensajeError += "Error desconocido.";
                        break;
                }
                alert(mensajeError);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    };
    
    const obtenerDireccionPositionStack = (latitud, longitud) => {
        // Verificar si hay API key
        if (POSITIONSTACK_API_KEY === 'tu_api_key_aqui') {
            btnUbicacion.classList.remove('loading');
            alert("Necesitas registrar una API key de PositionStack. Ve a positionstack.com y obtén una clave gratuita.");
            return;
        }
        
        const url = `http://api.positionstack.com/v1/reverse?access_key=${POSITIONSTACK_API_KEY}&query=${latitud},${longitud}&limit=1&output=json`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                btnUbicacion.classList.remove('loading');
                console.log("Datos PositionStack:", data);
                
                if (data && data.data && data.data.length > 0) {
                    const direccion = construirDireccionPositionStack(data);
                    document.getElementById('direccion').value = direccion;
                } else {
                    alert("No se pudo obtener la dirección. Ingresa manualmente.");
                }
            })
            .catch(error => {
                btnUbicacion.classList.remove('loading');
                console.error("Error PositionStack:", error);
                alert("Error al obtener dirección. Ingresa manualmente.");
            });
    };
    
    const construirDireccionPositionStack = (data) => {
        const location = data.data[0];
        let direccionParts = [];
        
        // Calle - PositionStack tiene buena estructura para calles
        if (location.street) {
            direccionParts.push(location.street);
        } else if (location.name) {
            direccionParts.push(location.name);
        } else {
            direccionParts.push("Vial sin nombre");
        }
        
        // Número de casa (si está disponible)
        if (location.number) {
            // Agregar número al final de la calle
            direccionParts[direccionParts.length - 1] += ` ${location.number}`;
        }
        
        // Colonia/Localidad - PositionStack es bueno para esto
        if (location.locality) {
            direccionParts.push(location.locality);
        } else if (location.neighbourhood) {
            direccionParts.push(location.neighbourhood);
        } else if (location.district) {
            direccionParts.push(location.district);
        }
        
        // Código Postal
        if (location.postal_code) {
            direccionParts.push(location.postal_code);
        }
        
        // Municipio
        if (location.county) {
            direccionParts.push(location.county);
        } else if (location.municipality) {
            direccionParts.push(location.municipality);
        }
        
        // Estado
        if (location.region) {
            direccionParts.push(location.region);
        } else if (location.state) {
            direccionParts.push(location.state);
        }
        
        return direccionParts.join(', ');
    };

    btnUbicacion.addEventListener('click', obtenerUbicacionActual);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const pedidoCompleto = JSON.parse(localStorage.getItem('pedidoCompleto')) || {};
        const totalPedido = parseFloat(localStorage.getItem('totalPedido')) || 0;

        const datos = {
            cliente_folio: usuarioAutenticado.folio,
            direccion: document.getElementById('direccion').value.trim(),
            referencia: document.getElementById('referencia').value.trim(),
            alimentos: {
                cortes: pedidoCompleto.cortes.map(item => item.nombre),
                bebidas: pedidoCompleto.bebidas.map(item => item.nombre)
            },
            total: totalPedido,
            latitud: coordenadasActuales.latitud,
            longitud: coordenadasActuales.longitud
        };

        if (!datos.direccion || !datos.referencia) {
            alert('Complete dirección y referencia');
            return;
        }

        try {
            // Guardar pedido en Firestore
            const domiciliosRef = db.collection('domicilios');
            const docRef = await domiciliosRef.add({
                folio_cliente: datos.cliente_folio,
                cortes: datos.alimentos.cortes,
                bebidas: datos.alimentos.bebidas,
                direccion: datos.direccion,
                referencia: datos.referencia,
                total: datos.total,
                latitud: datos.latitud,
                longitud: datos.longitud,
                metodo_pago: null, // Se actualizará después
                fecha_pedido: firebase.firestore.FieldValue.serverTimestamp()
            });

            const folio_d = `DOM-${docRef.id.substring(0, 8).toUpperCase()}`;

            sessionStorage.setItem('ultimoFolio', docRef.id);
            sessionStorage.setItem('ultimoFolioFormato', folio_d);
            coordenadasActuales = { latitud: null, longitud: null };
            window.location.href = "metodos_pago/metodos_pago.html";
            
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });
});