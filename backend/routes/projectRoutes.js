import express from 'express';
import { 
  getAllProjects, 
  getSingleProject, 
  createNewProject, 
  updateProjectDetails, 
  deleteProjectItem 
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllProjects);
router.post('/', protect, createNewProject);
router.get('/:id', protect, getSingleProject);
router.put('/:id', protect, updateProjectDetails);
router.delete('/:id', protect, deleteProjectItem);

export default router;
