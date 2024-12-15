import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, HelpCircle, FileText, Home, Github, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  onHelpClick: () => void;
  onSettingsClick: () => void;
}

export const Header = ({ onMobileMenuToggle, onHelpClick, onSettingsClick }: HeaderProps) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FileText },
  ];

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-200 ${
        isScrolled ? 'bg-gray-900/95 shadow-lg backdrop-blur-lg' : 'bg-gray-900/50 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo size={32} />
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent hidden sm:block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Neural Pro+
            </motion.h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'text-cyan-400 bg-cyan-500/10' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Settings Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSettingsClick}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700/50 shadow-lg"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              Settings
            </motion.button>

            {/* Help Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onHelpClick}
              className="hidden md:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700/50 shadow-lg"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Help
            </motion.button>

            {/* GitHub Link */}
            <a
              href="https://github.com/oNeural/Neural-Pro-Plus"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={onMobileMenuToggle}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
