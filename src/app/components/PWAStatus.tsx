import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff } from 'lucide-react';

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
      // Auto-hide after 3 seconds
      setTimeout(() => setShowOfflineToast(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showOfflineToast && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-4 left-4 right-4 z-50"
        >
          <div className={`rounded-2xl shadow-lg p-4 flex items-center gap-3 ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-900 text-white'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5" />
                <div>
                  <p className="font-semibold">Back Online</p>
                  <p className="text-sm opacity-90">Your tasks are synced</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5" />
                <div>
                  <p className="font-semibold">You're Offline</p>
                  <p className="text-sm opacity-90">Changes saved locally</p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
