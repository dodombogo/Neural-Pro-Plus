import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, File, Trash2, Plus, FileText } from 'lucide-react';
import { loadProject, deleteProject, getRecentProjects } from '../utils/storage';
import { TranscriptionProject } from '../types/types';
import { TRANSCRIPT_FORMATS } from '../types/transcriptFormats';

export const RecentProjects: React.FC = () => {
  const navigate = useNavigate();
  const [recentProjects, setRecentProjects] = useState<TranscriptionProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const projects = getRecentProjects();
      setRecentProjects(projects);
      setError(null);
    } catch (err) {
      console.error('Error loading recent projects:', err);
      setError('Failed to load recent projects');
    }
  }, []);

  const handleProjectClick = (projectId: string) => {
    try {
      const project = loadProject(projectId);
      if (project) {
        navigate(`/editor/${projectId}`);
        setError(null);
      } else {
        setError('Project not found');
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deleteProject(projectId);
      setRecentProjects(prev => prev.filter(p => p.id !== projectId));
      setError(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getProjectIdPreview = (id: string) => {
    return id.slice(-4);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  if (recentProjects.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/20 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">Recent Projects</h2>
          <p className="text-sm text-gray-400">Continue working on your transcriptions</p>
        </div>
        <button
          onClick={() => navigate('/editor')}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-gray-900 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-500/25"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="space-y-4">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
            className="group relative flex items-start gap-4 p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg cursor-pointer transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-200 group-hover:text-cyan-500 transition-colors truncate">
                  {project.fileName || 'Untitled Project'}
                </h3>
                <button
                  onClick={(e) => handleDeleteProject(e, project.id)}
                  className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Created:</p>
                  <p className="text-gray-300">{formatDate(project.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Last Modified:</p>
                  <p className="text-gray-300">{formatDate(project.lastModified)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Project ID:</p>
                  <p className="text-gray-300 font-mono">{getProjectIdPreview(project.id)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Format:</p>
                  <p className="text-gray-300">{project.transcriptFormat}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 