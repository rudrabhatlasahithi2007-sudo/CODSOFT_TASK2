import mongoose from 'mongoose';

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assigneeId: { type: String, required: true },
  createdById: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Backlog', 'To Do', 'In Progress', 'Review', 'Completed'], 
    default: 'To Do' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'], 
    default: 'Medium' 
  },
  dueDate: { type: String, required: true },
  estimatedHours: { type: Number, default: 0 },
  loggedHours: { type: Number, default: 0 },
  tags: [{ type: String }],
  subtasks: [subtaskSchema],
  comments: [commentSchema],
  attachments: [attachmentSchema]
}, {
  timestamps: true
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
export default Task;
