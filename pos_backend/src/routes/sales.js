const express = require('express');
const router = express.Router();
const { getAll, getOne, create, refund } = require('../controllers/saleController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(create);

router.route('/:id')
  .get(getOne);

router.post('/:id/refund', authorize('admin', 'manager'), refund);

module.exports = router;
