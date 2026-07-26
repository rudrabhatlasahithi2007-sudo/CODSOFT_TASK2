import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  addCommentToTask,
  addAttachmentToTask
} from '../services/taskService.js';

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await getTasks(req.query);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getSingleTask = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createNewTask = async (req, res, next) => {
  try {
    const { title, projectId, assigneeId, dueDate } = req.body;
    if (!title || !projectId || !assigneeId || !dueDate) {
      return res.status(400).json({ message: 'Please provide task title, project ID, assignee, and due date' });
    }

    const taskData = {
      ...req.body,
      createdById: req.user._id
    };

    const task = await createTask(taskData);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTaskDetails = async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskItem = async (req, res, next) => {
  try {
    const success = await deleteTask(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addTaskComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const updatedTask = await addCommentToTask(req.params.id, req.user, content);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(201).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const uploadTaskAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const updatedTask = await addAttachmentToTask(req.params.id, req.file);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(201).json(updatedTask);
  } catch (error) {
    next(error);
  }
};
