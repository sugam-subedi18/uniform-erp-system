const router = require('express').Router();
const c = require('../controllers/fabricController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

// Sales staff can read fabrics (they pick a fabric when taking an order) but not change them
router.get('/', authorize('admin', 'store_manager', 'sales_staff'), c.list);
router.post('/', authorize('admin', 'store_manager'), c.create);
router.put('/:id', authorize('admin', 'store_manager'), c.update);
router.delete('/:id', authorize('admin', 'store_manager'), c.remove);

module.exports = router;
