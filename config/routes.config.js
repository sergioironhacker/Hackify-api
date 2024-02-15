const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


// Auth 
router.post('/login', authController.login);



// Users
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)
router.get('/users/:id', usersController.getUser)
router.post('/users', usersController.create);










module.exports = router;
