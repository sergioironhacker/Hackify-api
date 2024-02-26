const { StatusCodes } = require("http-status-codes");
const createError = require('http-errors');
const Archive = require("../models/Archive.model");

module.exports.toggleArchive = (req, res, next) => {
  const archiver = req.currentUserId;
  const archivedIdea = req.params.ideaId;

  // Lo primero compruebo si ya has guardado esa idea
  Archive.findOne({ archiver, archivedIdea })
    .then(archive => {
      if (archive) {
        // Tendre que borrarlo, porque quiero desactivar ese guardado
        return Archive.findOneAndDelete({ archiver, archivedIdea })
          .then(() => {
            res.status(StatusCodes.NO_CONTENT).json({})
          })
      } else {
        // Tengo que crear el guardado
        return Archive.create({ archiver, archivedIdea })
          .then((archive) => {
            res.status(StatusCodes.CREATED).json(archive)
          })
      }
    })
    .catch(next)
}

module.exports.getArchivedIdeas = (id, req, res, next) => {
  Archive.find({ archiver: id }) // Me traigo mis archived
    .populate('archivedIdea')
    .then(archives => {
      res.json(archives.map(archive => archive.archivedIdea)); // En vez de enviar todo el objeto de follow, me mando el campo followed
    })
    .catch(next)
}