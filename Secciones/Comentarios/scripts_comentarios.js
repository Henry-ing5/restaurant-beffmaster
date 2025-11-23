document.addEventListener('DOMContentLoaded', function() {
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
        
        // Enviar comentario a Firestore
        db.collection('comentarios').add({
            nombre_usuario: nombreUsuario,
            comentario: textoComentario,
            valoracion: valoracionActual,
            fecha_creacion: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
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
        
        // Obtener comentarios de Firestore ordenados por fecha
        db.collection('comentarios')
            .orderBy('fecha_creacion', 'desc')
            .get()
            .then(snapshot => {
                listaComentarios.innerHTML = '';
                
                if (snapshot.empty) {
                    listaComentarios.innerHTML = '<div class="sin-comentarios">¡No hay comentarios aún. Sé el primero en opinar!</div>';
                    return;
                }
                
                snapshot.forEach(doc => {
                    const comentario = doc.data();
                    const fechaFormateada = comentario.fecha_creacion ? 
                        comentario.fecha_creacion.toDate().toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }) : 'Fecha desconocida';
                    
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
