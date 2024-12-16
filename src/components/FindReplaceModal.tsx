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

  // Clear fields when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setFindText('');
      setReplaceText('');
      setMatches([]);
      setCurrentMatch(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialSearchText) {
      setFindText(initialSearchText);
    }
  }, [isOpen, initialSearchText]);

  useEffect(() => {
    if (isOpen && findInputRef.current) {
      findInputRef.current.focus();
      findInputRef.current.select();
    }
  }, [isOpen]);

  useEffect(() => {
    if (findText) {
      const regex = new RegExp(findText, 'gi');
      const newMatches: number[] = [];
      let match;
      while ((match = regex.exec(content)) !== null) {
        newMatches.push(match.index);
      }
      setMatches(newMatches);
      setCurrentMatch(newMatches.length > 0 ? 0 : -1);

      // Highlight all matches without modifying the content
      const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (textArea) {
        // Store original content
        const originalContent = content;
        
        // Remove existing highlights
        const existingHighlights = textArea.querySelectorAll('.match-highlight');
        existingHighlights.forEach(highlight => {
          const parent = highlight.parentNode;
          if (parent) {
            parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
          }
        });

        // Create a document fragment for the new content
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        // Add highlights for all matches
        newMatches.forEach((matchIndex, index) => {
          // Add text before the match
          if (matchIndex > lastIndex) {
            fragment.appendChild(document.createTextNode(originalContent.substring(lastIndex, matchIndex)));
          }

          // Add the highlighted match
          const matchText = originalContent.substr(matchIndex, findText.length);
          const highlightSpan = document.createElement('span');
          highlightSpan.textContent = matchText;
          highlightSpan.className = `match-highlight ${index === currentMatch ? 'bg-indigo-500/30' : 'bg-indigo-500/20'} rounded px-0.5`;
          fragment.appendChild(highlightSpan);

          lastIndex = matchIndex + findText.length;
        });

        // Add any remaining text
        if (lastIndex < originalContent.length) {
          fragment.appendChild(document.createTextNode(originalContent.substring(lastIndex)));
        }

        // Update the content area
        textArea.innerHTML = '';
        textArea.appendChild(fragment);
      }
    } else {
      setMatches([]);
      setCurrentMatch(-1);
      
      // Remove all highlights when search text is empty
      const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
      if (textArea) {
        textArea.innerText = content;
      }
    }
  }, [findText, content, currentMatch]);

  const handleFindInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFindText(e.target.value);
  };

  const handleReplaceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setReplaceText(e.target.value);
  };

  const handleReplace = () => {
    if (!findText) return;
    
    const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!textArea) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const currentMatchText = range.toString();

    if (currentMatchText === findText) {
      const replacementNode = document.createTextNode(replaceText);
      range.deleteContents();
      range.insertNode(replacementNode);
      
      // Update content without adding line breaks
      const newContent = textArea.innerText;
      onContentChange(newContent);
      
      // Move to next match if available
      const remainingMatches = matches.filter((_, index) => index > currentMatch);
      if (remainingMatches.length > 0) {
        navigateMatch('next');
      } else {
        setFindText('');
        setReplaceText('');
        onClose();
      }
    }
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    
    const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (!textArea) return;

    // Create a temporary div to handle the replacement
    const tempDiv = document.createElement('div');
    tempDiv.innerText = content;
    const newContent = tempDiv.innerText.replace(new RegExp(findText, 'g'), replaceText);
    
    onContentChange(newContent);
    setFindText('');
    setReplaceText('');
    onClose();
  };

  const navigateMatch = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return;
    
    // Update current match index
    const newCurrentMatch = direction === 'next' 
      ? (currentMatch + 1) % matches.length
      : (currentMatch - 1 + matches.length) % matches.length;
    setCurrentMatch(newCurrentMatch);

    // Update highlight styles for all matches
    const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
    if (textArea) {
      const highlights = textArea.querySelectorAll('.match-highlight');
      highlights.forEach((highlight, index) => {
        if (index === newCurrentMatch) {
          highlight.classList.add('bg-indigo-500/30');
          highlight.classList.remove('bg-indigo-500/20');
          highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          highlight.classList.add('bg-indigo-500/20');
          highlight.classList.remove('bg-indigo-500/30');
        }
      });
    }
  };

  // Remove the effect that was causing the issue
  useEffect(() => {
    if (findText && matches.length > 0) {
      navigateMatch('next');
    }
  }, [matches.length]);

  if (!isOpen) return null;

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
            onClick={() => {
              // Remove any existing highlights before closing
              const textArea = document.querySelector('[contenteditable="true"]') as HTMLElement;
              if (textArea) {
                const existingHighlights = textArea.querySelectorAll('.current-match');
                existingHighlights.forEach(highlight => {
                  const parent = highlight.parentNode;
                  if (parent) {
                    parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
                  }
                });
              }
              onClose();
            }}
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
                onChange={handleFindInputChange}
                onKeyDown={(e) => e.stopPropagation()}
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
              onChange={handleReplaceInputChange}
              onKeyDown={(e) => e.stopPropagation()}
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
