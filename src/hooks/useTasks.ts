import { useState, useEffect } from 'react';
import { Task, QuadrantId } from '../types';
import { isToday, parseISO } from 'date-fns';

const VALID_QUADRANTS: QuadrantId[] = ['q1', 'q2', 'q3', 'q4'];

function isValidQuadrant(q: unknown): q is QuadrantId {
  return typeof q === 'string' && VALID_QUADRANTS.includes(q as QuadrantId);
}

function isValidIsoDate(str: unknown): str is string {
  if (typeof str !== 'string' || !str.trim()) return false;
  try {
    const parsed = parseISO(str);
    return !isNaN(parsed.getTime());
  } catch {
    return false;
  }
}

interface SanitizeResult {
  task: Task | null;
  modified: boolean;
}

function sanitizeTask(raw: unknown): SanitizeResult {
  if (!raw || typeof raw !== 'object') {
    return { task: null, modified: true };
  }

  const item = raw as Record<string, unknown>;
  let modified = false;

  // Title must be a non-empty string. Objects, numbers, etc. are rejected
  if (typeof item.title !== 'string') {
    return { task: null, modified: true };
  }
  const cleanTitle = item.title.trim();
  if (!cleanTitle) {
    return { task: null, modified: true };
  }
  if (cleanTitle !== item.title) {
    modified = true;
  }

  // Quadrant validation
  let quadrant: QuadrantId;
  if (isValidQuadrant(item.quadrant)) {
    quadrant = item.quadrant;
  } else {
    quadrant = 'q1';
    modified = true;
  }

  // ID validation
  let id: string;
  if (typeof item.id === 'string' && item.id.trim()) {
    id = item.id.trim();
    if (id !== item.id) modified = true;
  } else {
    id = crypto.randomUUID();
    modified = true;
  }

  // Completed
  const completed = Boolean(item.completed);
  if (typeof item.completed !== 'boolean') modified = true;

  // CreatedAt
  let createdAt: string;
  if (isValidIsoDate(item.createdAt)) {
    createdAt = item.createdAt;
  } else {
    createdAt = new Date().toISOString();
    modified = true;
  }

  // Deadline: only keep if valid date string
  let deadline: string | undefined = undefined;
  if (item.deadline !== undefined && item.deadline !== null) {
    if (isValidIsoDate(item.deadline)) {
      deadline = item.deadline;
    } else {
      deadline = undefined;
      modified = true;
    }
  }

  // Recurring
  const recurring = Boolean(item.recurring);
  if (item.recurring !== undefined && typeof item.recurring !== 'boolean') modified = true;

  // LastCompletedDate
  let lastCompletedDate: string | undefined = undefined;
  if (item.lastCompletedDate !== undefined && item.lastCompletedDate !== null) {
    if (isValidIsoDate(item.lastCompletedDate)) {
      lastCompletedDate = item.lastCompletedDate;
    } else {
      lastCompletedDate = undefined;
      modified = true;
    }
  }

  return {
    task: {
      id,
      title: cleanTitle,
      quadrant,
      completed,
      createdAt,
      deadline,
      recurring,
      lastCompletedDate,
    },
    modified,
  };
}

const STORAGE_KEY = 'eisenhower-tasks';
const BACKUP_KEY = 'eisenhower-tasks-backup';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      let needsBackup = false;
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const validatedTasks: Task[] = [];
          for (const item of parsed) {
            const { task, modified } = sanitizeTask(item);
            if (modified) {
              needsBackup = true;
            }
            if (task) {
              if (task.recurring && task.completed && task.lastCompletedDate) {
                try {
                  const lastDate = parseISO(task.lastCompletedDate);
                  if (!isNaN(lastDate.getTime()) && !isToday(lastDate)) {
                    task.completed = false;
                    task.lastCompletedDate = undefined;
                  }
                } catch {
                  // Si falla parseISO, no alteramos el estado
                }
              }
              validatedTasks.push(task);
            }
          }

          if (needsBackup) {
            try {
              localStorage.setItem(BACKUP_KEY, saved);
            } catch (err) {
              console.warn("No se pudo crear copia de respaldo previa", err);
            }
          }

          setTasks(validatedTasks);
          setIsLoaded(true);
        } else {
          // El JSON no es un array válido. Respaldamos los datos corruptos para no perderlos y permitimos guardar tareas nuevas.
          console.warn("Los datos de localStorage no son un arreglo válido. Se respaldan en eisenhower-tasks-backup.");
          try {
            localStorage.setItem(BACKUP_KEY, saved);
          } catch (err) {
            console.warn("No se pudo crear copia de respaldo previa", err);
          }
          setTasks([]);
          setIsLoaded(true);
        }
      } catch (e) {
        // Error de parseo JSON. Respaldamos el texto crudo y permitimos que la sesión actual guarde nuevas tareas.
        console.error("Error al parsear tareas desde localStorage. Respaldando en eisenhower-tasks-backup.", e);
        try {
          localStorage.setItem(BACKUP_KEY, saved);
        } catch (err) {
          console.warn("No se pudo crear copia de respaldo previa", err);
        }
        setTasks([]);
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    if (typeof task.title !== 'string') return;
    const sanitizedTitle = task.title.trim();
    if (!sanitizedTitle) return;

    const newTask: Task = {
      ...task,
      title: sanitizedTitle,
      quadrant: isValidQuadrant(task.quadrant) ? task.quadrant : 'q1',
      deadline: isValidIsoDate(task.deadline) ? task.deadline : undefined,
      recurring: Boolean(task.recurring),
      id: crypto.randomUUID(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const updated = { ...t, ...updates };

      if (updates.title !== undefined) {
        if (typeof updates.title === 'string' && updates.title.trim()) {
          updated.title = updates.title.trim();
        }
      }
      if (updates.quadrant !== undefined && isValidQuadrant(updates.quadrant)) {
        updated.quadrant = updates.quadrant;
      }
      if (updates.deadline !== undefined) {
        updated.deadline = isValidIsoDate(updates.deadline) ? updates.deadline : undefined;
      }
      if (updates.completed === true) {
        updated.lastCompletedDate = new Date().toISOString();
      } else if (updates.completed === false) {
        updated.lastCompletedDate = undefined;
      }
      return updated;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, addTask, updateTask, deleteTask };
}

