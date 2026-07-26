import express from 'express';
import { getUsers, getUserDetails, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserDetails);
router.put('/:id', protect, updateProfile);

export default router;
