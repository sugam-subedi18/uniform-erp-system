const router = require('express').Router();
const c = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate, authorize('admin', 'store_manager'));

router.get('/', c.list);
router.post('/', c.create);
router.put('/:id', c.update);

module.exports = router;
