import express from 'express';
import { 
  getAllTasks, 
  getSingleTask, 
  createNewTask, 
  updateTaskDetails, 
  deleteTaskItem,
  addTaskComment,
  uploadTaskAttachment
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllTasks);
router.post('/', protect, createNewTask);
router.get('/:id', protect, getSingleTask);
router.put('/:id', protect, updateTaskDetails);
router.delete('/:id', protect, deleteTaskItem);
router.post('/:id/comments', protect, addTaskComment);
router.post('/:id/attachments', protect, upload.single('file'), uploadTaskAttachment);

export default router;
