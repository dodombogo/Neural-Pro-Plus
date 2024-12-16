import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowUp, ArrowDown, X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface FindReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (content: string) => void;
  initialSearchText?: string;
}

export const FindReplaceModal: React.FC<FindReplaceModalProps> = ({
  isOpen,
  onClose,
  content,
  onContentChange,
  initialSearchText = ''
}) => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [currentMatch, setCurrentMatch] = useState(-1);
  const findInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef(content);

  // Update content ref when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Clear fields when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFindText('');
      setReplaceText('');
      setMatches([]);
      setCurrentMatch(-1);
      
      // Clean up any highlights in the editor
      const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (textArea) {
        textArea.innerHTML = contentRef.current;
      }
    }
  }, [isOpen]);

  // Set initial search text if provided
  useEffect(() => {
    if (isOpen && initialSearchText) {
      setFindText(initialSearchText);
    }
  }, [isOpen, initialSearchText]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [isOpen]);

  // Handle find text changes and highlighting
  useEffect(() => {
    if (!findText) {
      setMatches([]);
      setCurrentMatch(-1);
      const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (textArea) {
        textArea.innerHTML = contentRef.current;
      }
      return;
    }

    try {
      const regex = new RegExp(findText, 'gi');
      const newMatches: number[] = [];
      let match;
      let tempContent = contentRef.current;

      // Find all matches
      while ((match = regex.exec(tempContent)) !== null) {
        newMatches.push(match.index);
      }

      setMatches(newMatches);
      setCurrentMatch(newMatches.length > 0 ? 0 : -1);

      // Highlight matches in the editor
      const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (textArea) {
        let highlightedContent = tempContent;
        let offset = 0;

        newMatches.forEach((matchIndex, i) => {
          const isCurrentMatch = i === currentMatch;
          const beforeMatch = highlightedContent.slice(0, matchIndex + offset);
          const matchText = highlightedContent.slice(matchIndex + offset, matchIndex + offset + findText.length);
          const afterMatch = highlightedContent.slice(matchIndex + offset + findText.length);
          
          const highlightClass = isCurrentMatch ? 'bg-indigo-500/30' : 'bg-indigo-500/20';
          const highlightedMatch = `<span class="match-highlight ${highlightClass}">${matchText}</span>`;
          
          highlightedContent = beforeMatch + highlightedMatch + afterMatch;
          offset += highlightedMatch.length - matchText.length;
        });

        textArea.innerHTML = highlightedContent;
      }
    } catch (error) {
      // Handle invalid regex
      console.error('Invalid regex:', error);
    }
  }, [findText, currentMatch]);

  const handleReplace = () => {
    if (!findText || currentMatch === -1 || matches.length === 0) return;

    const matchIndex = matches[currentMatch];
    const beforeReplace = contentRef.current.slice(0, matchIndex);
    const afterReplace = contentRef.current.slice(matchIndex + findText.length);
    const newContent = beforeReplace + replaceText + afterReplace;

    // Update content
    contentRef.current = newContent;
    onContentChange(newContent);

    // Update matches
    const regex = new RegExp(findText, 'gi');
    const newMatches: number[] = [];
    let match;
    while ((match = regex.exec(newContent)) !== null) {
      newMatches.push(match.index);
    }

    setMatches(newMatches);
    if (newMatches.length > 0) {
      // Stay at current index or move to previous one if at the end
      setCurrentMatch(Math.min(currentMatch, newMatches.length - 1));
    } else {
      setCurrentMatch(-1);
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;

    try {
      const regex = new RegExp(findText, 'g');
      const newContent = contentRef.current.replace(regex, replaceText);
      
      // Update content
      contentRef.current = newContent;
      onContentChange(newContent);

      // Clear matches and close modal
      setMatches([]);
      setCurrentMatch(-1);
      onClose();
    } catch (error) {
      console.error('Error in replace all:', error);
    }
  };

  const navigateMatch = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return;

    const newCurrentMatch = direction === 'next'
      ? (currentMatch + 1) % matches.length
      : (currentMatch - 1 + matches.length) % matches.length;

    setCurrentMatch(newCurrentMatch);

    // Ensure the new match is visible
    const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (textArea) {
      const highlights = Array.from(textArea.querySelectorAll('.match-highlight'));
      const currentHighlight = highlights[newCurrentMatch];
      
      if (currentHighlight) {
        const container = textArea.parentElement;
        if (container) {
          const highlightRect = currentHighlight.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          if (highlightRect.top < containerRect.top || highlightRect.bottom > containerRect.bottom) {
            currentHighlight.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="absolute bottom-20 right-6 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-700 w-[400px] pointer-events-auto"
      >
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            <h2 className="text-sm font-medium text-gray-200">Find & Replace</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Find */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                ref={findInputRef}
                type="text"
                value={findText}
                onChange={(e) => setFindText(e.target.value)}
                placeholder="Find..."
                className="flex-1 bg-gray-700/50 text-white px-2 py-1 rounded text-sm"
              />
              <span className="text-xs text-gray-400 min-w-[40px] text-center">
                {matches.length > 0 ? `${currentMatch + 1}/${matches.length}` : '0/0'}
              </span>
              <button
                onClick={() => navigateMatch('prev')}
                disabled={matches.length === 0}
                className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigateMatch('next')}
                disabled={matches.length === 0}
                className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Replace */}
          <div className="space-y-1.5">
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with..."
              className="w-full bg-gray-700/50 text-white px-2 py-1 rounded text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={handleReplace}
              disabled={matches.length === 0}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition-colors disabled:opacity-50"
            >
              Replace
            </button>
            <button
              onClick={handleReplaceAll}
              disabled={matches.length === 0}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition-colors disabled:opacity-50"
            >
              Replace All
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
