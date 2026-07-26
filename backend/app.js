import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { getProjects } from './services/projectService.js';
import { getTasks } from './services/taskService.js';
import { getAllUsers } from './services/userService.js';
import { protect } from './middleware/authMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve file uploads statically
const uploadDir = path.join(process.cwd(), 'backend', 'uploads');
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Analytics API
app.get('/api/analytics', protect, async (req, res, next) => {
  try {
    const projects = await getProjects();
    const tasks = await getTasks();
    const users = await getAllUsers();

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const overdueTasks = tasks.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < new Date()).length;

    const taskStatusCounts = {
      Backlog: tasks.filter(t => t.status === 'Backlog').length,
      ToDo: tasks.filter(t => t.status === 'To Do').length,
      InProgress: inProgressTasks,
      Review: tasks.filter(t => t.status === 'Review').length,
      Completed: completedTasks
    };

    const taskPriorityCounts = {
      Low: tasks.filter(t => t.priority === 'Low').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      High: tasks.filter(t => t.priority === 'High').length,
      Urgent: tasks.filter(t => t.priority === 'Urgent').length
    };

    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalTeamMembers: users.length,
      taskStatusCounts,
      taskPriorityCounts
    });
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
