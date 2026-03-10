import { motion } from 'motion/react';
import { List, Calendar as CalendarIcon } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onViewChange: (view: 'lists' | 'calendar') => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const isListsActive = currentView === 'lists' || currentView === 'category';
  const isCalendarActive = currentView === 'calendar' || currentView === 'day';

  return (
    <div className="relative bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        <button
          onClick={() => onViewChange('lists')}
          className="relative flex flex-col items-center gap-1 py-2 px-6"
        >
          <div className={`transition-colors ${isListsActive ? 'text-blue-500' : 'text-gray-400'}`}>
            <List className="w-6 h-6" />
          </div>
          <span className={`text-xs font-medium transition-colors ${isListsActive ? 'text-blue-500' : 'text-gray-400'}`}>
            Lists
          </span>
          {isListsActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>

        <button
          onClick={() => onViewChange('calendar')}
          className="relative flex flex-col items-center gap-1 py-2 px-6"
        >
          <div className={`transition-colors ${isCalendarActive ? 'text-blue-500' : 'text-gray-400'}`}>
            <CalendarIcon className="w-6 h-6" />
          </div>
          <span className={`text-xs font-medium transition-colors ${isCalendarActive ? 'text-blue-500' : 'text-gray-400'}`}>
            Calendar
          </span>
          {isCalendarActive && (
            <motion.div
              layoutId="activeTab"
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}
