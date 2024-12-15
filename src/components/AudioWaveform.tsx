import { forwardRef, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { PlaybackSettings } from '../types/types';
import { Clock } from 'lucide-react';

interface AudioWaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSettings: PlaybackSettings;
  onTimeUpdate: (time: number) => void;
}

export const AudioWaveform = forwardRef<HTMLAudioElement, AudioWaveformProps>(({
  audioUrl,
  isPlaying,
  currentTime,
  playbackSettings,
  onTimeUpdate,
}, ref) => {
  const localRef = useRef<HTMLAudioElement>(null);
  const audioRef = (ref as React.RefObject<HTMLAudioElement>) || localRef;
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const durationRef = useRef<number>(0);

  // Format time in MM:SS format
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current) {
      // Cleanup previous instance
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }

      // Create audio element for better control
      const audio = audioRef.current || document.createElement('audio');
      audio.src = audioUrl;
      audio.controls = false;
      audio.autoplay = false;
      audio.preload = 'auto';

      // Create WaveSurfer instance
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#4f46e5',
        progressColor: '#818cf8',
        cursorColor: '#c7d2fe',
        barWidth: 1,
        barGap: 1,
        height: 24,
        normalize: true,
        backend: 'WebAudio',
        mediaControls: false,
        hideScrollbar: true,
        barRadius: 1,
        media: audio
      });

      // Handle ready state
      wavesurfer.current.on('ready', () => {
        if (wavesurfer.current) {
          durationRef.current = wavesurfer.current.getDuration();
          wavesurfer.current.setPlaybackRate(playbackSettings.speed);
          wavesurfer.current.setVolume(playbackSettings.volume);
        }
      });

      // Handle time updates
      wavesurfer.current.on('timeupdate', (currentTime) => {
        onTimeUpdate(currentTime);
      });

      // Load audio
      wavesurfer.current.load(audioUrl);
    }

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioUrl]);

  // Handle play/pause
  useEffect(() => {
    if (wavesurfer.current) {
      if (isPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle time update
  useEffect(() => {
    if (wavesurfer.current && Math.abs(wavesurfer.current.getCurrentTime() - currentTime) > 0.1) {
      wavesurfer.current.setTime(currentTime);
    }
  }, [currentTime]);

  // Handle playback settings
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setPlaybackRate(playbackSettings.speed);
      wavesurfer.current.setVolume(playbackSettings.volume);
    }
  }, [playbackSettings]);

  return (
    <div className="bg-gray-900/50 rounded-lg p-2 space-y-1 flex-shrink-0">
      {/* Time Display */}
      <div className="flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>{formatTime(currentTime)}</span>
        </div>
        <span>{formatTime(durationRef.current)}</span>
      </div>

      {/* Compact Waveform */}
      <div className="relative">
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
        />
        <div 
          ref={waveformRef}
          className="rounded-md overflow-hidden"
          style={{ maxWidth: '100%' }}
        />
      </div>
    </div>
  );
});
