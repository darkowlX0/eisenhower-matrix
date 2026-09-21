import React, { useState } from 'react';
import { Task, QuadrantId } from '../types';
import { TaskItem } from './TaskItem';
import { TaskModal } from './TaskModal';
import { Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface TaskBoardProps {
  tasks: Task[];
  showCompleted: boolean;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, direction: 'up' | 'down', visibleTaskIds?: string[]) => void;
}

const QUADRANTS: { id: QuadrantId; title: string; subtitle: string; colorClass: string; darkColorClass: string }[] = [
  { id: 'q1', title: 'Hacer', subtitle: 'Urgente e Importante', colorClass: 'bg-red-50/50 text-red-900 border-red-100', darkColorClass: 'dark:bg-red-950/20 dark:text-red-200 dark:border-red-900/30' },
  { id: 'q2', title: 'Programar', subtitle: 'Importante, No Urgente', colorClass: 'bg-blue-50/50 text-blue-900 border-blue-100', darkColorClass: 'dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-900/30' },
  { id: 'q3', title: 'Delegar', subtitle: 'Urgente, No Importante', colorClass: 'bg-amber-50/50 text-amber-900 border-amber-100', darkColorClass: 'dark:bg-amber-950/20 dark:text-amber-200 dark:border-amber-900/30' },
  { id: 'q4', title: 'Eliminar', subtitle: 'Ni Urgente ni Importante', colorClass: 'bg-gray-50/50 text-gray-900 border-gray-100', darkColorClass: 'dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800' },
];

export function TaskBoard({ tasks, showCompleted, onAddTask, onUpdateTask, onDeleteTask, onMoveTask }: TaskBoardProps) {
  const [dragOverQuadrant, setDragOverQuadrant] = useState<QuadrantId | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    initialData?: Task;
    defaultQuadrant?: QuadrantId;
  }>({ isOpen: false });

  const handleOpenNew = (quadrant: QuadrantId) => {
    setModalState({ isOpen: true, defaultQuadrant: quadrant });
  };

  const handleOpenEdit = (task: Task) => {
    setModalState({ isOpen: true, initialData: task });
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (modalState.initialData) {
      onUpdateTask(modalState.initialData.id, taskData);
    } else {
      onAddTask(taskData);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-6xl mx-auto">
        {QUADRANTS.map(q => {
          const quadrantTasks = tasks
            .filter(t => t.quadrant === q.id)
            .filter(t => showCompleted || !t.completed);

          return (
            <div 
              key={q.id} 
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverQuadrant !== q.id) setDragOverQuadrant(q.id);
              }}
              onDragLeave={() => {
                if (dragOverQuadrant === q.id) setDragOverQuadrant(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverQuadrant(null);
                const taskId = e.dataTransfer.getData('taskId');
                if (taskId) {
                  onUpdateTask(taskId, { quadrant: q.id });
                }
              }}
              className={cn(
                "flex flex-col rounded-3xl border p-5 h-[420px] transition-all duration-200",
                q.colorClass,
                q.darkColorClass,
                dragOverQuadrant === q.id ? "ring-4 ring-offset-2 ring-blue-500/50 scale-[1.02] dark:ring-offset-gray-900" : ""
              )}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-xl tracking-tight">{q.title}</h3>
                  <p className="text-sm opacity-70 font-medium mt-0.5">{q.subtitle}</p>
                </div>
                <button
                  onClick={() => handleOpenNew(q.id)}
                  className="p-2.5 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 shadow-sm transition-all text-current"
                  title="Añadir Tarea"
                >
                  <Plus size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2 pb-2 custom-scrollbar">
                {quadrantTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-sm opacity-50 font-medium border-2 border-dashed border-current/10 rounded-xl mx-2 my-2">
                    Sin tareas
                  </div>
                ) : (
                  quadrantTasks.map((task, index) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      isFirst={index === 0}
                      isLast={index === quadrantTasks.length - 1}
                      onToggle={(id, completed) => onUpdateTask(id, { completed })}
                      onEdit={handleOpenEdit}
                      onDelete={onDeleteTask}
                      onMove={(id, direction) => onMoveTask(id, direction, quadrantTasks.map(t => t.id))}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false })}
        onSave={handleSave}
        initialData={modalState.initialData}
        defaultQuadrant={modalState.defaultQuadrant}
      />
    </>
  );
}
