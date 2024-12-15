import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { useAutoSaveStore } from '../store/autoSaveStore';
import { TranscriptionResponse } from '../services/assemblyAI';
import { TranscriptFormatType } from '../types/transcriptFormats';
import { formatTranscript } from '../utils/transcriptFormatter';
import { TranscriptFormatSelector } from './TranscriptFormatSelector';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TranscriptionDisplayProps {
  initialContent: string | TranscriptionResponse;
  onContentChange: (content: string) => void;
}

const EDITOR_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ]
};

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  initialContent,
  onContentChange
}) => {
  const [selectedFormat, setSelectedFormat] = useState<TranscriptFormatType>('iScribe+');
  const [editorContent, setEditorContent] = useState('');
  const setLastSaved = useAutoSaveStore(state => state.setLastSaved);

  useEffect(() => {
    if (typeof initialContent === 'string') {
      setEditorContent(initialContent);
    } else if (initialContent?.utterances) {
      const formattedContent = formatTranscript(initialContent.utterances, selectedFormat);
      setEditorContent(formattedContent);
    }
  }, [initialContent, selectedFormat]);

  const handleFormatChange = (format: TranscriptFormatType) => {
    setSelectedFormat(format);
    if (typeof initialContent !== 'string' && initialContent?.utterances) {
      const formattedContent = formatTranscript(initialContent.utterances, format);
      setEditorContent(formattedContent);
      onContentChange(formattedContent);
    }
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onContentChange(content);
    setLastSaved(new Date());
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editorContent);
      // You might want to add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {typeof initialContent !== 'string' && initialContent?.utterances && (
        <TranscriptFormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />
      )}
      
      <div className="relative">
        <button
          onClick={handleCopyToClipboard}
          className="absolute top-2 right-2 p-2 rounded-lg hover:bg-gray-100"
          title="Copy to clipboard"
        >
          <Copy className="w-5 h-5" />
        </button>
        
        <ReactQuill
          value={editorContent}
          onChange={handleEditorChange}
          modules={EDITOR_MODULES}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};
