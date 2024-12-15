import { Dialog } from '@headlessui/react';
import { X, Settings } from 'lucide-react';
import { useShortcutsStore } from '../store/shortcutsStore';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const KeyboardShortcutsModal = ({ isOpen, onClose, onOpenSettings }: KeyboardShortcutsModalProps) => {
  const shortcuts = useShortcutsStore(state => state.shortcuts);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-gray-900 rounded-xl shadow-2xl">
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-xl font-semibold text-gray-200">
                Keyboard Shortcuts
              </Dialog.Title>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-gray-200"
                  title="Customize shortcuts"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
              >
                <span className="text-gray-300">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg font-mono text-sm">
                  {shortcut.currentKeys}
                </kbd>
              </div>
            ))}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
