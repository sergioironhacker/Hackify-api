const Idea = require('../models/Idea.model');
const { StatusCodes } = require('http-status-codes');

module.exports.createIdea = (req, res, next) => {
  const { title, description, contributionMax } = req.body;
  const userId = req.currentUserId;

  Idea.create({ title, description, contributionMax, user: userId })
    .then(createdIdea => {
      res.status(StatusCodes.CREATED).json(createdIdea);
    })
    .catch(next);
};

module.exports.getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().populate('user');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};

// busqueda 


