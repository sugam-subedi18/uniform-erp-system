const router = require('express').Router();
const { login, register, me, listUsers } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/login', login);                                        // public
router.get('/me', authenticate, me);                                 // any logged-in user
router.get('/users', authenticate, authorize('admin'), listUsers);   // admin only
router.post('/register', authenticate, authorize('admin'), register); // admin only

module.exports = router;
