from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import uuid
import logging
import json
from mysql.connector import Error

# Configuración logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuración MySQL
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Burelo2025',
    'database': 'restaurant_db',
    'auth_plugin': 'mysql_native_password'
}

def get_db():
    try:
        return mysql.connector.connect(**db_config)
    except Error as e:
        logger.error(f"Error de conexión: {str(e)}")
        raise

@app.route('/verificar-cliente', methods=['POST'])
def verificar_cliente():
    try:
        data = request.get_json()
        email = data.get('correo')
        password = data.get('password')

        if not email or '@' not in email:
            return jsonify({"error": "Correo inválido"}), 400

        if not password:
            return jsonify({"error": "Contraseña requerida"}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('''
            SELECT folio_cliente, nombre, telefono, password FROM cliente 
            WHERE email = %s
        ''', (email,))
        
        cliente = cursor.fetchone()
        cursor.close()
        conn.close()

        if cliente:
            # COMPARACIÓN DIRECTA EN TEXTO PLANO
            if cliente['password'] == password:
                return jsonify({
                    "existe": True,
                    "folio": cliente['folio_cliente'],
                    "nombre": cliente['nombre'],
                    "telefono": cliente['telefono']
                }), 200
            else:
                return jsonify({
                    "existe": False,
                    "error": "Contraseña incorrecta"
                }), 401
        else:
            return jsonify({
                "existe": False,
                "error": "Correo no registrado"
            }), 404

    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Error interno"}), 500

@app.route('/registrar-cliente', methods=['POST'])
def registrar_cliente():
    try:
        data = request.get_json()
        folio = str(uuid.uuid4())

        if not all([data.get('nombre'), data.get('telefono'), data.get('correo'), data.get('password')]):
            return jsonify({"error": "Todos los campos son obligatorios"}), 400

        # Validar longitud de contraseña
        if len(data.get('password', '')) < 6:
            return jsonify({"error": "La contraseña debe tener al menos 6 caracteres"}), 400

        # GUARDAR CONTRASEÑA EN TEXTO PLANO
        password_plano = data['password']

        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO cliente 
            (folio_cliente, nombre, telefono, email, password)
            VALUES (%s, %s, %s, %s, %s)
        ''', (folio, data['nombre'], data['telefono'], data['correo'], password_plano))
        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "mensaje": "Registro exitoso",
            "folio": folio,
            "nombre": data['nombre'],
            "telefono": data['telefono'],
            "correo": data['correo']
        }), 201

    except mysql.connector.IntegrityError as e:
        error_msg = str(e).lower()
        if 'email' in error_msg:
            return jsonify({"error": "Correo ya registrado"}), 409
        elif 'telefono' in error_msg:
            return jsonify({"error": "Teléfono ya registrado"}), 409
        else:
            return jsonify({"error": "Datos duplicados"}), 409
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Error interno del servidor"}), 500

# ... (el resto de tus funciones permanecen igual)
@app.route('/guardar-domicilio', methods=['POST'])
def guardar_domicilio():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        logger.info(f"Datos recibidos: {json.dumps(data)}")

        # Validar datos esenciales
        if not data.get('cliente_folio'):
            return jsonify({"error": "Folio de cliente requerido"}), 400
        
        if not data.get('direccion') or not data.get('referencia'):
            return jsonify({"error": "Dirección y referencia son obligatorios"}), 400

        nombres_cortes = data['alimentos']['cortes']
        nombres_bebidas = data['alimentos']['bebidas']

        # Generar folio_d con formato adecuado (DOM-seguido de 7 dígitos)
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        # Obtener el último número de secuencia de forma más robusta
        cursor.execute('''
            SELECT folio_d FROM domicilio 
            WHERE folio_d LIKE 'DOM-%' 
            ORDER BY CAST(SUBSTRING(folio_d, 7) AS UNSIGNED) DESC 
            LIMIT 1
        ''')
        
        result = cursor.fetchone()
        
        if result:
            last_folio = result['folio_d']
            last_seq = int(last_folio.split('-')[1])
            new_seq = last_seq + 1
        else:
            new_seq = 1
            
        folio_d = f"DOM-{new_seq:07d}" # Formato con 7 dígitos

        # Insertar en domicilio
        cursor.execute('''
            INSERT INTO domicilio 
            (folio_d, folio_cliente, cortes, bebidas, direccion, referencia, total)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        ''', (
            folio_d,
            data['cliente_folio'],
            json.dumps(nombres_cortes),
            json.dumps(nombres_bebidas),
            data['direccion'],
            data['referencia'],
            data['total']
        ))
        
        conn.commit()
        return jsonify({"mensaje": "Pedido guardado", "folio": folio_d}), 201

    except Exception as e:
        if conn: conn.rollback()
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Error al procesar el pedido"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/obtener-pedido/<folio_d>', methods=['GET'])
def obtener_pedido(folio_d):
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        # Obtener datos del domicilio y cliente
        cursor.execute('''
            SELECT d.*, c.nombre, c.telefono 
            FROM domicilio d
            JOIN cliente c ON d.folio_cliente = c.folio_cliente
            WHERE d.folio_d = %s
        ''', (folio_d,))
        
        pedido = cursor.fetchone()
        
        if not pedido:
            return jsonify({"error": "Pedido no encontrado"}), 404
            
        # Convertir JSON a listas y total a float
        pedido['cortes'] = json.loads(pedido['cortes'])
        pedido['bebidas'] = json.loads(pedido['bebidas'])
        pedido['total'] = float(pedido['total'])  # <-- Conversión crítica
        
        return jsonify(pedido), 200
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": "Error al obtener pedido"}), 500
    
@app.route('/guardar-reserva', methods=['POST'])
def guardar_reserva():
    conn = None
    cursor = None
    try:
        data = request.get_json()
        required = ['numero_mesa', 'numero_personas', 'hora', 'fecha', 'folio_c']
        
        if not all(key in data for key in required):
            return jsonify({"error": "Datos incompletos"}), 400

        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        # Generar folio_r con formato adecuado (RE-seguido de 4 dígitos)
        # Obtener el último número de secuencia
        cursor.execute('SELECT MAX(CAST(SUBSTRING(folio_r, 4) AS UNSIGNED)) FROM reserva')
        result = cursor.fetchone()
        last_seq = result[list(result.keys())[0]] or 0
        new_seq = last_seq + 1
        folio_r = f"RE-{new_seq:04d}"
        
        # Insertar reserva con el folio generado
        cursor.execute('''
            INSERT INTO reserva 
            (folio_r, numero_mesa, numero_personas, hora, fecha, folio_c)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (
            folio_r,
            data['numero_mesa'],
            data['numero_personas'],
            data['hora'],
            data['fecha'],
            data['folio_c']
        ))
        
        conn.commit()
        
        return jsonify({
            "mensaje": "Reserva exitosa",
            "folio": folio_r
        }), 201

    except Exception as e:
        if conn: conn.rollback()
        logger.error(f"Error en reserva: {str(e)}")
        return jsonify({"error": f"Error al guardar reserva: {str(e)}"}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/mesas-ocupadas', methods=['GET'])
def mesas_ocupadas():
    try:
        fecha = request.args.get('fecha')  # Obtener fecha del query parameter
        
        # Validar que la fecha está presente
        if not fecha:
            return jsonify({"error": "Se requiere el parámetro fecha"}), 400
            
        logger.info(f"Consultando mesas ocupadas para la fecha: {fecha}")
            
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT numero_mesa FROM reserva 
            WHERE fecha = %s
        ''', (fecha,))
        
        mesas_ocupadas = [str(row[0]) for row in cursor.fetchall()]
        
        logger.info(f"Mesas ocupadas encontradas: {mesas_ocupadas}")
        return jsonify({"mesas_ocupadas": mesas_ocupadas}), 200
        
    except Exception as e:
        logger.error(f"Error al obtener mesas ocupadas: {str(e)}")
        return jsonify({"error": "Error al obtener mesas", "detalle": str(e)}), 500
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()
    
@app.route('/obtener-comentarios', methods=['GET'])
def obtener_comentarios():
    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('''
            SELECT 
                id, 
                nombre_usuario, 
                comentario, 
                valoracion, 
                fecha_creacion 
            FROM 
                comentarios 
            ORDER BY 
                fecha_creacion DESC
        ''')
        
        comentarios = cursor.fetchall()
        cursor.close()
        conn.close()
        
        # Convertir fechas a strings para serialización JSON
        for c in comentarios:
            if 'fecha_creacion' in c and c['fecha_creacion'] is not None:
                c['fecha_creacion'] = c['fecha_creacion'].isoformat()
        
        return jsonify({"comentarios": comentarios}), 200
        
    except Exception as e:
        logger.error(f"Error al obtener comentarios: {str(e)}")
        return jsonify({"error": "Error al cargar comentarios"}), 500

@app.route('/guardar-comentario', methods=['POST'])
def guardar_comentario():
    try:
        data = request.get_json()
        
        # Validar datos obligatorios
        required_fields = ['nombre_usuario', 'comentario', 'valoracion']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Campo {field} es obligatorio"}), 400
        
        # Validar valoración
        valoracion = int(data['valoracion'])
        if valoracion < 1 or valoracion > 5:
            return jsonify({"error": "La valoración debe estar entre 1 y 5"}), 400
            
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO comentarios 
            (nombre_usuario, comentario, valoracion)
            VALUES (%s, %s, %s)
        ''', (
            data['nombre_usuario'],
            data['comentario'],
            valoracion
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return jsonify({"mensaje": "Comentario guardado exitosamente"}), 201
        
    except Exception as e:
        logger.error(f"Error al guardar comentario: {str(e)}")
        return jsonify({"error": "Error al procesar el comentario"}), 500
    
@app.route('/actualizar-metodo-pago', methods=['POST'])
def actualizar_metodo_pago():
    try:
        data = request.get_json()
        
        # Validar datos requeridos
        if not data.get('folio_d') or not data.get('metodo_pago'):
            return jsonify({"error": "Faltan datos requeridos"}), 400
            
        conn = get_db()
        cursor = conn.cursor()
        
        # Actualizar el método de pago en la base de datos
        cursor.execute('''
            UPDATE domicilio 
            SET metodo_pago = %s
            WHERE folio_d = %s
        ''', (data['metodo_pago'], data['folio_d']))
        
        conn.commit()
        
        # Verificar si se actualizó correctamente
        if cursor.rowcount == 0:
            return jsonify({"error": "No se encontró el pedido"}), 404
            
        cursor.close()
        conn.close()
        
        return jsonify({"mensaje": "Método de pago actualizado correctamente"}), 200
        
    except Exception as e:
        logger.error(f"Error al actualizar método de pago: {str(e)}")
        return jsonify({"error": "Error al procesar la solicitud"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)