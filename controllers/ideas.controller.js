const Idea = require('../models/Idea.model');
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const presetCategories = require('../misc/categories');
const Bookmark = require('../models/Bookmark.model');
const Contribution = require('../models/Contribution.model'); /// modelo de contribuiones

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

module.exports.getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().populate('user bookmarks contributions');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};

const addBookmarksToIdeas = async (ideas) => {
  const ideaBookmarkPromises = ideas.map(idea => {
    return Bookmark.countDocuments({ idea: idea.id });
  });

  const bookmarksPerIdea = await Promise.all(ideaBookmarkPromises);

  const populatedIdeas = await Idea.populate(ideas, { path: 'user bookmarks contributions' });

  const response = populatedIdeas.map((idea, index) => {
    return {
      data: idea,
      bookmarks: bookmarksPerIdea[index],
    };
  });

  return response;
};


const getUserIdeasById = async (id, req, res, next) => {
  try {
    const ideas = await Idea.find({ user: id }).sort({ createdAt: 'desc' }).populate('user bookmarks contributions');
    const populatedIdeas = await addBookmarksToIdeas(ideas);

    res.json(populatedIdeas);
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUserIdeas = (req, res, next) => {
  getUserIdeasById(req.currentUserId, req, res, next)
}

module.exports.getUserIdeas = (req, res, next) => {
  getUserIdeasById(req.params.id, req, res, next)
}

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

    const ideas = await Idea.find({ categories: category }).populate('user bookmarks contributions');
    res.status(StatusCodes.OK).json(ideas);
  } catch (error) {
    next(error);
  }
};



// controlador para mostrar el total de contribuciones 

exports.getTotalContributions = async (req, res) => {
  try {
    const totalContributions = await Contribution.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$paymentAmount' } 
        }
      }
    ]);
    if (totalContributions.length === 0) {
      return res.status(404).json({ error: 'No contributions found' });
    }
    res.status(200).json({ totalContributions: totalContributions[0].total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Función para obtener las ideas en las que un usuario ha contribuido
exports.getUserContributedIdeas = async (req, res) => {
  try {
    
    const { userId } = req.params;

    console.log('User ID:', userId);


    const contributedIdeas = await Contribution.find({ contributingUser: userId }).populate('idea');

    console.log('Contributed ideas:', contributedIdeas);

    res.status(200).json(contributedIdeas);
  } catch (error) {
    console.error('Error fetching contributed ideas:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};