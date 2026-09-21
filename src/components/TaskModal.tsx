import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Task, QuadrantId } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  initialData?: Task;
  defaultQuadrant?: QuadrantId;
}

export function TaskModal({ isOpen, onClose, onSave, initialData, defaultQuadrant }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantId>('q1');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [recurring, setRecurring] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(typeof initialData.title === 'string' ? initialData.title : String(initialData.title || ''));
        const validQuadrant: QuadrantId = ['q1', 'q2', 'q3', 'q4'].includes(initialData.quadrant) ? initialData.quadrant : 'q1';
        setQuadrant(validQuadrant);
        setRecurring(Boolean(initialData.recurring));
        if (initialData.deadline) {
          try {
            const d = new Date(initialData.deadline);
            if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              const hours = String(d.getHours()).padStart(2, '0');
              const minutes = String(d.getMinutes()).padStart(2, '0');
              setDeadlineDate(`${year}-${month}-${day}`);
              setDeadlineTime(`${hours}:${minutes}`);
            } else {
              setDeadlineDate('');
              setDeadlineTime('');
            }
          } catch {
            setDeadlineDate('');
            setDeadlineTime('');
          }
        } else {
          setDeadlineDate('');
          setDeadlineTime('');
        }
      } else {
        setTitle('');
        setQuadrant(defaultQuadrant && ['q1', 'q2', 'q3', 'q4'].includes(defaultQuadrant) ? defaultQuadrant : 'q1');
        setRecurring(false);
        setDeadlineDate('');
        setDeadlineTime('');
      }
    }
  }, [isOpen, initialData, defaultQuadrant]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = typeof title === 'string' ? title.trim() : String(title || '').trim();
    if (!cleanTitle) return;

    let deadline: string | undefined = undefined;
    if (deadlineDate) {
      const parts = deadlineDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const timeParts = (deadlineTime || '12:00').split(':');
        const hours = parseInt(timeParts[0] || '12', 10);
        const minutes = parseInt(timeParts[1] || '0', 10);

        const localDate = new Date(year, month, day, hours, minutes);
        if (!isNaN(localDate.getTime())) {
          deadline = localDate.toISOString();
        }
      }
    }

    const safeQuadrant: QuadrantId = ['q1', 'q2', 'q3', 'q4'].includes(quadrant) ? quadrant : 'q1';

    onSave({
      title: cleanTitle,
      quadrant: safeQuadrant,
      recurring: Boolean(recurring),
      deadline
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Título</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-shadow"
              placeholder="Ej. Terminar reporte mensual"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cuadrante</label>
            <select
              value={quadrant}
              onChange={e => setQuadrant(e.target.value as QuadrantId)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-shadow"
            >
              <option value="q1">Hacer primero (Urgente e Importante)</option>
              <option value="q2">Programar (Importante, No Urgente)</option>
              <option value="q3">Delegar (Urgente, No Importante)</option>
              <option value="q4">Eliminar (Ni Urgente ni Importante)</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fecha Límite</label>
              <input
                type="date"
                value={deadlineDate}
                onChange={e => setDeadlineDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-shadow text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hora Límite</label>
              <input
                type="time"
                value={deadlineTime}
                onChange={e => setDeadlineTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white outline-none transition-shadow text-sm"
                disabled={!deadlineDate}
              />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer mt-2 group p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
            <input
              type="checkbox"
              checked={recurring}
              onChange={e => setRecurring(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 dark:text-white focus:ring-gray-900 dark:focus:ring-white bg-white dark:bg-gray-800 dark:border-gray-600 transition-colors"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Tarea Recurrente Diaria</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">Si la completas hoy, volverá a aparecer como pendiente el día de mañana.</p>
            </div>
          </label>

          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
            >
              Guardar Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
