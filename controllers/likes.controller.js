const { StatusCodes } = require("http-status-codes")
const Like = require("../models/Like.model")

module.exports.toggleLike = (req, res, next) => {
  const { tweet, tweetOwner } = req.params

  const queryData = { likingUser: req.currentUserId, tweet, tweetOwner }
  
  Like.findOne(queryData)
    .then(like => {
      if (like) {
        Like.findOneAndDelete(queryData)
          .then(() => res.status(StatusCodes.NO_CONTENT).json({}))
      } else {
        Like.create(queryData)
          .then(like => {
            res.status(StatusCodes.CREATED).json(like)
          })
      }
    })
    .catch(next)
}