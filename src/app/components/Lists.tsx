import { motion } from 'motion/react';
import { Menu, Plus } from 'lucide-react';
import { CategoryCard } from './CategoryCard';
import type { Category, Task } from '../App';

interface ListsProps {
  categories: Category[];
  tasks: Task[];
  onSelectCategory: (categoryId: string) => void;
  onAddTask: () => void;
}

export function Lists({ categories, tasks, onSelectCategory, onAddTask }: ListsProps) {
  const getTaskCount = (categoryId: string) => {
    if (categoryId === 'all') return tasks.length;
    return tasks.filter(t => t.categoryId === categoryId).length;
  };

  return (
    <div className="relative h-full overflow-hidden">
      {/* Decorative background blob */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-6"
          >
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              
            </button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-gray-900"
          >
            Lists
          </motion.h1>
        </div>

        {/* Categories Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-24">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                taskCount={getTaskCount(category.id)}
                index={index}
                onClick={() => onSelectCategory(category.id)}
              />
            ))}
          </div>
        </div>

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