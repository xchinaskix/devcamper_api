const express = require('express');
const {
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUsers
} = require('../controllers/users');

const router = express.Router();
const User = require('../models/User');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedReults');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
