import { useState, useEffect, useRef } from 'react';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { useOnlineStatus } from '@/react-app/hooks/useOnlineStatus';
import { useToast } from '@/react-app/hooks/useToast';
import Toast from '@/react-app/components/Toast';

const TARGET_URL = 'https://inkrealm.info/tvc15';
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function MirrorViewer() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isOnline = useOnlineStatus();
  const { toasts, addToast } = useToast();

  const refreshContent = async () => {
    if (!isOnline) {
      addToast({
        type: 'error',
        message: 'Cannot refresh - no internet connection',
      });
      return;
    }

    setIsRefreshing(true);
    
    if (iframeRef.current) {
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = '';
      
      // Small delay to ensure the iframe clears
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentSrc;
        }
      }, 100);
    }

    setLastUpdate(new Date());
    
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        type: 'success',
        message: 'Content refreshed successfully',
      });
    }, 1000);
  };

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      refreshContent();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isOnline]);

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-[#0D0D0D] relative">
      {/* Header */}
      <header className="bg-[#0D0D0D] border-b border-[#E6A800]/20 px-4 py-3 flex items-center justify-between relative z-10">
        <h1 className="text-xl font-bold text-[#E6A800] font-mono tracking-wider">
          inkrealm
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Online Status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Last Update */}
          <div className="flex items-center gap-2 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-mono">
              {formatTime(lastUpdate)}
            </span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshContent}
            disabled={isRefreshing || !isOnline}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isOnline && !isRefreshing
                ? 'bg-[#E6A800] hover:bg-[#E6A800]/80 text-black'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative">
        {/* Iframe */}
        <iframe
          ref={iframeRef}
          src={TARGET_URL}
          className="w-full h-full border-none"
          title="inkrealm mirror"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        />

        {/* Offline Overlay */}
        {!isOnline && (
          <div className="absolute inset-0 bg-[#0D0D0D]/90 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <div className="text-center p-8 rounded-xl bg-[#0D0D0D]/80 border border-red-500/30 max-w-md mx-4">
              <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-2">No Internet Connection</h2>
              <p className="text-white/60 mb-4">
                Please check your internet connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Retry Connection
              </button>
            </div>
            
            {/* Static overlay effect */}
            <div className="absolute inset-0 mirror-static opacity-10"></div>
          </div>
        )}

        {/* Scanlines Effect */}
        <div className="absolute inset-0 mirror-scanlines pointer-events-none opacity-20"></div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>

      
    </div>
  );
}
