import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { NeuralBackground } from './components/NeuralBackground';
import { AnimatePresence } from 'framer-motion';
import { useSettingsStore } from './store/settingsStore';
import './index.css';

// Lazy load components
const ProjectsView = lazy(() => import('./components/ProjectsView'));
const EditorView = lazy(() => import('./components/EditorView'));
const HomeView = lazy(() => import('./components/HomeView'));
const WelcomeTour = lazy(() => import('./components/WelcomeTour'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-200"></div>
  </div>
);

const BackgroundWrapper: React.FC = () => {
  const location = useLocation();
  const isEditorPage = location.pathname.includes('/editor');
  return isEditorPage ? null : <NeuralBackground />;
};

const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isWelcomeTourOpen, setIsWelcomeTourOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { defaultPlaybackSpeed, defaultVolume } = useSettingsStore();
  const [playbackSettings, setPlaybackSettings] = React.useState({
    speed: defaultPlaybackSpeed,
    volume: defaultVolume
  });

  React.useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setIsWelcomeTourOpen(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900/50 text-gray-200 relative flex flex-col">
      <BackgroundWrapper />
      <Header 
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onHelpClick={() => setIsWelcomeTourOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Suspense fallback={<LoadingFallback />}>
            <MobileNav 
              onClose={() => setIsMobileMenuOpen(false)}
              onHelpClick={() => {
                setIsWelcomeTourOpen(true);
                setIsMobileMenuOpen(false);
              }}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <main className="flex-1 container mx-auto px-4 pt-20 pb-8 max-w-7xl relative">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/projects" element={<ProjectsView />} />
            <Route path="/editor/:projectId?" element={<EditorView />} />
          </Routes>
        </Suspense>
      </main>

      <Suspense fallback={<LoadingFallback />}>
        {isWelcomeTourOpen && (
          <WelcomeTour 
            isOpen={isWelcomeTourOpen}
            onClose={() => setIsWelcomeTourOpen(false)}
          />
        )}

        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            playbackSettings={playbackSettings}
            onPlaybackSettingsChange={setPlaybackSettings}
          />
        )}
      </Suspense>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
      <Suspense fallback={<LoadingFallback />}>
        <InstallPrompt />
      </Suspense>
    </Router>
  );
};

export default App;
