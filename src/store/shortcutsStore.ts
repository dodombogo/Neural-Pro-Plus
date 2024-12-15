import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KeyboardShortcut } from '../types/types';

interface ShortcutsState {
  shortcuts: KeyboardShortcut[];
  updateShortcut: (id: string, newKeys: string) => void;
  resetToDefault: (id: string) => void;
  resetAllToDefault: () => void;
}

const defaultShortcuts: KeyboardShortcut[] = [
  { id: 'playPause', description: 'Play/Pause/Seek 1s', defaultKeys: 'Escape', currentKeys: 'Escape' },
  { id: 'seekBackward5', description: 'Seek backward 5 seconds', defaultKeys: 'F1', currentKeys: 'F1' },
  { id: 'seekForward5', description: 'Seek forward 5 seconds', defaultKeys: 'F2', currentKeys: 'F2' },
  { id: 'cycleSpeed', description: 'Change playback speed', defaultKeys: 'F3', currentKeys: 'F3' },
  { id: 'export', description: 'Export options', defaultKeys: 'F4', currentKeys: 'F4' },
  { id: 'findReplace', description: 'Find and replace', defaultKeys: 'Control+F', currentKeys: 'Control+F' },
  { id: 'insertTimestamp', description: 'Insert timestamp', defaultKeys: 'F8', currentKeys: 'F8' },
];

export const useShortcutsStore = create<ShortcutsState>()(
  persist(
    (set) => ({
      shortcuts: defaultShortcuts,
      updateShortcut: (id, newKeys) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.id === id ? { ...s, currentKeys: newKeys } : s
          ),
        })),
      resetToDefault: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.map((s) =>
            s.id === id ? { ...s, currentKeys: s.defaultKeys } : s
          ),
        })),
      resetAllToDefault: () =>
        set({
          shortcuts: defaultShortcuts,
        }),
    }),
    {
      name: 'shortcuts-storage',
    }
  )
);
