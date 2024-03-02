const Idea = require('../models/Idea.model');
const { StatusCodes } = require('http-status-codes');

module.exports.getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().populate('user');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};

module.exports.createIdea = async (req, res, next) => {
  try {
    const { title, description, contributionMax } = req.body;
    const userId = req.currentUserId;
    let images = []
    if (req.files) {
      images = req.files.map(file => file.path);
    }
    const createdIdea = await Idea.create({ title, description, contributionMax, user: userId, images });
    res.status(StatusCodes.CREATED).json(createdIdea);
  } catch (error) {
    next(error);
  }
};

module.exports.getIdeaDetail = (req, res, next) => {
  Idea.findById(req.params.id)
    .then((idea) => {
      if (!idea) {
        next(createError(StatusCodes.NOT_FOUND, 'Idea not found'))
      } else {
        res.status(StatusCodes.OK).json(idea)
      }
    })
    .catch(next)
}

module.exports.deleteIdea = (req, res, next) => {
  Idea.findByIdAndDelete(req.params.id)
    .then((idea) => {
      if (!idea) {
        next(createError(StatusCodes.NOT_FOUND, 'Idea not found'))
      } else {
        res.status(StatusCodes.NO_CONTENT).json();
      }
    })
    .catch(next)
}

module.exports.editIdea = (req, res, next) => {
  Idea.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(editedIdea => {
      res.json(editedIdea);
    })
    .catch(next)
}