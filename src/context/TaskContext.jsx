import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchTasksApi, 
  createTaskApi, 
  updateTaskApi, 
  deleteTaskApi,
  addCommentApi,
  uploadAttachmentApi
} from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskFilters, setTaskFilters] = useState({
    projectId: '',
    assigneeId: '',
    status: 'All',
    priority: 'All',
    search: ''
  });

  const loadTasks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetchTasksApi(taskFilters);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user, taskFilters]);

  const createTask = async (taskData) => {
    try {
      const res = await createTaskApi(taskData);
      setTasks(prev => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    // Optimistic UI update for smooth dragging/status change
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
    try {
      const res = await updateTaskApi(id, { status: newStatus });
      return res.data;
    } catch (err) {
      console.error('Failed status update:', err);
      loadTasks(); // Revert
    }
  };

  const updateTask = async (id, updateData) => {
    try {
      const res = await updateTaskApi(id, updateData);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const addComment = async (taskId, content) => {
    try {
      const res = await addCommentApi(taskId, content);
      setTasks(prev => prev.map(t => t._id === taskId ? res.data : t));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const uploadAttachment = async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadAttachmentApi(taskId, formData);
      setTasks(prev => prev.map(t => t._id === taskId ? res.data : t));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to upload attachment');
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedSubtasks = task.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    return updateTask(taskId, { subtasks: updatedSubtasks });
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      taskFilters,
      setTaskFilters,
      loadTasks,
      createTask,
      updateTaskStatus,
      updateTask,
      deleteTask,
      addComment,
      uploadAttachment,
      toggleSubtask
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
