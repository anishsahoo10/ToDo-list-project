import { useState, useEffect } from 'react';
import { Lists } from './components/Lists';
import { TaskList } from './components/TaskList';
import { Calendar } from './components/Calendar';
import { DayView } from './components/DayView';
import { NewTaskModal } from './components/NewTaskModal';
import { BottomNav } from './components/BottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { PWAStatus } from './components/PWAStatus';
import { loadTasks, saveTasks } from './utils/storage';
import { isSameDay } from './utils/dateUtils';

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  time: string;
  note?: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'lists' | 'category' | 'calendar' | 'day'>('lists');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories] = useState<Category[]>([
    { id: 'all', name: 'All', icon: 'clipboard', color: 'bg-blue-500' },
    { id: 'work', name: 'Work', icon: 'briefcase', color: 'bg-orange-500' },
    { id: 'music', name: 'Music', icon: 'headphones', color: 'bg-orange-400' },
    { id: 'travel', name: 'Travel', icon: 'plane', color: 'bg-green-500' },
    { id: 'study', name: 'Study', icon: 'book', color: 'bg-purple-500' },
    { id: 'home', name: 'Home', icon: 'home', color: 'bg-red-500' },
  ]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('todo_tasks_v2')) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('category');
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentView('day');
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-hidden">
          {currentView === 'lists' ? (
            <Lists
              categories={categories}
              tasks={tasks}
              onSelectCategory={handleSelectCategory}
              onAddTask={() => setShowNewTask(true)}
            />
          ) : currentView === 'calendar' ? (
            <Calendar
              tasks={tasks}
              onSelectDate={handleSelectDate}
              onAddTask={() => setShowNewTask(true)}
            />
          ) : currentView === 'day' ? (
            <DayView
              date={selectedDate!}
              tasks={tasks.filter(t => isSameDay(t.dueDate, selectedDate!))}
              categories={categories}
              onBack={() => setCurrentView('calendar')}
              onAddTask={() => setShowNewTask(true)}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          ) : (
            <TaskList
              category={categories.find(c => c.id === selectedCategory)!}
              categories={categories}
              tasks={tasks.filter(t =>
                selectedCategory === 'all' ? true : t.categoryId === selectedCategory
              )}
              onBack={() => setCurrentView('lists')}
              onAddTask={() => setShowNewTask(true)}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav currentView={currentView} onViewChange={setCurrentView} />

        {showNewTask && (
          <NewTaskModal
            categories={categories}
            initialDate={currentView === 'day' ? selectedDate : undefined}
            onClose={() => setShowNewTask(false)}
            onAdd={handleAddTask}
          />
        )}
      </div>
      <InstallPrompt />
      <PWAStatus />
    </div>
  );
}