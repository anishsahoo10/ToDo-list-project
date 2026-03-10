import { motion } from 'motion/react';
import { Clipboard, Briefcase, Headphones, Plane, Book, Home } from 'lucide-react';
import type { Category } from '../App';

interface CategoryCardProps {
  category: Category;
  taskCount: number;
  index: number;
  onClick: () => void;
}

const iconMap = {
  clipboard: Clipboard,
  briefcase: Briefcase,
  headphones: Headphones,
  plane: Plane,
  book: Book,
  home: Home,
};

export function CategoryCard({ category, taskCount, index, onClick }: CategoryCardProps) {
  const Icon = iconMap[category.icon as keyof typeof iconMap];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all text-left overflow-hidden group"
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
        <p className="text-sm text-gray-500">{taskCount} Tasks</p>
      </div>
    </motion.button>
  );
}
