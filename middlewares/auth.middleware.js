const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');

module.exports.isAuthenticated = (req, res, next) => {
  // Mirar la cabecera/header de authorization
  const authorization = req.header("Authorization"); // "Bearer <token>""

  if (!authorization) {
    return next(createError(StatusCodes.UNAUTHORIZED, "Authorization header was not provided"));
  }

  const [schema, token] = authorization.split(" "); // "Bearer <token>" --> ["Bearer", "<token>"]

  if (schema !== "Bearer") {
    return next(createError(StatusCodes.UNAUTHORIZED, "Authorization schema is not supported"));
  }

  if (!token) {
    return next(createError(StatusCodes.UNAUTHORIZED, "A token must be provided"));
  }

  // Comprobación del JWT

  jwt.verify(
    token, // Token que va incluido en la petición,
    process.env.JWT_SECRET || 'test', // Secreto o firma para asegurarme que es un token mío,
    (err, decodedToken) => {
      if (err) {
        return next(err);
      }

      req.currentUserId = decodedToken.id // El objeto request, a partir de aqui, tendra asociado currentUserId, lo usaremos en los controladores
      next();
    }
  )
}