const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const archivesController = require('../controllers/archives.controller');
const likesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('./storage.config');
const productController = require('../controllers/product.controller')
const ideasController = require('../controllers/ideas.controller'); // Controlador para obtener las ideas
const messagesController = require('../controllers/messages.controller')



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
router.post('/ideas/create', authMiddleware.isAuthenticated, ideasController.createIdea); // Ruta para crear el formulario
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



// Crear mensaje
router.post('/messages/send',  messagesController.sendMessage);

// Obtener mensajes enviados por el usuario actual
router.get('/messages/sent/:userId',  messagesController.getSentMessages);

// Obtener mensajes recibidos por el usuario actual
router.get('/messages/received/:userId',  messagesController.getReceivedMessages);

// Obtener detalles de un mensaje específico
router.get('/messages/:id',  messagesController.getMessageDetails);

// Marcar un mensaje como leído
router.put('/messages/:id/mark-read',  messagesController.markMessageAsRead);

// Eliminar un mensaje
router.delete('/messages/:id', messagesController.deleteMessage);



//////////////// busqueda 

/* router.get('/search', ideasController.searchIdeas); */


////////////////////

/* // Comments 
router.post('/tweets', authMiddleware.isAuthenticated, tweetsController.create);
router.get('/tweets/timeline/:page', authMiddleware.isAuthenticated, tweetsController.timeline);
router.get('/tweets/me', authMiddleware.isAuthenticated, tweetsController.getCurrentUserTweets)
router.get('/tweets/:id', authMiddleware.isAuthenticated, tweetsController.getUserTweets) */

module.exports = router;