const { StatusCodes } = require("http-status-codes");
const Bookmark = require("../models/Bookmark.model");

module.exports.toggleBookmark = (req, res, next) => {
  const { idea } = req.params

  const queryData = { bookmarker: req.currentUserId, idea }
  
  Bookmark.findOne(queryData)
    .then(bookmark => {
      if (bookmark) {
        Bookmark.findOneAndDelete(queryData)
          .then(() => res.status(StatusCodes.NO_CONTENT).json({}))
      } else {
        Bookmark.create(queryData)
          .then(bookmark => {
            res.status(StatusCodes.CREATED).json(bookmark)
          })
      }
    })
    .catch(next)
}

module.exports.getBookmarkedIdeas = (id, req, res, next) => {
  Bookmark.find({ bookmarker: id }) // Me traigo mis bookmarked
    .populate('user idea')
    .then(bookmarks => {
      res.json(bookmarks.map(bookmark => bookmark.idea)); // En vez de enviar todo el objeto de bookmark, me mando el campo bookmarked
    })
    .catch(next)
}