const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(authorize('admin', 'manager'), create);

router.route('/:id')
  .put(authorize('admin', 'manager'), update)
  .delete(authorize('admin'), remove);

module.exports = router;
