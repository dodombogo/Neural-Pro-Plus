import { TranscriptionProject } from '../types/types';

const STORAGE_KEY = 'neural_pro_projects';
const MAX_RECENT_PROJECTS = 5;

export const loadProject = (projectId: string): TranscriptionProject | null => {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    if (!projectsJson) return null;
    
    const projects: Record<string, TranscriptionProject> = JSON.parse(projectsJson);
    return projects[projectId] || null;
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
};

export const saveProject = (project: TranscriptionProject): void => {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    const projects: Record<string, TranscriptionProject> = projectsJson 
      ? JSON.parse(projectsJson) 
      : {};
    
    projects[project.id] = {
      ...project,
      lastModified: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving project:', error);
  }
};

export const getAllProjects = (): TranscriptionProject[] => {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    if (!projectsJson) return [];
    
    const projects: Record<string, TranscriptionProject> = JSON.parse(projectsJson);
    return Object.values(projects).sort((a, b) => b.lastModified - a.lastModified);
  } catch (error) {
    console.error('Error getting all projects:', error);
    return [];
  }
};

export const getRecentProjects = (): TranscriptionProject[] => {
  return getAllProjects().slice(0, MAX_RECENT_PROJECTS);
};

export const deleteProject = (projectId: string): void => {
  try {
    const projectsJson = localStorage.getItem(STORAGE_KEY);
    if (!projectsJson) return;
    
    const projects: Record<string, TranscriptionProject> = JSON.parse(projectsJson);
    delete projects[projectId];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error deleting project:', error);
  }
}; 