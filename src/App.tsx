/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TaskBoard } from './components/TaskBoard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { useTasks } from './hooks/useTasks';
import { LayoutGrid, Eye, EyeOff } from 'lucide-react';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [showCompleted, setShowCompleted] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-gray-200 dark:selection:bg-gray-800">
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-900 bg-white dark:bg-black sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
            <LayoutGrid size={20} className="text-white dark:text-black" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Matriz de Eisenhower</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {showCompleted ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline-block">{showCompleted ? "Ocultar completadas" : "Mostrar completadas"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 lg:gap-8 items-start justify-center">
        <div className="w-full xl:w-[320px] shrink-0 space-y-6 xl:sticky xl:top-28">
          <PomodoroTimer />
          
          <div className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">Cómo funciona</h4>
            <ul className="space-y-3">
              <li><strong className="text-gray-900 dark:text-gray-200">Hacer:</strong> Tareas críticas y urgentes. Hazlas ya.</li>
              <li><strong className="text-gray-900 dark:text-gray-200">Programar:</strong> Tareas importantes a largo plazo. Ponles fecha.</li>
              <li><strong className="text-gray-900 dark:text-gray-200">Delegar:</strong> Tareas urgentes pero que no requieren tu habilidad única.</li>
              <li><strong className="text-gray-900 dark:text-gray-200">Eliminar:</strong> Distracciones. Bórralas.</li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1 w-full min-w-0">
          <TaskBoard 
            tasks={tasks}
            showCompleted={showCompleted}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
}
