import React from 'react';
import { Edit2, Trash2, Clock, Repeat, ArrowUp, ArrowDown } from 'lucide-react';
import { Task } from '../types';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskItemProps {
  key?: string;
  task: Task;
  isFirst?: boolean;
  isLast?: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
}

export function TaskItem({ 
  task, 
  isFirst = false, 
  isLast = false, 
  onToggle, 
  onEdit, 
  onDelete, 
  onMove 
}: TaskItemProps) {
  let formattedDeadline: string | null = null;
  let isPastDeadline = false;

  if (task.deadline) {
    try {
      const parsedDate = parseISO(task.deadline);
      if (!isNaN(parsedDate.getTime())) {
        formattedDeadline = format(parsedDate, "d MMM, HH:mm", { locale: es });
        isPastDeadline = parsedDate < new Date() && !task.completed;
      }
    } catch {
      formattedDeadline = null;
      isPastDeadline = false;
    }
  }

  const safeTitle = typeof task.title === 'string' ? task.title : String(task.title || '');

  return (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('taskId', task.id);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => {
          if (e.target instanceof HTMLElement) e.target.style.opacity = '0.5';
        }, 0);
      }}
      onDragEnd={(e) => {
        if (e.target instanceof HTMLElement) e.target.style.opacity = '1';
      }}
      className={cn(
        "group flex items-start gap-3 p-3 bg-white dark:bg-gray-800/80 rounded-xl shadow-sm border transition-all hover:shadow-md cursor-grab active:cursor-grabbing",
        task.completed ? "border-transparent opacity-60 bg-gray-50/50 dark:bg-gray-900/50" : "border-gray-100 dark:border-gray-700/60",
        isPastDeadline ? "border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20" : ""
      )}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onToggle(task.id, e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-600 dark:focus:ring-white dark:bg-gray-700 cursor-pointer transition-all shrink-0"
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium text-gray-900 dark:text-gray-100 break-words leading-tight",
          task.completed && "line-through text-gray-500 dark:text-gray-400"
        )}>
          {safeTitle}
        </p>
        
        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {formattedDeadline && (
            <span className={cn("flex items-center gap-1", isPastDeadline && "text-red-600 dark:text-red-400 font-medium")}>
              <Clock size={12} />
              {formattedDeadline}
            </span>
          )}
          {task.recurring && (

            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium" title="Tarea Recurrente">
              <Repeat size={12} />
              Diaria
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        {onMove && (
          <div className="flex items-center mr-1">
            <button
              onClick={() => onMove(task.id, 'up')}
              disabled={isFirst}
              className={cn(
                "p-1.5 text-gray-400 rounded-md transition-colors",
                isFirst 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              title={isFirst ? "En la posición superior" : "Mover arriba"}
              aria-label="Mover arriba"
            >
              <ArrowUp size={15} />
            </button>
            <button
              onClick={() => onMove(task.id, 'down')}
              disabled={isLast}
              className={cn(
                "p-1.5 text-gray-400 rounded-md transition-colors",
                isLast 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              title={isLast ? "En la posición inferior" : "Mover abajo"}
              aria-label="Mover abajo"
            >
              <ArrowDown size={15} />
            </button>
          </div>
        )}
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Editar"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/30"
          title="Eliminar"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
