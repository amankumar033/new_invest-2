import React, { useState, useRef, useEffect } from 'react';

const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/[?&]v=([^&#]+)/) || url.match(/youtu\.be\/([^?&#]+)/);
  return match ? match[1] : '';
};

const VideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const playerInstanceRef = useRef(null);
  const [playerId] = useState(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Load the YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => setApiLoaded(true);
    } else {
      setApiLoaded(true);
    }
  }, []);

  // Initialize the player only when playing and API is loaded
  useEffect(() => {
    if (!videoUrl || !isPlaying || !apiLoaded) return;
    let isMounted = true;
    const playerContainer = document.getElementById(playerId);
    if (!playerContainer) return;

    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
      playerInstanceRef.current = null;
    }

    playerInstanceRef.current = new window.YT.Player(playerId, {
      videoId: extractYouTubeId(videoUrl),
      height: '100%',
      width: '100%',
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        start: Math.floor(currentTime),
        origin: window.location.origin
      },
      events: {
        onReady: (event) => {
          if (!isMounted) return;
          setIsReady(true);
          event.target.playVideo();
        },
        onStateChange: (event) => {
          if (!isMounted) return;
          if (event.data === window.YT.PlayerState.PAUSED) {
            setCurrentTime(event.target.getCurrentTime());
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          }
        },
        onError: (event) => {
          setIsReady(false);
        }
      }
    });

    return () => {
      isMounted = false;
      if (playerInstanceRef.current) {
        try {
          playerInstanceRef.current.destroy();
        } catch {}
        playerInstanceRef.current = null;
      }
    };
  }, [videoUrl, isPlaying, apiLoaded, playerId, currentTime]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (playerInstanceRef.current && isReady) {
      playerInstanceRef.current.pauseVideo();
      setCurrentTime(playerInstanceRef.current.getCurrentTime());
      setIsPlaying(false);
    }
  };

  const videoId = extractYouTubeId(videoUrl);

  return (
    <div className="flex justify-center items-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-[640px] aspect-video bg-[#1D1A1B] shadow-lg relative rounded-lg overflow-hidden">
        {!isPlaying ? (
          <div
            className="w-full h-full bg-cover bg-center cursor-pointer relative"
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg), url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`
            }}
            onClick={handlePlay}
          >
            <div className="absolute inset-0 flex items-center justify-center transition hover:bg-black/40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          <>
            <div id={playerId} className="w-full h-full absolute inset-0" />
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={handlePause}
            >
              <div className="absolute top-4 right-4 bg-black/60 p-2 rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
