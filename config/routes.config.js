const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const archivesController = require('../controllers/archives.controller');
const likesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');
const productController = require('../controllers/product.controller')
const ideasController = require('../controllers/ideas.controller'); // Controlador para obtener las ideas

// Auth
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser)
router.post('/users', upload.single('avatar'), usersController.create);

// Ideas
router.get('/ideas', ideasController.getIdeas);
router.post('/ideas/create', authMiddleware.isAuthenticated, ideasController.createIdea); // Ruta para crear el formulario

// buy 

router.post('/forms/checkout/:id', authMiddleware.isAuthenticated, productController.createCheckoutSession);

// Archive ideas
router.post('/archived/:ideaOwner/:idea', authMiddleware.isAuthenticated, archivesController.toggleArchive);
router.get('/archived', authMiddleware.isAuthenticated, archivesController.getArchivedIdeas);

// Likes
router.post('/likes/:ideaOwner/:idea', authMiddleware.isAuthenticated, likesController.toggleLike);



/* // Comments 
router.post('/tweets', authMiddleware.isAuthenticated, tweetsController.create);
router.get('/tweets/timeline/:page', authMiddleware.isAuthenticated, tweetsController.timeline);
router.get('/tweets/me', authMiddleware.isAuthenticated, tweetsController.getCurrentUserTweets)
router.get('/tweets/:id', authMiddleware.isAuthenticated, tweetsController.getUserTweets) */

module.exports = router;