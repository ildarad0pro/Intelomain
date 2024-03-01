const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

// Route for user registration
router.post('/registration', userController.registration);

// Route for user login
router.post('/login', userController.login);

// Route for checking user authentication
router.get('/auth', authMiddleware, userController.check);

// Route for deleting a user account
router.delete('/:id', userController.delete);

module.exports = router;
