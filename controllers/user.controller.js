const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const User = require('../models/User.model');


// crea el user 
module.exports.create = (req, res, next) => {
    User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] })
        .then(user => {
            if (user) {
                next(createError(StatusCodes.BAD_REQUEST, 'Username or email already in use'));
            } else {
                return User.create(req.body)
                    .then(userCreated => {
                        res.status(StatusCodes.CREATED).json(userCreated)
                    })
            }
        })
        .catch(next)
}

// busca usuario por id 
const getUser = (id, req, res, next) => {
    User.findById(id)
        .then(user => {
            if (!user) {
                next(createError(StatusCodes.NOT_FOUND, 'User not found'))
            } else {
                res.json(user)
            }
        })
        .catch(next)
}

// obtenemos el user autenticado 
module.exports.getCurrentUser = (req, res, next) => {
    getUser(req.currentUserId, req, res, next);
}


// obtengo los detalles por id del user 
module.exports.getUser = (req, res, next) => {
    getUser(req.params.id, req, res, next)
}
