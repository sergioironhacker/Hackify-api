# OnlyHack-api

## Descripción
OnlyHack API es un backend desarrollado con Node.js, Express y MongoDB para proporcionar funcionalidades relacionadas con la gestión de datos para la plataforma OnlyHack.

## Instalación
1. Clona este repositorio: `git clone https://github.com/tuusuario/onlyhack-api.git`
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno creando un archivo `.env` en el directorio raíz del proyecto y proporciona los valores necesarios (ver [.env.example](.env.example)).

## Uso
1. Para ejecutar en modo de desarrollo: `npm run dev`
2. Para ejecutar en modo de producción: `npm start`

## Endpoints

### Autenticación
- **POST /auth/register**: Registra un nuevo usuario.
- **POST /auth/login**: Inicia sesión y genera un token de autenticación.

### Funcionalidades
- Describe aquí las principales funcionalidades de tu API y los endpoints correspondientes.

## Configuración
El archivo de configuración `.env` contiene las siguientes variables:

- `PORT`: Puerto en el que se ejecutará el servidor.
- `MONGODB_URI`: URI de conexión a la base de datos MongoDB.
- `JWT_SECRET`: Clave secreta para firmar tokens JWT.

## Dependencias Principales
- **bcrypt**: Para el hashing de contraseñas.
- **cors**: Middleware para habilitar el CORS.
- **dotenv**: Para cargar variables de entorno desde un archivo `.env`.
- **express**: Marco de aplicación web para Node.js.
- **http-errors**: Creación de errores HTTP para Express.
- **http-status-codes**: Lista de códigos de estado HTTP.
- **jsonwebtoken**: Generación y verificación de tokens JWT.
- **mongoose**: Librería de modelado de objetos MongoDB.
- **morgan**: Middleware para el registro de solicitudes HTTP.

## Contribuyendo
Las contribuciones son bienvenidas. Si deseas contribuir a este proyecto, por favor abre un issue para discutir los cambios propuestos.

## Licencia
Este proyecto está bajo la licencia ISC. Para más detalles, consulta el archivo [LICENSE](LICENSE).

![Texto alternativo](https://github.com/sergioironhacker/OnlyHack-api/blob/main/images/logo.png)
