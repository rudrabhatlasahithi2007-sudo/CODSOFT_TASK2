import React, { useEffect, useState } from 'react';
import { fetchAnalyticsApi } from '../services/api';
import StatsCard from '../components/StatsCard';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  FolderKanban,
  Users
} from 'lucide-react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchAnalyticsApi();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-12 text-center text-slate-400 font-medium text-xs">
        Loading analytics engine metrics...
      </div>
    );
  }

  const statusCounts = stats.taskStatusCounts || {};
  const priorityCounts = stats.taskPriorityCounts || {};

  const totalTasks = stats.totalTasks || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Project Performance & Velocity</h2>
        <p className="text-xs text-slate-500 font-medium">Real-time analytical telemetry and status distribution metrics</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={FolderKanban}
          color="indigo"
          change={`${stats.completedProjects} Completed`}
          changeType="positive"
        />
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={BarChart3}
          color="sky"
          change={`${stats.completedTasks} Completed`}
          changeType="positive"
        />
        <StatsCard
          title="Tasks In Progress"
          value={stats.inProgressTasks}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Overdue Tasks"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          color="rose"
          change={stats.overdueTasks > 0 ? 'Critical' : 'Healthy'}
          changeType={stats.overdueTasks > 0 ? 'negative' : 'positive'}
        />
      </div>

      {/* Analytics Visual Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Task Status Pipeline Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Task Status Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Backlog', count: statusCounts.Backlog || 0, color: 'bg-slate-400' },
              { label: 'To Do', count: statusCounts.ToDo || 0, color: 'bg-blue-500' },
              { label: 'In Progress', count: statusCounts.InProgress || 0, color: 'bg-amber-500' },
              { label: 'In Review', count: statusCounts.Review || 0, color: 'bg-purple-500' },
              { label: 'Completed', count: statusCounts.Completed || 0, color: 'bg-emerald-500' }
            ].map(item => {
              const pct = Math.round((item.count / totalTasks) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900">{item.count} items ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Priority Severity Spectrum
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Urgent Priority', count: priorityCounts.Urgent || 0, color: 'bg-rose-500' },
              { label: 'High Priority', count: priorityCounts.High || 0, color: 'bg-amber-500' },
              { label: 'Medium Priority', count: priorityCounts.Medium || 0, color: 'bg-indigo-500' },
              { label: 'Low Priority', count: priorityCounts.Low || 0, color: 'bg-slate-400' }
            ].map(item => {
              const pct = Math.round((item.count / totalTasks) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900">{item.count} tasks ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
