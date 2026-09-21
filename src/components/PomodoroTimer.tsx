import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function PomodoroTimer() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isFocus, setIsFocus] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsFocus(!isFocus);
      setTimeLeft(isFocus ? breakTime * 60 : focusTime * 60);
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isFocus, focusTime, breakTime]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(isFocus ? focusTime * 60 : breakTime * 60);
  };
  const switchMode = (toFocus: boolean) => {
    setIsFocus(toFocus);
    setIsActive(false);
    setTimeLeft(toFocus ? focusTime * 60 : breakTime * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSettings(false);
    reset();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
        <button
          onClick={() => switchMode(true)}
          className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-colors", 
            isFocus ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700")}
        >
          Enfoque
        </button>
        <button
          onClick={() => switchMode(false)}
          className={cn("px-4 py-1.5 rounded-full text-xs font-medium transition-colors", 
            !isFocus ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700")}
        >
          Descanso
        </button>
      </div>

      <div className="text-5xl font-bold tracking-tighter text-gray-800 dark:text-gray-100 mb-6 font-mono tabular-nums">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={reset} className="p-2.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <RotateCcw size={20} />
        </button>
        <button onClick={toggle} className="p-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-full transition-transform active:scale-95 shadow-md">
          {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <Settings size={20} />
        </button>
      </div>

      {showSettings && (
        <form onSubmit={saveSettings} className="mt-6 w-full pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Enfoque (min)</label>
              <input type="number" min="1" max="120" value={focusTime} onChange={e => setFocusTime(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 outline-none transition-shadow" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Descanso (min)</label>
              <input type="number" min="1" max="60" value={breakTime} onChange={e => setBreakTime(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 outline-none transition-shadow" />
            </div>
          </div>
          <button type="submit" className="w-full mt-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-medium py-2.5 rounded-lg transition-colors">
            Guardar Configuración
          </button>
        </form>
      )}
    </div>
  );
}
