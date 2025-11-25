// scripts_formulario.js - Google Maps Geocoding API
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".delivery-form");
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado')) || {};
    const btnUbicacion = document.getElementById('btn-ubicacion');
    
    let coordenadasActuales = { latitud: null, longitud: null };
    
    // 🔑 REEMPLAZA ESTA API KEY CON LA TUYA
    const GOOGLE_MAPS_API_KEY = 'AIzaSyAz2IhGCffWChsVbGStesEEISY9xRTfJ5A'; // Obténla en Google Cloud Console
    
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
        btnUbicacion.disabled = true;
        
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta la geolocalización.");
            btnUbicacion.classList.remove('loading');
            btnUbicacion.disabled = false;
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitud = position.coords.latitude;
                const longitud = position.coords.longitude;
                
                coordenadasActuales.latitud = latitud;
                coordenadasActuales.longitud = longitud;
                
                obtenerDireccionGoogleMaps(latitud, longitud);
            },
            (error) => {
                btnUbicacion.classList.remove('loading');
                btnUbicacion.disabled = false;
                let mensajeError = "No se pudo obtener tu ubicación.\n\n";
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mensajeError += "Permiso de ubicación denegado. Por favor, habilita la ubicación en tu navegador.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensajeError += "Información de ubicación no disponible. Verifica que el GPS esté activado.";
                        break;
                    case error.TIMEOUT:
                        mensajeError += "La solicitud de ubicación tardó demasiado. Intenta de nuevo.";
                        break;
                    default:
                        mensajeError += "Error desconocido al obtener la ubicación.";
                        break;
                }
                alert(mensajeError);
            },
            { 
                enableHighAccuracy: true, 
                timeout: 20000,
                maximumAge: 0 
            }
        );
    };
    
    const obtenerDireccionGoogleMaps = (latitud, longitud) => {
        // Verificar si hay API key
        if (GOOGLE_MAPS_API_KEY === 'tu_api_key_aqui') {
            btnUbicacion.classList.remove('loading');
            btnUbicacion.disabled = false;
            return;
        }
        
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&key=${GOOGLE_MAPS_API_KEY}&language=es&region=mx`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                btnUbicacion.classList.remove('loading');
                btnUbicacion.disabled = false;
                console.log("Datos Google Maps:", data);
                
                if (data && data.status === 'OK' && data.results.length > 0) {
                    const direccion = construirDireccionGoogleMaps(data);
                    document.getElementById('direccion').value = direccion;
                } else {
                    let errorMsg = "No se pudo obtener la dirección. ";
                    if (data.status === 'ZERO_RESULTS') {
                        errorMsg += "No se encontraron resultados para estas coordenadas.";
                    } else if (data.status === 'OVER_QUERY_LIMIT') {
                        errorMsg += "Límite de consultas excedido.";
                    } else if (data.status === 'REQUEST_DENIED') {
                        errorMsg += "API key inválida o sin permisos.";
                    } else {
                        errorMsg += "Error: " + (data.status || 'Desconocido');
                    }
                    alert(errorMsg);
                }
            })
            .catch(error => {
                btnUbicacion.classList.remove('loading');
                btnUbicacion.disabled = false;
                console.error("Error Google Maps:", error);
                alert("Error de conexión al obtener dirección. Verifica tu conexión a internet.");
            });
    };
    
    const construirDireccionGoogleMaps = (data) => {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        // Extraer componentes individuales
        const componentes = {
            calle: '',
            numero: '',
            colonia: '',
            codigoPostal: '',
            municipio: '',
            estado: '',
            pais: ''
        };
        
        // Procesar cada componente de dirección
        addressComponents.forEach(component => {
            const types = component.types;
            
            if (types.includes('street_number')) {
                componentes.numero = component.long_name;
            } else if (types.includes('route')) {
                componentes.calle = component.long_name;
            } else if (types.includes('sublocality') || types.includes('neighborhood')) {
                componentes.colonia = component.long_name;
            } else if (types.includes('postal_code')) {
                componentes.codigoPostal = component.long_name;
            } else if (types.includes('locality')) {
                componentes.municipio = component.long_name;
            } else if (types.includes('administrative_area_level_2')) {
                // Municipio alternativo
                if (!componentes.municipio) componentes.municipio = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
                componentes.estado = component.long_name;
            } else if (types.includes('country')) {
                componentes.pais = component.long_name;
            }
        });
        
        let direccionParts = [];
        
        // 1. Calle y número
        if (componentes.calle) {
            let calleCompleta = componentes.calle;
            if (componentes.numero) {
                calleCompleta += ` ${componentes.numero}`;
            }
            direccionParts.push(calleCompleta);
        } else {
            // Si no hay calle, intentar determinar el tipo de vía
            const tipoVia = determinarTipoVia(result);
            direccionParts.push(tipoVia);
        }
        
        // 2. Colonia/Ejido/Ranchería
        if (componentes.colonia) {
            direccionParts.push(componentes.colonia);
        }
        
        // 3. Código Postal
        if (componentes.codigoPostal) {
            direccionParts.push(componentes.codigoPostal);
        }
        
        // 4. Municipio
        if (componentes.municipio) {
            direccionParts.push(componentes.municipio);
        }
        
        // 5. Estado
        if (componentes.estado) {
            direccionParts.push(componentes.estado);
        }
        
        return direccionParts.join(', ');
    };
    
    const determinarTipoVia = (result) => {
        const types = result.types;
        
        if (types.includes('route')) return "Carretera";
        if (types.includes('street_address')) return "Calle";
        if (types.includes('premise')) return "Predio";
        if (types.includes('subpremise')) return "Lote";
        if (types.includes('natural_feature')) return "Área natural";
        if (types.includes('point_of_interest')) return "Punto de interés";
        if (types.includes('establishment')) return "Establecimiento";
        
        return "Vial sin nombre";
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
            // Guardar pedido en Firestore (igual que tu código actual)
            const domiciliosRef = db.collection("domicilios");
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
                fecha_pedido: firebase.firestore.FieldValue.serverTimestamp(),
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