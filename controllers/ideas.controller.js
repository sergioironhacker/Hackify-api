const Idea = require('../models/Idea.model');
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const presetCategories = require('../misc/categories');
const Bookmark = require('../models/Bookmark.model');

module.exports.getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().populate('user');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};

const getUserIdeasById = (id, req, res, next) => {
  Idea.find({ user: id }).sort({ createdAt: 'desc' })
    .populate('user')
    .then(ideas => {
      const ideaBookmarkPromises = ideas.map(idea => {
        return Bookmark.countDocuments({ idea: idea.id }) // [3, 0, 50, 100]
      })

      return Promise.all(ideaBookmarkPromises)
        .then(bookmarksPerIdea => { // [3, 0, 50, 100]
          const response = bookmarksPerIdea.map((numBookmarks, index) => {
            return {
              data: ideas[index],
              Bookmarks: numBookmarks,
            }
          })

          res.json(response)
        })
    })
    .catch(next)
}

module.exports.getCurrentUserIdeas = (req, res, next) => {
  getUserIdeasById(req.currentUserId, req, res, next)
}

module.exports.getUserIdeas = (req, res, next) => {
  getUserIdeasById(req.params.id, req, res, next)
}


module.exports.createIdea = async (req, res, next) => {
  try {
    const { title, description, fullDescription, contributionMax, contributionLimitActive, categories, timeLimit, location } = req.body;
    const userId = req.currentUserId;
    let images = [];
    if (req.files) {
      images = req.files.map(file => file.path);
    }

    // Validate contribution limit
    if (contributionLimitActive && contributionMax < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'ContributionMax should be a positive number.' });
    }



    const createdIdea = await Idea.create({
      title,
      description,
      fullDescription,
      contributionMax,
      contributionLimitActive,
      categories: Array.isArray(categories) ? categories : [categories], // Ensure it's an array
      timeLimit,
      location,
      images,
      user: userId,
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
        next(createError(StatusCodes.NOT_FOUND, 'Idea not found'));
      } else {
        res.status(StatusCodes.OK).json(idea);
      }
    })
    .catch(next);
};

module.exports.deleteIdea = (req, res, next) => {
  Idea.findByIdAndDelete(req.params.id)
    .then((idea) => {
      if (!idea) {
        next(createError(StatusCodes.NOT_FOUND, 'Idea not found'));
      } else {
        res.status(StatusCodes.NO_CONTENT).json();
      }
    })
    .catch(next);
};

module.exports.editIdea = async (req, res, next) => {
  try {
    const ideaId = req.params.id;
    const { title, description, fullDescription, contributionMax, contributionLimitActive, categories, timeLimit, location } = req.body;
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
        fullDescription,
        contributionMax,
        contributionLimitActive,
        categories,
        timeLimit,
        location,
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

// Fetch categories
module.exports.getCategories = async (req, res, next) => {
  try {
    res.status(StatusCodes.OK).json(presetCategories);
  } catch (error) {
    next(error);
  }
};


// Fetch ideas by category
module.exports.getIdeasByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    // Validate category
    if (!presetCategories.includes(category)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: `Invalid category: ${category}` });
    }

    const ideas = await Idea.find({ categories: category }).populate('user');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};