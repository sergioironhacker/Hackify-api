const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const User = require("../models/User.model")
const Bookmark = require('../models/Bookmark.model');
const { populate } = require('../models/Message.model');

module.exports.create = (req, res, next) => {
  const userToCreate = {
    ...req.body,
    avatar: req.file.path
  }

  User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
    .then(user => {
      if (user) {
        next(createError(StatusCodes.BAD_REQUEST, 'Username or email already in use'));
      } else {
        return User.create(userToCreate)
          .then(userCreated => {
            res.status(StatusCodes.CREATED).json(userCreated)
          })
      }
    })
    .catch(next)
}

const getUser = (id, req, res, next) => {
  const profilePromise = User.findById(id)
    // .populate('ideas bookmarks contributions')
    .populate('ideas')
    .populate({path: 'bookmarks', populate: 'idea'})
    .populate({ path: 'contributions', populate: 'idea' })
    

  Promise.all([profilePromise])
    .then(([user]) => {
      if (!user) {
        next(createError(StatusCodes.NOT_FOUND, 'User not found'))
      } else {
        res.json(user)
      }
    })
    .catch(next)
}


module.exports.getCurrentUser = (req, res, next) => {
  getUser(req.currentUserId, req, res, next);
}

module.exports.getUser = (req, res, next) => {
  getUser(req.params.id, req, res, next)
}

// Función para eliminar la cuenta de usuario
module.exports.deleteAccount = (req, res, next) => {
  const userId = req.currentUserId; // Suponiendo que tienes acceso al ID del usuario desde req.user

  // Eliminar el usuario de la base de datos
  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (!deletedUser) {
        throw createError(StatusCodes.NOT_FOUND, 'User not found');
      }

      // Eliminar cualquier otro dato relacionado con el usuario, como archivos, registros, etc.
      // Aquí puedes agregar la lógica adicional según sea necesario

      // Envía una respuesta de éxito
      res.status(StatusCodes.OK).json({ message: 'User account deleted successfully' });
    })
    .catch(next);






};