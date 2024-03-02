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

module.exports.createIdea = (req, res, next) => {
  const { title, description, contributionMax } = req.body;
  const userId = req.currentUserId;

  Idea.create({ title, description, contributionMax, user: userId })
    .then(createdIdea => {
      res.status(StatusCodes.CREATED).json(createdIdea);
    })
    .catch(next);
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