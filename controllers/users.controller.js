const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const User = require("../models/User.model")
const Follow = require('../models/Follow.model');

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
  const followingPromise = Follow.countDocuments({ follower: id });
  const followedPromise = Follow.countDocuments({ followed: id });
  const profilePromise = User.findById(id)
    .populate({ path: 'likes', populate: { path: 'tweet', populate: 'user' } });

  Promise.all([ profilePromise, followingPromise, followedPromise ])
    .then(([ user, followingCount, followedCount ]) => {
      if (!user) {
        next(createError(StatusCodes.NOT_FOUND, 'User not found'))
      } else {
        res.json({ data: user, following: followingCount, followed: followedCount })
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
