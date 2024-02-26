/* const { StatusCodes } = require('http-status-codes');
const Comment = require("../models/Comment.model");

module.exports.create = (req, res, next) => {
  Tweet.create({ idea: req.params.id, content: req.body.content, user: req.currentUserId })
    .then(createdTweet => {
      res.status(StatusCodes.CREATED).json(createdTweet);
    })
    .catch(next)
}

const addLikesToTweets = (tweets) => {
  const tweetLikePromises = tweets.map(tweet => {
    return Like.countDocuments({ tweet: tweet.id }) // [3, 0, 50, 100]
  })

  return Promise.all(tweetLikePromises)
    .then(likesPerTweet => { // [3, 0, 50, 100]
      const response = likesPerTweet.map((numLikes, index) => {
        return {
          data: tweets[index],
          likes: numLikes,
        }
      })
      return response
  })
}

const getUserTweetsById = (id, req, res, next) => {
  Tweet.find({ user: id }).sort({ createdAt: 'desc' })
    .populate('user')
    .then(tweets => {
      // const tweetsWithLikes = []   // { tweet: {}, likes: 20 }
      const tweetLikePromises = tweets.map(tweet => {
        return Like.countDocuments({ tweet: tweet.id }) // [3, 0, 50, 100]
      })

      return Promise.all(tweetLikePromises)
        .then(likesPerTweet => { // [3, 0, 50, 100]
          const response = likesPerTweet.map((numLikes, index) => {
            return {
              data: tweets[index],
              likes: numLikes,
            }
          })

          res.json(response)
        })

      // res.json(tweets);
    })
    .catch(next)
}

module.exports.getCurrentUserTweets = (req, res, next) => {
  getUserTweetsById(req.currentUserId, req, res, next)
}

module.exports.getUserTweets = (req, res, next) => {
  getUserTweetsById(req.params.id, req, res, next)
}

const TWEETS_PER_PAGE = 2;

module.exports.timeline = (req, res, next) => {
  // Saber a que usuarios sigue el usuario en sesión.
  const page = req.params.page

  Follow.find({ follower: req.currentUserId })
    .then(follows => {
      const followedIds = follows.map(follow => follow.followed) // Array de ids de las personas que sigo
      
      return Tweet.find({ user: { $in: [...followedIds, req.currentUserId] } })
        .populate('user')
        .sort({ createdAt: 'desc' })
        .limit(TWEETS_PER_PAGE)
        .skip(page * TWEETS_PER_PAGE)
        .then(tweets => {
          addLikesToTweets(tweets)
            .then(response =>res.json(response))
        })
    })
    .catch(next)
} */