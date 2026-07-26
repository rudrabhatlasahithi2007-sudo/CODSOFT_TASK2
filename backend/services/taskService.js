import Task from '../models/Task.js';
import { initialTasks } from '../utils/seedData.js';

let tasksStore = [...initialTasks];

export const getTasks = async (query = {}) => {
  const { projectId, assigneeId, status, priority, search } = query;

  try {
    if (process.env.MONGODB_URI) {
      let filter = {};
      if (projectId) filter.projectId = projectId;
      if (assigneeId) filter.assigneeId = assigneeId;
      if (status && status !== 'All') filter.status = status;
      if (priority && priority !== 'All') filter.priority = priority;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const tasks = await Task.find(filter).sort({ dueDate: 1 });
      if (tasks && tasks.length > 0) return tasks;
    }
  } catch (err) {
    console.warn('Task DB query fallback:', err.message);
  }

  let result = [...tasksStore];

  if (projectId) {
    result = result.filter(t => t.projectId === projectId);
  }
  if (assigneeId) {
    result = result.filter(t => t.assigneeId === assigneeId);
  }
  if (status && status !== 'All') {
    result = result.filter(t => t.status === status);
  }
  if (priority && priority !== 'All') {
    result = result.filter(t => t.priority === priority);
  }
  if (search) {
    const term = search.toLowerCase();
    result = result.filter(t => 
      t.title.toLowerCase().includes(term) || 
      t.description.toLowerCase().includes(term)
    );
  }

  return result;
};

export const getTaskById = async (id) => {
  try {
    if (process.env.MONGODB_URI) {
      const task = await Task.findById(id);
      if (task) return task;
    }
  } catch (err) {
    // fallback
  }
  return tasksStore.find(t => t._id === id) || null;
};

export const createTask = async (taskData) => {
  try {
    if (process.env.MONGODB_URI) {
      const newTask = await Task.create(taskData);
      return newTask;
    }
  } catch (err) {
    console.warn('Create task Mongoose fallback:', err.message);
  }

  const newTask = {
    _id: `task_${Date.now()}`,
    projectId: taskData.projectId,
    title: taskData.title,
    description: taskData.description || '',
    assigneeId: taskData.assigneeId,
    createdById: taskData.createdById,
    status: taskData.status || 'To Do',
    priority: taskData.priority || 'Medium',
    dueDate: taskData.dueDate || new Date(Date.now() + 7*86400000).toISOString().split('T')[0],
    estimatedHours: Number(taskData.estimatedHours) || 0,
    loggedHours: Number(taskData.loggedHours) || 0,
    tags: taskData.tags || [],
    subtasks: taskData.subtasks || [],
    comments: [],
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasksStore.unshift(newTask);
  return newTask;
};

export const updateTask = async (id, updateData) => {
  try {
    if (process.env.MONGODB_URI) {
      const updated = await Task.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true });
      if (updated) return updated;
    }
  } catch (err) {
    // fallback
  }

  const index = tasksStore.findIndex(t => t._id === id);
  if (index !== -1) {
    tasksStore[index] = { 
      ...tasksStore[index], 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    return tasksStore[index];
  }
  return null;
};

export const deleteTask = async (id) => {
  try {
    if (process.env.MONGODB_URI) {
      await Task.findByIdAndDelete(id);
    }
  } catch (err) {
    // fallback
  }
  tasksStore = tasksStore.filter(t => t._id !== id);
  return true;
};

export const addCommentToTask = async (taskId, user, content) => {
  const newComment = {
    id: `c_${Date.now()}`,
    userId: user._id,
    userName: user.name,
    userAvatar: user.avatar,
    content,
    createdAt: new Date().toISOString()
  };

  try {
    if (process.env.MONGODB_URI) {
      const task = await Task.findById(taskId);
      if (task) {
        task.comments.push(newComment);
        await task.save();
        return task;
      }
    }
  } catch (err) {
    // fallback
  }

  const task = tasksStore.find(t => t._id === taskId);
  if (task) {
    if (!task.comments) task.comments = [];
    task.comments.push(newComment);
    task.updatedAt = new Date().toISOString();
    return task;
  }
  return null;
};

export const addAttachmentToTask = async (taskId, file) => {
  const newAttachment = {
    id: `att_${Date.now()}`,
    filename: file.filename,
    originalName: file.originalname,
    path: `/uploads/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString()
  };

  try {
    if (process.env.MONGODB_URI) {
      const task = await Task.findById(taskId);
      if (task) {
        task.attachments.push(newAttachment);
        await task.save();
        return task;
      }
    }
  } catch (err) {
    // fallback
  }

  const task = tasksStore.find(t => t._id === taskId);
  if (task) {
    if (!task.attachments) task.attachments = [];
    task.attachments.push(newAttachment);
    task.updatedAt = new Date().toISOString();
    return task;
  }
  return null;
};
