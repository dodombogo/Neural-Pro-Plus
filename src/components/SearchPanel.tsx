import { Search, ChevronUp, ChevronDown } from 'lucide-react';

interface SearchPanelProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  currentMatchIndex: number;
  totalMatches: number;
  onNextMatch: () => void;
  onPrevMatch: () => void;
}

export const SearchPanel = ({
  searchTerm,
  onSearchChange,
  currentMatchIndex,
  totalMatches,
  onNextMatch,
  onPrevMatch
}: SearchPanelProps) => {
  return (
    <div className="gradient-border">
      <div className="p-4 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in transcription..."
            className="w-full pl-10 pr-32 input-primary"
          />
          
          {searchTerm && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {totalMatches > 0 && (
                <span className="text-sm text-gray-400">
                  {currentMatchIndex + 1} of {totalMatches}
                </span>
              )}
              <div className="flex gap-1">
                <button
                  onClick={onPrevMatch}
                  disabled={totalMatches === 0}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                  title="Previous match"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={onNextMatch}
                  disabled={totalMatches === 0}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50 disabled:hover:bg-transparent"
                  title="Next match"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
