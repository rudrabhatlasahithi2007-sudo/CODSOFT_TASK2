import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { Users, Mail, Shield, CheckCircle2, FolderKanban, Award } from 'lucide-react';

export default function TeamPage() {
  const { usersList, handleDemoLogin, user } = useAuth();
  const { tasks } = useTask();
  const { projects } = useProject();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Team Directory & Workload</h2>
        <p className="text-xs text-slate-500 font-medium">Overview of team roles, active assignments, and capacity</p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {usersList.map(member => {
          const assignedTasks = tasks.filter(t => t.assigneeId === member._id);
          const activeTasks = assignedTasks.filter(t => t.status !== 'Completed').length;
          const completedTasks = assignedTasks.filter(t => t.status === 'Completed').length;
          const assignedProjects = projects.filter(p => p.members && p.members.includes(member._id)).length;

          const isCurrentUser = user && user._id === member._id;

          return (
            <div key={member._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                {/* Profile Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                        {isCurrentUser && (
                          <span className="px-2 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">You</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-indigo-600">{member.role}</p>
                      <p className="text-[11px] text-slate-400">{member.department}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {member.bio || 'Core engineering team contributor.'}
                </p>

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Workload Stats & Action */}
              <div>
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Active</span>
                    <span className="text-xs font-bold text-amber-600">{activeTasks} Tasks</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Done</span>
                    <span className="text-xs font-bold text-emerald-600">{completedTasks} Tasks</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Projects</span>
                    <span className="text-xs font-bold text-indigo-600">{assignedProjects}</span>
                  </div>
                </div>

                {!isCurrentUser && (
                  <button
                    onClick={() => handleDemoLogin(member.email)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Switch to {member.name.split(' ')[0]} Persona
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
