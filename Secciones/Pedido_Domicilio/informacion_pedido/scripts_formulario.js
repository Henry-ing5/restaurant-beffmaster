// scripts_formulario.js - BigDataCloud API (HTTPS gratuito)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".delivery-form");
  const usuarioAutenticado =
    JSON.parse(localStorage.getItem("usuarioAutenticado")) || {};
  const btnUbicacion = document.getElementById("btn-ubicacion");

  let coordenadasActuales = { latitud: null, longitud: null };

  // BigDataCloud - API GRATUITA con HTTPS (10k requests/mes)
  // NO requiere API key, funciona en móviles con HTTPS

  if (!usuarioAutenticado.folio) {
    window.location.href = "../../login.html";
    return;
  }

  const autocompletarCampos = () => {
    document.getElementById("nombre").value = usuarioAutenticado.nombre || "";
    document.getElementById("telefono").value =
      usuarioAutenticado.telefono || "";
    document.getElementById("nombre").readOnly = true;
    document.getElementById("telefono").readOnly = true;
  };
  autocompletarCampos();

  const obtenerUbicacionActual = () => {
    btnUbicacion.classList.add("loading");
    btnUbicacion.disabled = true;

    if (!navigator.geolocation) {
      alert("Tu navegador no soporta la geolocalización.");
      btnUbicacion.classList.remove("loading");
      btnUbicacion.disabled = false;
      return;
    }

    // Configuración optimizada para móviles
    const opciones = {
      enableHighAccuracy: true,
      timeout: 20000, // 20 segundos (redes móviles pueden ser lentas)
      maximumAge: 0, // No usar caché
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitud = position.coords.latitude;
        const longitud = position.coords.longitude;

        coordenadasActuales.latitud = latitud;
        coordenadasActuales.longitud = longitud;

        // Usar BigDataCloud con HTTPS
        obtenerDireccionBigDataCloud(latitud, longitud);
      },
      (error) => {
        btnUbicacion.classList.remove("loading");
        btnUbicacion.disabled = false;
        let mensajeError = "No se pudo obtener tu ubicación.\n\n";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            mensajeError +=
              "Por favor, permite el acceso a tu ubicación en la configuración del navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            mensajeError +=
              "Información de ubicación no disponible. Verifica que el GPS esté activado.";
            break;
          case error.TIMEOUT:
            mensajeError +=
              "La solicitud de ubicación tardó demasiado. Intenta de nuevo o ingresa tu dirección manualmente.";
            break;
          default:
            mensajeError +=
              "Error desconocido. Ingresa tu dirección manualmente.";
            break;
        }
        alert(mensajeError);
      },
      opciones
    );
  };

  const obtenerDireccionBigDataCloud = (latitud, longitud) => {
    // BigDataCloud - Reverse Geocoding GRATUITO con HTTPS
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitud}&longitude=${longitud}&localityLanguage=es`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        btnUbicacion.classList.remove("loading");
        btnUbicacion.disabled = false;
        console.log("Datos BigDataCloud:", data);

        if (data && data.locality) {
          const direccion = construirDireccionBigDataCloud(data);
          document.getElementById("direccion").value = direccion;
        } else {
          alert(
            "No se pudo obtener la dirección exacta. Por favor ingresa tu dirección manualmente."
          );
        }
      })
      .catch((error) => {
        btnUbicacion.classList.remove("loading");
        btnUbicacion.disabled = false;
        console.error("Error BigDataCloud:", error);
        alert(
          "Error al obtener dirección desde el servidor. Por favor ingresa tu dirección manualmente."
        );
      });
  };

  const construirDireccionBigDataCloud = (data) => {
    let direccionParts = [];

    // Calle o nombre del lugar
    if (data.localityInfo && data.localityInfo.administrative) {
      // Buscar la calle en los niveles administrativos
      const nivelCalle = data.localityInfo.administrative.find(
        (nivel) => nivel.order >= 8
      );
      if (nivelCalle && nivelCalle.name) {
        direccionParts.push(nivelCalle.name);
      }
    }

    // Si no hay calle específica, usar locality
    if (direccionParts.length === 0 && data.locality) {
      direccionParts.push(data.locality);
    }

    // Colonia/Localidad
    if (data.city && data.city !== data.locality) {
      direccionParts.push(data.city);
    } else if (data.principalSubdivision) {
      // Usar subdivision si no hay city
      direccionParts.push(data.principalSubdivision);
    }

    // Código Postal
    if (data.postcode) {
      direccionParts.push(`CP ${data.postcode}`);
    }

    // Municipio/Ciudad
    if (data.city && !direccionParts.includes(data.city)) {
      direccionParts.push(data.city);
    }

    // Estado
    if (
      data.principalSubdivision &&
      !direccionParts.includes(data.principalSubdivision)
    ) {
      direccionParts.push(data.principalSubdivision);
    }

    // País
    if (data.countryName) {
      direccionParts.push(data.countryName);
    }

    return direccionParts.join(", ");
  };

  btnUbicacion.addEventListener("click", obtenerUbicacionActual);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const pedidoCompleto =
      JSON.parse(localStorage.getItem("pedidoCompleto")) || {};
    const totalPedido = parseFloat(localStorage.getItem("totalPedido")) || 0;

    const datos = {
      cliente_folio: usuarioAutenticado.folio,
      direccion: document.getElementById("direccion").value.trim(),
      referencia: document.getElementById("referencia").value.trim(),
      alimentos: {
        cortes: pedidoCompleto.cortes.map((item) => item.nombre),
        bebidas: pedidoCompleto.bebidas.map((item) => item.nombre),
      },
      total: totalPedido,
      latitud: coordenadasActuales.latitud,
      longitud: coordenadasActuales.longitud,
    };

    if (!datos.direccion || !datos.referencia) {
      alert("Complete dirección y referencia");
      return;
    }

    try {
      // Guardar pedido en Firestore
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

      sessionStorage.setItem("ultimoFolio", docRef.id);
      sessionStorage.setItem("ultimoFolioFormato", folio_d);
      coordenadasActuales = { latitud: null, longitud: null };
      window.location.href = "metodos_pago/metodos_pago.html";
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
});
