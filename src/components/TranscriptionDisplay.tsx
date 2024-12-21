<<<<<<< HEAD
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAutoSaveStore } from '../store/autoSaveStore';
import { TranscriptionResponse } from '../services/assemblyAI';
import { TranscriptFormatType } from '../types/transcriptFormats';
import { formatTranscript } from '../utils/transcriptFormatter';
import { TranscriptFormatSelector } from './TranscriptFormatSelector';
import { TranscriptContainer } from './TranscriptContainer';
=======
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTranscript } from '../utils/transcriptFormatter';
import { TranscriptFormatType } from '../types/transcriptFormats';
import { TranscriptionResponse } from '../services/assemblyAI';
>>>>>>> cf69f46481a40b87851377090054e2d5604f9b56

interface TranscriptionDisplayProps {
  transcriptionResult: TranscriptionResponse;
  onContentChange: (content: string) => void;
  transcriptFormat: TranscriptFormatType;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptionResult,
  onContentChange,
  transcriptFormat
}) => {
<<<<<<< HEAD
  const [selectedFormat, setSelectedFormat] = useState<TranscriptFormatType>('iScribe+');
  const [formattedContent, setFormattedContent] = useState('');
  const setLastSaved = useAutoSaveStore(state => state.setLastSaved);
=======
  const [formattedTranscript, setFormattedTranscript] = useState('');
>>>>>>> cf69f46481a40b87851377090054e2d5604f9b56

  // Memoize the content formatting
  const formatContent = useCallback((content: string | TranscriptionResponse, format: TranscriptFormatType) => {
    if (typeof content === 'string') {
      return content;
    } else if (content?.utterances) {
      return formatTranscript(content.utterances, format);
    }
    return '';
  }, []);

  // Update content when initialContent or format changes
  useEffect(() => {
<<<<<<< HEAD
    const newContent = formatContent(initialContent, selectedFormat);
    if (newContent !== formattedContent) {
      setFormattedContent(newContent);
      onContentChange(newContent);
    }
  }, [initialContent, selectedFormat, formatContent, onContentChange]);

  const handleFormatChange = useCallback((format: TranscriptFormatType) => {
    setSelectedFormat(format);
  }, []);

  // Memoize the format selector to prevent unnecessary re-renders
  const formatSelector = useMemo(() => {
    if (typeof initialContent !== 'string' && initialContent?.utterances) {
      return (
        <TranscriptFormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />
      );
    }
    return null;
  }, [initialContent, selectedFormat, handleFormatChange]);

  return (
    <div className="flex flex-col gap-4">
      {formatSelector}
      <TranscriptContainer
        content={formattedContent}
        onContentChange={onContentChange}
        currentTime={0}
      />
    </div>
=======
    if (transcriptionResult.utterances) {
      const formatted = formatTranscript(transcriptionResult.utterances, transcriptFormat);
      setFormattedTranscript(formatted);
      onContentChange(formatted);
    } else {
      setFormattedTranscript(transcriptionResult.text);
      onContentChange(transcriptionResult.text);
    }
  }, [transcriptionResult, transcriptFormat]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="whitespace-pre-wrap text-gray-200 font-mono"
    >
      {formattedTranscript}
    </motion.div>
>>>>>>> cf69f46481a40b87851377090054e2d5604f9b56
  );
};
