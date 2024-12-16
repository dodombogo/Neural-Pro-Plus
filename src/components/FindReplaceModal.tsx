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
  const editorRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef(content);

  // Update content reference when content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Get editor reference
  useEffect(() => {
    editorRef.current = document.querySelector('[contenteditable="true"]');
  }, [isOpen]);

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFindText('');
      setReplaceText('');
      setMatches([]);
      setCurrentMatch(-1);
      restoreOriginalContent();
    } else if (initialSearchText) {
      setFindText(initialSearchText);
    }
  }, [isOpen, initialSearchText]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [isOpen]);

  // Find matches and highlight them
  useEffect(() => {
    if (!findText || !editorRef.current) {
      setMatches([]);
      setCurrentMatch(-1);
      restoreOriginalContent();
      return;
    }

    try {
      // Find all matches
      const regex = new RegExp(findText, 'gi');
      const newMatches: number[] = [];
      let match;
      
      while ((match = regex.exec(contentRef.current)) !== null) {
        newMatches.push(match.index);
      }

      setMatches(newMatches);
      if (newMatches.length > 0) {
        // Keep current match if it's valid, otherwise reset to 0
        const nextMatch = currentMatch >= 0 && currentMatch < newMatches.length 
          ? currentMatch 
          : 0;
        setCurrentMatch(nextMatch);
        highlightMatches(newMatches, nextMatch);
        scrollToMatch(nextMatch);
      } else {
        setCurrentMatch(-1);
        restoreOriginalContent();
      }
    } catch (error) {
      console.error('Invalid regex:', error);
      setMatches([]);
      setCurrentMatch(-1);
      restoreOriginalContent();
    }
  }, [findText]);

  const highlightMatches = (matchIndexes: number[], currentIdx: number) => {
    if (!editorRef.current || !findText) return;

    let highlightedContent = contentRef.current;
    let offset = 0;

    matchIndexes.forEach((matchIndex, i) => {
      const isCurrentMatch = i === currentIdx;
      const beforeMatch = highlightedContent.slice(0, matchIndex + offset);
      const matchText = highlightedContent.slice(matchIndex + offset, matchIndex + offset + findText.length);
      const afterMatch = highlightedContent.slice(matchIndex + offset + findText.length);

      const highlightClass = isCurrentMatch 
        ? 'bg-indigo-500/50 text-white' 
        : 'bg-indigo-500/20 text-gray-200';
      const highlightedMatch = `<span class="match-highlight ${highlightClass} rounded px-0.5 transition-colors duration-150">${matchText}</span>`;

      highlightedContent = beforeMatch + highlightedMatch + afterMatch;
      offset += highlightedMatch.length - matchText.length;
    });

    editorRef.current.innerHTML = highlightedContent;
  };

  const restoreOriginalContent = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = contentRef.current;
    }
  };

  const handleReplace = () => {
    if (!findText || currentMatch === -1 || matches.length === 0) return;

    // Get the current match index
    const matchIndex = matches[currentMatch];

    // Create new content with the current match replaced
    const newContent = 
      contentRef.current.slice(0, matchIndex) + 
      replaceText + 
      contentRef.current.slice(matchIndex + findText.length);

    // Update content
    contentRef.current = newContent;
    onContentChange(newContent);

    // Find remaining matches
    const regex = new RegExp(findText, 'gi');
    const newMatches: number[] = [];
    let match;

    while ((match = regex.exec(newContent)) !== null) {
      newMatches.push(match.index);
    }

    // Update matches state
    setMatches(newMatches);
    
    if (newMatches.length > 0) {
      // If there are more matches, stay at current index or move to previous one
      const nextMatch = Math.min(currentMatch, newMatches.length - 1);
      setCurrentMatch(nextMatch);
      highlightMatches(newMatches, nextMatch);
      scrollToMatch(nextMatch);
    } else {
      // If no more matches, clear state and restore content
      setCurrentMatch(-1);
      restoreOriginalContent();
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;

    try {
      // Replace all occurrences at once
      const regex = new RegExp(findText, 'g');
      const newContent = contentRef.current.replace(regex, replaceText);

      // Update content
      contentRef.current = newContent;
      onContentChange(newContent);
      
      // Clear state and close modal
      setMatches([]);
      setCurrentMatch(-1);
      restoreOriginalContent();
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
    highlightMatches(matches, newCurrentMatch);
    scrollToMatch(newCurrentMatch);
  };

  const scrollToMatch = (matchIndex: number) => {
    if (!editorRef.current) return;

    const highlights = Array.from(editorRef.current.querySelectorAll('.match-highlight'));
    const currentHighlight = highlights[matchIndex];

    if (currentHighlight) {
      const container = editorRef.current.parentElement;
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        navigateMatch('prev');
      } else if (e.ctrlKey || e.metaKey) {
        handleReplace();
      } else {
        navigateMatch('next');
      }
    } else if (e.key === 'Escape') {
      onClose();
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
                onKeyDown={handleKeyDown}
                placeholder="Find... (Enter to navigate, Ctrl+Enter to replace)"
                className="flex-1 bg-gray-700/50 text-white px-2 py-1 rounded text-sm"
              />
              <span className="text-xs text-gray-400 min-w-[40px] text-center">
                {matches.length > 0 ? `${currentMatch + 1}/${matches.length}` : '0/0'}
              </span>
              <button
                onClick={() => navigateMatch('prev')}
                disabled={matches.length === 0}
                className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                title="Previous match (Shift+Enter)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigateMatch('next')}
                disabled={matches.length === 0}
                className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                title="Next match (Enter)"
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
              onKeyDown={handleKeyDown}
              placeholder="Replace with... (Ctrl+Enter to replace current match)"
              className="w-full bg-gray-700/50 text-white px-2 py-1 rounded text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={handleReplace}
              disabled={matches.length === 0}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs transition-colors disabled:opacity-50"
              title="Replace current match (Ctrl+Enter)"
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
