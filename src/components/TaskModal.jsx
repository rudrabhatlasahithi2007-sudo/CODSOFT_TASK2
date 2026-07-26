import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import { 
  X, 
  Calendar, 
  Clock, 
  UserCheck, 
  Send, 
  Paperclip, 
  Plus, 
  CheckSquare, 
  MessageSquare, 
  FileText, 
  Trash2,
  Tag
} from 'lucide-react';

export default function TaskModal({ task, onClose }) {
  const { updateTask, addComment, uploadAttachment, toggleSubtask, deleteTask } = useTask();
  const { usersList } = useAuth();
  const { projects } = useProject();

  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);

  if (!task) return null;

  const currentProject = projects.find(p => p._id === task.projectId);
  const assignee = usersList.find(u => u._id === task.assigneeId) || { name: 'Unassigned', avatar: '' };

  const handleStatusChange = async (e) => {
    await updateTask(task._id, { status: e.target.value });
  };

  const handlePriorityChange = async (e) => {
    await updateTask(task._id, { priority: e.target.value });
  };

  const handleAssigneeChange = async (e) => {
    await updateTask(task._id, { assigneeId: e.target.value });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await addComment(task._id, commentText);
      setCommentText('');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileUploading(true);
    try {
      await uploadAttachment(task._id, file);
    } catch (err) {
      alert(err.message);
    } finally {
      setFileUploading(false);
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSt = {
      id: `st_${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    const updated = [...(task.subtasks || []), newSt];
    await updateTask(task._id, { subtasks: updated });
    setNewSubtaskTitle('');
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(task._id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {currentProject?.title || 'Project Task'}
              </span>
              <span className="text-xs text-slate-400 font-medium">• Due {task.dueDate}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">{task.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDeleteTask}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {task.description || 'No detailed description provided for this task.'}
              </p>
            </div>

            {/* Subtask Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Subtasks Checklist
                </h4>
                <span className="text-xs font-semibold text-slate-400">
                  {(task.subtasks || []).filter(s => s.completed).length} / {(task.subtasks || []).length}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {(task.subtasks || []).map(st => (
                  <label 
                    key={st.id} 
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(task._id, st.id)}
                      className="rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleAddSubtask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>
            </div>

            {/* Comments Section */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                Comments & Discussion
              </h4>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                {(task.comments || []).map(comment => (
                  <div key={comment.id} className="flex gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <img src={comment.userAvatar} alt={comment.userName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-900">{comment.userName}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-normal">{comment.content}</p>
                    </div>
                  </div>
                ))}
                {(task.comments || []).length === 0 && (
                  <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation below!</p>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>

            {/* File Attachments */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  Attachments
                </h4>
                <label className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>{fileUploading ? 'Uploading...' : 'Upload File'}</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={fileUploading} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(task.attachments || []).map((att, i) => (
                  <a
                    key={i}
                    href={att.path}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200/70 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="truncate text-xs font-semibold">{att.originalName}</p>
                      <p className="text-[10px] text-slate-400">{(att.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Properties Column */}
          <div className="space-y-5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-5 lg:pt-0 lg:pl-6">
            
            {/* Status Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Status</label>
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Priority</label>
              <select
                value={task.priority}
                onChange={handlePriorityChange}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent Priority</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Assignee</label>
              <select
                value={task.assigneeId}
                onChange={handleAssigneeChange}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-hidden focus:border-indigo-500"
              >
                {usersList.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            {/* Estimated & Logged Hours */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Estimated Time:</span>
                <span className="font-bold text-slate-900">{task.estimatedHours || 0} hrs</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Logged Hours:</span>
                <span className="font-bold text-slate-900">{task.loggedHours || 0} hrs</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
