const { StatusCodes } = require("http-status-codes");
const createError = require('http-errors');
const Bookmark = require("../models/Bookmark.model");

module.exports.toggleBookmark = (req, res, next) => {
  const bookmarker = req.currentUserId;
  const bookmarkedIdea = req.params.ideaId;

  // Lo primero compruebo si ya has guardado esa idea
  Bookmark.findOne({ bookmarker, bookmarkedIdea })
    .then(bookmark => {
      if (bookmark) {
        // Tendre que borrarlo, porque quiero desactivar ese guardado
        return Bookmark.findOneAndDelete({ bookmarker, bookmarkedIdea })
          .then(() => {
            res.status(StatusCodes.NO_CONTENT).json({})
          })
      } else {
        // Tengo que crear el guardado
        return Bookmark.create({ bookmarker, bookmarkedIdea })
          .then((bookmark) => {
            res.status(StatusCodes.CREATED).json(bookmark)
          })
      }
    })
    .catch(next)
}

module.exports.getBookmarkedIdeas = (id, req, res, next) => {
  Bookmark.find({ bookmarker: id }) // Me traigo mis bookmarked
    .populate('bookmarkedIdea')
    .then(bookmarks => {
      res.json(bookmarks.map(bookmark => bookmark.bookmarkedIdea)); // En vez de enviar todo el objeto de bookmark, me mando el campo bookmarked
    })
    .catch(next)
}