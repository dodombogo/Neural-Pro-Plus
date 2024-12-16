import React, { useState, useRef, useEffect } from 'react';
import { Copy, Clock, Search, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptContainerProps {
  content: string;
  onContentChange: (content: string) => void;
  currentTime: number;
  onOpenFindReplace: () => void;
  onSavingStateChange: (isSaving: boolean) => void;
  isFindReplaceOpen?: boolean;
  projectId?: string;
}

export const TranscriptContainer: React.FC<TranscriptContainerProps> = ({
  content,
  onContentChange,
  currentTime,
  onOpenFindReplace,
  onSavingStateChange,
  isFindReplaceOpen = false,
  projectId
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const lastSavedContentRef = useRef<string>(content);

  // Initialize editor content and try to load from localStorage
  useEffect(() => {
    if (!editorRef.current) return;
    
    if (projectId) {
      const savedContent = localStorage.getItem(`transcript_${projectId}`);
      // Only update if the editor is empty or if there's new content from props
      if (editorRef.current.innerText.trim() === '' && savedContent) {
        editorRef.current.innerText = savedContent;
        onContentChange(savedContent);
        lastSavedContentRef.current = savedContent;
      } else if (content !== lastSavedContentRef.current) {
        editorRef.current.innerText = content;
        lastSavedContentRef.current = content;
      }
    } else if (content !== lastSavedContentRef.current) {
      editorRef.current.innerText = content;
      lastSavedContentRef.current = content;
    }
  }, [projectId]); // Only run when projectId changes

  // Auto-save cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
        // Save any pending changes before unmounting
        if (editorRef.current && projectId) {
          const currentContent = editorRef.current.innerText;
          if (currentContent !== lastSavedContentRef.current) {
            localStorage.setItem(`transcript_${projectId}`, currentContent);
            lastSavedContentRef.current = currentContent;
          }
        }
      }
    };
  }, [projectId]);

  const handleCopy = async () => {
    try {
      if (editorRef.current) {
        await navigator.clipboard.writeText(editorRef.current.innerText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    
    setIsSaving(true);
    onSavingStateChange(true);
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    const currentContent = editorRef.current.innerText;
    // Update parent immediately to keep state in sync
    onContentChange(currentContent);

    autoSaveTimeoutRef.current = setTimeout(() => {
      // Only save to localStorage if content has changed
      if (currentContent !== lastSavedContentRef.current && projectId) {
        localStorage.setItem(`transcript_${projectId}`, currentContent);
        lastSavedContentRef.current = currentContent;
      }
      
      setIsSaving(false);
      onSavingStateChange(false);
    }, 1000);
  };

  // Add paste event handler to preserve formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    if (isFindReplaceOpen) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Insert text at current cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger content change
      handleContentChange();
    } else {
      // Fallback if no selection
      document.execCommand('insertText', false, text);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gray-900 rounded-lg flex flex-col h-[calc(100vh-11rem)] shadow-xl border border-gray-800/50"
    >
      {/* Enhanced Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700 rounded-t-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenFindReplace()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Find & Replace</span>
          </motion.button>
          
          <div className="h-4 w-px bg-gray-700" /> {/* Divider */}
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{new Date(currentTime * 1000).toISOString().substr(11, 8)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSaving && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-400"
            >
              <Save className="w-4 h-4 animate-pulse" />
              <span>Saving...</span>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors relative"
          >
            <Copy className="w-4 h-4" />
            <span>{isCopied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4B5563 #1F2937'
        }}
      >
        <div
          ref={editorRef}
          contentEditable={!isFindReplaceOpen}
          onInput={!isFindReplaceOpen ? handleContentChange : undefined}
          onPaste={!isFindReplaceOpen ? handlePaste : undefined}
          suppressContentEditableWarning
          className="outline-none whitespace-pre-wrap text-gray-200 font-mono p-6 min-h-full text-[15px] leading-relaxed selection:bg-indigo-500/30"
        />
      </div>
    </motion.div>
  );
}; 