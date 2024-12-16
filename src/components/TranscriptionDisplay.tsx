import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatTranscript } from '../utils/transcriptFormatter';
import { TranscriptFormatType } from '../types/transcriptFormats';
import { TranscriptionResult } from '../types/types';

interface TranscriptionDisplayProps {
  transcriptionResult: TranscriptionResult;
  onContentChange: (content: string) => void;
  transcriptFormat: TranscriptFormatType;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcriptionResult,
  onContentChange,
  transcriptFormat
}) => {
  const [formattedTranscript, setFormattedTranscript] = useState('');

  useEffect(() => {
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
  );
};
