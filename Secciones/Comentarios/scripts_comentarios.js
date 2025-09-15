document.addEventListener('DOMContentLoaded', function() {
    const API_URL = 'http://localhost:5000'; // Ajusta según tu configuración
    let valoracionActual = 0;
    
    // Cargar comentarios al iniciar
    cargarComentarios();
    
    // Configurar el selector de estrellas
    const estrellas = document.querySelectorAll('.estrellas-valoracion i');
    
    estrellas.forEach(estrella => {
        estrella.addEventListener('click', function() {
            const valor = parseInt(this.dataset.valor);
            document.getElementById('valoracion').value = valor;
            actualizarEstrellas(valor);
            valoracionActual = valor;
        });
    });
    
    // Manejar el envío del formulario
    document.getElementById('form-comentario').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nombreUsuario = document.getElementById('nombre-usuario').value.trim();
        const textoComentario = document.getElementById('texto-comentario').value.trim();
        
        if (!nombreUsuario || !textoComentario || valoracionActual === 0) {
            alert('Por favor completa todos los campos y selecciona una valoración');
            return;
        }
        
        // Enviar comentario al servidor
        fetch(`${API_URL}/guardar-comentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre_usuario: nombreUsuario,
                comentario: textoComentario,
                valoracion: valoracionActual
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el comentario');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar formulario
            document.getElementById('nombre-usuario').value = '';
            document.getElementById('texto-comentario').value = '';
            document.getElementById('valoracion').value = '0';
            actualizarEstrellas(0);
            valoracionActual = 0;
            
            // Mostrar modal de éxito
            document.getElementById('modal-exito-comentario').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al publicar tu comentario. Inténtalo de nuevo.');
        });
    });
    
    // Función para actualizar la visualización de estrellas
    function actualizarEstrellas(valor) {
        estrellas.forEach(estrella => {
            const estrellaValor = parseInt(estrella.dataset.valor);
            if (estrellaValor <= valor) {
                estrella.classList.add('active');
            } else {
                estrella.classList.remove('active');
            }
        });
    }
    
    // Función para cargar los comentarios
    function cargarComentarios() {
        const listaComentarios = document.getElementById('lista-comentarios');
        listaComentarios.innerHTML = '<div class="mensaje-cargando">Cargando comentarios...</div>';
        
        fetch(`${API_URL}/obtener-comentarios`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar los comentarios');
                }
                return response.json();
            })
            .then(data => {
                listaComentarios.innerHTML = '';
                
                if (!data.comentarios || data.comentarios.length === 0) {
                    listaComentarios.innerHTML = '<div class="sin-comentarios">No hay comentarios aún. ¡Sé el primero en opinar!</div>';
                    return;
                }
                
                data.comentarios.forEach(comentario => {
                    const fechaFormateada = new Date(comentario.fecha_creacion).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });
                    
                    const estrellas = '★'.repeat(comentario.valoracion) + '☆'.repeat(5 - comentario.valoracion);
                    
                    const comentarioHTML = `
                        <div class="comentario">
                            <div class="encabezado-comentario">
                                <div class="nombre-usuario">${comentario.nombre_usuario}</div>
                                <div class="fecha-comentario">${fechaFormateada}</div>
                            </div>
                            <div class="valoracion-comentario">${estrellas}</div>
                            <div class="texto-comentario">${comentario.comentario}</div>
                        </div>
                    `;
                    
                    listaComentarios.innerHTML += comentarioHTML;
                });
            })
            .catch(error => {
                console.error('Error:', error);
                listaComentarios.innerHTML = '<div class="sin-comentarios">Error al cargar los comentarios. Por favor, intenta de nuevo más tarde.</div>';
            });
    }
});

// Función para cerrar el modal de éxito
function cerrarModalComentario() {
    document.getElementById('modal-exito-comentario').style.display = 'none';
    cargarComentarios(); // Actualizar la lista de comentarios
}
