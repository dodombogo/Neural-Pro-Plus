import { Play, Pause, RotateCcw, Loader2 } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  fileName: string;
  isTranscribing?: boolean;
  transcriptionProgress?: string;
}

export const ControlPanel = ({
  isPlaying,
  onPlayPause,
  onReset,
  fileName,
  isTranscribing = false,
  transcriptionProgress = ''
}: ControlPanelProps) => {
  return (
    <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onPlayPause}
            className="p-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onReset}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            title="Reset to beginning"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-300 truncate max-w-[300px]">
          {fileName}
        </div>
      </div>

      {/* Transcription Status */}
      {isTranscribing && (
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <Loader2 className="w-3 h-3 animate-spin text-indigo-500" />
          <span>{transcriptionProgress}</span>
        </div>
      )}
    </div>
  );
};
