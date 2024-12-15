import { forwardRef, useEffect, useRef } from 'react';
import { PlaybackSettings } from '../types/types';

interface VideoPlayerProps {
  videoUrl: string;
  isPlaying: boolean;
  currentTime: number;
  playbackSettings: PlaybackSettings;
  onTimeUpdate: (time: number) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  videoUrl,
  isPlaying,
  currentTime,
  playbackSettings,
  onTimeUpdate,
}, ref) => {
  const localRef = useRef<HTMLVideoElement>(null);
  const videoRef = (ref as React.RefObject<HTMLVideoElement>) || localRef;
  const isInitialLoad = useRef(true);

  // Initialize video element
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Set initial properties
      video.preload = 'auto';
      video.playsInline = true;
      video.playbackRate = playbackSettings.speed;
      video.volume = playbackSettings.volume;

      // Add event listeners
      const handleLoadedMetadata = () => {
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
          video.currentTime = currentTime;
        }
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoUrl]);

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Video playback failed:", error);
          });
        }
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  // Handle time update
  useEffect(() => {
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - currentTime) > 0.1) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Handle playback settings
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackSettings.speed;
      video.volume = playbackSettings.volume;
    }
  }, [playbackSettings]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress bar */}
          <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500"
              style={{ 
                width: `${(currentTime / (videoRef.current?.duration || 1)) * 100}%`,
                transition: 'width 0.1s linear'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
});
