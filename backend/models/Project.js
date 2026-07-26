import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  status: { 
    type: String, 
    enum: ['Planning', 'Active', 'On Hold', 'Completed'], 
    default: 'Planning' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'], 
    default: 'Medium' 
  },
  startDate: { type: String, required: true },
  dueDate: { type: String, required: true },
  budget: { type: Number, default: 0 },
  ownerId: { type: String, required: true },
  members: [{ type: String }],
  tags: [{ type: String }]
}, {
  timestamps: true
});

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
export default Project;
