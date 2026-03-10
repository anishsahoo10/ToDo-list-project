import { motion } from 'motion/react';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { EditTaskModal } from './EditTaskModal';
import type { Task, Category } from '../App';
import { getToday, isBeforeDay } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  categories: Category[];
  index: number;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  isLate?: boolean;
}

export function TaskItem({ task, categories, index, onToggle, onDelete, onEdit, isLate: isLateProps }: TaskItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate if task is late (past due date)
  const isLate = isLateProps || (!task.completed && isBeforeDay(task.dueDate, getToday()));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      drag="x"
      dragConstraints={{ left: -80, right: 0 }}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        if (info.offset.x < -50) {
          onDelete(task.id);
        }
      }}
      className="relative"
    >
      {/* Delete background */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 rounded-2xl flex items-center justify-center">
        <Trash2 className="w-5 h-5 text-white" />
      </div>

      {/* Task card */}
      <motion.div
        animate={{ x: isDragging ? -80 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
      >
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task.id);
          }}
          className="flex-shrink-0 w-6 h-6 rounded-lg border-2 border-gray-300 flex items-center justify-center transition-all hover:border-blue-500"
        >
          <motion.div
            initial={false}
            animate={{
              scale: task.completed ? 1 : 0,
              backgroundColor: task.completed ? '#3B82F6' : '#FFFFFF',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-full h-full rounded-md flex items-center justify-center"
          >
            {task.completed && (
              <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  d="M3 8L6.5 11.5L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.div>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0" onClick={() => setShowEditModal(true)} role="button" tabIndex={0}>
          <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'} transition-all`}>
            {task.title}
          </h4>
          <p className={`text-sm mt-0.5 ${isLate ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
            {task.time}
            {isLate && ` · ${task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
          </p>
          {task.note && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.note}</p>
          )}
        </div>

        {/* Category indicator */}
        {categories.find(c => c.id === task.categoryId) && (
          <div className="flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${categories.find(c => c.id === task.categoryId)?.color}`} />
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditTaskModal
          task={task}
          categories={categories.filter(c => c.id !== 'all')}
          onClose={() => setShowEditModal(false)}
          onSave={onEdit}
        />
      )}
    </motion.div>
  );
}