import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { TaskItem } from './TaskItem';
import type { Category, Task } from '../App';
import { getToday, isBeforeDay, isSameDay, isAfterDay } from '../utils/dateUtils';

interface TaskListProps {
  category: Category;
  categories: Category[];
  tasks: Task[];
  onBack: () => void;
  onAddTask: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskList({ category, categories, tasks, onBack, onAddTask, onToggleTask, onDeleteTask, onEditTask }: TaskListProps) {
  const today = getToday();
  
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  
  // Further categorize incomplete tasks by date
  const lateTasks = incompleteTasks.filter(t => isBeforeDay(t.dueDate, today));
  const todayTasks = incompleteTasks.filter(t => isSameDay(t.dueDate, today));
  const upcomingTasks = incompleteTasks.filter(t => isAfterDay(t.dueDate, today));

  return (
    <div className="relative h-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
      {/* Decorative blob */}
      <motion.div
        initial={{ scale: 0, x: 100, y: -100 }}
        animate={{ scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-12 pb-6 text-white">
          <div className="flex items-center justify-between mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center shadow-lg`}>
              <div className="w-6 h-6 bg-white rounded-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-blue-100">{tasks.length} Tasks</p>
            </div>
          </motion.div>
        </div>

        {/* Tasks Container */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 bg-white rounded-t-[2.5rem] overflow-y-auto px-6 pt-8 pb-24"
        >
          <AnimatePresence mode="popLayout">
            {lateTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Late</h3>
                <div className="space-y-2">
                  {lateTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      categories={categories}
                      index={index}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                      isLate
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {todayTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Today</h3>
                <div className="space-y-2">
                  {todayTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      categories={categories}
                      index={index}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {upcomingTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Upcoming</h3>
                <div className="space-y-2">
                  {upcomingTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      categories={categories}
                      index={index}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {completedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Completed</h3>
                <div className="space-y-2">
                  {completedTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      categories={categories}
                      index={index}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={onEditTask}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">No tasks yet</p>
                <p className="text-gray-300 text-sm mt-1">Tap the + button to add a task</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Floating Add Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddTask}
          className="absolute bottom-8 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}