import React, { useState, useRef, useEffect } from 'react';
import { Copy, Clock, Search, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptContainerProps {
  content: string;
  onContentChange: (content: string) => void;
  currentTime: number;
  onOpenFindReplace: () => void;
  onSavingStateChange: (isSaving: boolean) => void;
}

export const TranscriptContainer: React.FC<TranscriptContainerProps> = ({
  content,
  onContentChange,
  currentTime,
  onOpenFindReplace,
  onSavingStateChange
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerText) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  // Auto-save cleanup
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

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
    
    // Store current selection
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
    const startOffset = range?.startOffset;
    const endOffset = range?.endOffset;
    
    setIsSaving(true);
    onSavingStateChange(true);
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (!editorRef.current) return;
      const content = editorRef.current.innerText || '';
      onContentChange(content);
      
      // Restore selection after content change
      if (selection && range && startOffset !== undefined && endOffset !== undefined && editorRef.current) {
        const newRange = document.createRange();
        const targetNode = editorRef.current.firstChild || editorRef.current;
        if (targetNode) {
          newRange.setStart(targetNode, startOffset);
          newRange.setEnd(targetNode, endOffset);
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
      
      setIsSaving(false);
      onSavingStateChange(false);
    }, 1000);
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
          contentEditable
          suppressContentEditableWarning
          className="outline-none whitespace-pre-wrap text-gray-200 font-mono p-6 min-h-full text-[15px] leading-relaxed selection:bg-indigo-500/30"
          onInput={handleContentChange}
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
          }}
        />
      </div>
    </motion.div>
  );
}; 