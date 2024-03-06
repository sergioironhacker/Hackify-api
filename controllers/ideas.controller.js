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
    const createdIdea = await Idea.create({
      title,
      description,
      contributionMax,
      user: userId,
      images,
      contributionTotal: 0,
    });
    
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

module.exports.editIdea = async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const { title, description, contributionMax } = req.body;
    const userId = req.currentUserId;

    // Check if new files are provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.path);
    }

    // Find the existing idea
    const existingIdea = await Idea.findById(ideaId);

    if (!existingIdea) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Idea not found' });
    }

    // Combine existing images with new images
    const updatedImages = [...existingIdea.images, ...newImages];

    // Update the idea with new data and images
    const updatedIdea = await Idea.findByIdAndUpdate(
      ideaId,
      {
        title,
        description,
        contributionMax,
        user: userId,
        images: updatedImages,
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json(updatedIdea);
  } catch (error) {
    next(error);
  }
};
