const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const tweetsController = require('../controllers/tweets.controller');
const followsController = require('../controllers/follows.controller');
const likesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');
const getFormsController = require('../controllers/getForms.controller'); // Controlador para obtener todos los formularios
const createFormController = require('../controllers/form.controller'); // Controlador para crear un formulario


// Auth
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser)
router.post('/users', upload.single('avatar'), usersController.create);

// Tweets
router.post('/tweets', authMiddleware.isAuthenticated, tweetsController.create);
router.get('/tweets/timeline/:page', authMiddleware.isAuthenticated, tweetsController.timeline);
router.get('/tweets/me', authMiddleware.isAuthenticated, tweetsController.getCurrentUserTweets)
router.get('/tweets/:id', authMiddleware.isAuthenticated, tweetsController.getUserTweets)

// Follows
router.post('/follows/:followedId', authMiddleware.isAuthenticated, followsController.toggleFollow);
router.get('/following/me', authMiddleware.isAuthenticated, followsController.getCurrentUserFollowing);
router.get('/following/:id', authMiddleware.isAuthenticated, followsController.getUserFollowing);
router.get('/followed/me', authMiddleware.isAuthenticated, followsController.getCurrentUserFollowed);
router.get('/followed/:id', authMiddleware.isAuthenticated, followsController.getUserFollowed);

// Likes
router.post('/likes/:tweetOwner/:tweet', authMiddleware.isAuthenticated, likesController.toggleLike);


// Create Form
router.get('/forms', authMiddleware.isAuthenticated, getFormsController.getForms);
router.post('/createform', authMiddleware.isAuthenticated, createFormController.createForm); // Ruta para crear el formulario


module.exports = router;