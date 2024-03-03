const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const archivesController = require('../controllers/archives.controller');
const likesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');
const productController = require('../controllers/product.controller');
const ideasController = require('../controllers/ideas.controller'); // Controlador para obtener las ideas
const messageController = require('../controllers/message.controller'); // Controllador para mensages
const chatController = require('../controllers/chat.controller'); // controlador de chat



// Auth
router.post('/login', authController.login);

// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', authMiddleware.isAuthenticated, usersController.getUser)
router.post('/users', upload.single('avatar'), usersController.create);

// delete acc

router.delete('/delete-account', authMiddleware.isAuthenticated, usersController.deleteAccount);

// Ideas CRUD
router.get('/ideas', ideasController.getIdeas);
router.post('/ideas/create', authMiddleware.isAuthenticated, upload.array('images', 5), ideasController.createIdea);
router.get('/ideas/:id', ideasController.getIdeaDetail);
router.put('/ideas/:id', ideasController.editIdea);
router.delete('/ideas/:id', ideasController.deleteIdea);

// buy 

router.post('/ideas/:id/checkout', authMiddleware.isAuthenticated, productController.createCheckoutSession);

// Archive ideas
router.post('/archived/:ideaOwner/:idea', authMiddleware.isAuthenticated, archivesController.toggleArchive);
router.get('/archived', authMiddleware.isAuthenticated, archivesController.getArchivedIdeas);

// Likes
router.post('/likes/:ideaOwner/:idea', authMiddleware.isAuthenticated, likesController.toggleLike);



// 

/* MESSAGES */
router.post('/message/create/:id', /* authMiddleware.isAuthenticated, */ messageController.createMessage);
router.patch('/message/read/:id', /* authMiddleware.isAuthenticated, */ messageController.messageRead);

/* CHAT */
router.get('/chats', /* authMiddleware.isAuthenticated, */ chatController.getAllChats);
router.post('/chat/create/:id', /* authMiddleware.isAuthenticated, */ chatController.createChat);
router.delete('/chat/delete/:id', /* authMiddleware.isAuthenticated, */ chatController.deleteChat);
router.get('/chat/:id', /* authMiddleware.isAuthenticated, */ chatController.getCurrentChat);



//



//////////////// busqueda 

/* router.get('/search', ideasController.searchIdeas); */


////////////////////

/* // Comments 
router.post('/tweets', authMiddleware.isAuthenticated, tweetsController.create);
router.get('/tweets/timeline/:page', authMiddleware.isAuthenticated, tweetsController.timeline);
router.get('/tweets/me', authMiddleware.isAuthenticated, tweetsController.getCurrentUserTweets)
router.get('/tweets/:id', authMiddleware.isAuthenticated, tweetsController.getUserTweets) */

module.exports = router;