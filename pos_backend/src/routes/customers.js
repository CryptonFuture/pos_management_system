const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(create);

router.route('/:id')
  .put(update)
  .delete(authorize('admin'), remove);

module.exports = router;
