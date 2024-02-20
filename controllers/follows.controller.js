const { StatusCodes } = require("http-status-codes");
const createError = require('http-errors');
const Follow = require("../models/Follow.model");

module.exports.toggleFollow = (req, res, next) => {
  const follower = req.currentUserId;
  const followed = req.params.followedId;

  if (follower === followed) {
    return next(createError(StatusCodes.UNAUTHORIZED, 'You cannot follow yourself'))
  }

  // Lo primero compruebo si existe un follow entre estos dos usuarios
  Follow.findOne({ follower, followed })
    .then(follow => {
      if (follow) {
        // Tendre que borrarlo, porque quiero desactivar ese follow
        return Follow.findOneAndDelete({ follower, followed })
          .then(() => {
            res.status(StatusCodes.NO_CONTENT).json({})
          })
      } else {
        // Tengo que crear el follow, porque no se seguian.
        return Follow.create({ follower, followed })
          .then((follow) => {
            res.status(StatusCodes.CREATED).json(follow)
          })
      }
    })
    .catch(next)
}

const getFollowingInfo = (id, req, res, next) => {
  Follow.find({ follower: id }) // Me traigo mis following
    .populate('followed') // Cambio el id del followed por el objeto de verdad del usuario
    .then(follows => {
      res.json(follows.map(follow => follow.followed)); // En vez de enviar todo el objeto de follow, me mando el campo followed
    })
    .catch(next)
}

module.exports.getCurrentUserFollowing = (req, res, next) => {
  getFollowingInfo(req.currentUserId, req, res, next)
}

module.exports.getUserFollowing = (req, res, next) => {
  getFollowingInfo(req.params.id, req, res, next);
}

const getFollowersInfo = (id, req, res, next) => {
  Follow.find({ followed: id }) // Me traigo mis following
    .populate('follower') // Cambio el id del followed por el objeto de verdad del usuario
    .then(follows => {
      res.json(follows.map(follow => follow.follower)); // En vez de enviar todo el objeto de follow, me mando el campo followed
    })
    .catch(next)
}

module.exports.getCurrentUserFollowed = (req, res, next) => {
  getFollowersInfo(req.currentUserId, req, res, next)
}

module.exports.getUserFollowed = (req, res, next) => {
  getFollowersInfo(req.params.id, req, res, next);
}