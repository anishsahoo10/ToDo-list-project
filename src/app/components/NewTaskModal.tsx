import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Bell, FileText, Tag, Calendar } from 'lucide-react';
import type { Category, Task } from '../App';
import { formatDateForInput, createDateFromInputs } from '../utils/dateUtils';

interface NewTaskModalProps {
  categories: Category[];
  initialDate?: Date | null;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function NewTaskModal({ categories, initialDate, onClose, onAdd }: NewTaskModalProps) {
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [time, setTime] = useState('09:00');
  const [date, setDate] = useState(
    initialDate
      ? formatDateForInput(initialDate)
      : formatDateForInput(new Date())
  );
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) return;

    const dueDate = createDateFromInputs(date, time);

    onAdd({
      title: title.trim(),
      categoryId: selectedCategory,
      time,
      note: note.trim() || undefined,
      completed: false,
      dueDate,
    });

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] px-6 pt-6 pb-8 shadow-2xl"
        >
          {/* Decorative blob */}
          <motion.div
            initial={{ scale: 0, x: 100, y: -50 }}
            animate={{ scale: 1, x: 0, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl -z-10"
          />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-semibold text-gray-900"
            >
              New task
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Input field */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <label className="text-sm text-gray-500 mb-2 block">What are you planning?</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              autoFocus
              className="w-full text-lg font-medium text-gray-900 outline-none border-b-2 border-blue-500 pb-2 placeholder:text-gray-300"
            />
          </motion.div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full flex items-center gap-3 text-gray-600"
            >
              <Calendar className="w-5 h-5" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 text-gray-600 outline-none bg-transparent"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="w-full flex items-center gap-3 text-gray-600"
            >
              <Bell className="w-5 h-5" />
              <span className="flex-1">Time</span>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-sm text-gray-600 outline-none bg-transparent"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              type="button"
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="w-full flex items-center gap-3 text-left text-gray-400 hover:text-blue-500 transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Add note</span>
            </motion.button>

            {showNoteInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-8"
              >
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter note..."
                  rows={3}
                  className="w-full text-sm text-gray-600 outline-none border border-gray-200 rounded-xl p-3 placeholder:text-gray-300 resize-none focus:border-blue-500 transition-colors"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full flex items-center gap-3"
            >
              <Tag className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 text-gray-600 outline-none bg-transparent"
              >
                {categories.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Create button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full bg-blue-500 text-white font-semibold py-4 rounded-2xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Create
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}