import { motion } from 'motion/react';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Task } from '../App';
import { isSameDay, getToday } from '../utils/dateUtils';

interface CalendarProps {
  tasks: Task[];
  onSelectDate: (date: Date) => void;
  onAddTask: () => void;
}

export function Calendar({ tasks, onSelectDate, onAddTask }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate stats for current month
  const tasksThisMonth = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    return taskDate.getMonth() === month && taskDate.getFullYear() === year;
  });

  const completedThisMonth = tasksThisMonth.filter(t => t.completed).length;
  const pendingThisMonth = tasksThisMonth.filter(t => !t.completed).length;

  const tasksToday = tasks.filter(t => isSameDay(t.dueDate, getToday()));
  const todayCompleted = tasksToday.filter(t => t.completed).length;
  const todayPending = tasksToday.filter(t => !t.completed).length;

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getTasksForDate = (day: number) => {
    const date = new Date(year, month, day);
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    return isSameDay(date, getToday());
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayTasks = getTasksForDate(day);
    const completedCount = dayTasks.filter(t => t.completed).length;
    const totalCount = dayTasks.length;
    const hasAllCompleted = totalCount > 0 && completedCount === totalCount;

    days.push(
      <motion.button
        key={day}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: day * 0.01 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectDate(new Date(year, month, day))}
        className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all ${
          isToday(day)
            ? 'bg-blue-500 text-white shadow-md'
            : totalCount > 0
            ? 'bg-blue-50 text-gray-900 hover:bg-blue-100'
            : 'hover:bg-gray-50 text-gray-900'
        }`}
      >
        <span className={`text-sm font-medium ${isToday(day) ? 'text-white' : 'text-gray-700'}`}>
          {day}
        </span>
        
        {totalCount > 0 && (
          <div className="flex gap-0.5 mt-1">
            {hasAllCompleted ? (
              <div className={`w-1 h-1 rounded-full ${isToday(day) ? 'bg-white' : 'bg-green-500'}`} />
            ) : (
              <>
                {[...Array(Math.min(totalCount, 3))].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      isToday(day) ? 'bg-white' : 'bg-blue-500'
                    }`}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <div className="relative h-full overflow-hidden">
      {/* Decorative background blob */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"
      />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-6 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <h2 className="text-xl font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-gray-900"
          >
            Calendar
          </motion.h1>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days}
          </div>

          {/* Stats Card */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {monthNames[month]} Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* This Month */}
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{tasksThisMonth.length}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="text-green-600 font-medium">{completedThisMonth} done</span>
                  {pendingThisMonth > 0 && (
                    <span className="text-gray-400">{pendingThisMonth} pending</span>
                  )}
                </div>
              </div>

              {/* Today */}
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-2xl font-bold text-blue-600">{tasksToday.length}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  {todayCompleted > 0 && (
                    <span className="text-green-600 font-medium">{todayCompleted} done</span>
                  )}
                  {todayPending > 0 && (
                    <span className="text-gray-400">{todayPending} to do</span>
                  )}
                  {tasksToday.length === 0 && (
                    <span className="text-gray-400">No tasks</span>
                  )}
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            {tasksThisMonth.length > 0 && (
              <div className="mt-4 bg-white rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Completion Rate</p>
                  <p className="text-sm font-bold text-gray-900">
                    {Math.round((completedThisMonth / tasksThisMonth.length) * 100)}%
                  </p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedThisMonth / tasksThisMonth.length) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            )}
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
          className="absolute bottom-20 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}