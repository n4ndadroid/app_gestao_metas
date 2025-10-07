
import React, { useState, useEffect, useCallback, useMemo, FC, ReactNode, useRef, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { getMotivationalMessage } from './services/geminiService';
import type { Habit, Goal, LogEntry, Frequency, Item, ItemType } from './types';

// --- ICONS ---
const PlusIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const CheckCircleIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const CircleIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const EditIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.124-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.077-2.09.921-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const SparklesIcon: FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const ClockIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ChevronLeftIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);

const SunIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25 2.25 2.25 0 0 0 2.25 2.25 2.25 2.25 0 0 0 2.25-2.25A2.25 2.25 0 0 0 12 12Z" />
  </svg>
);

const MoonIcon: FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25c0 5.385 4.365 9.75 9.75 9.75 2.138 0 4.123-.693 5.752-1.848Z" />
  </svg>
);


// --- THEME MANAGEMENT ---
type Theme = 'light' | 'dark';
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem('zenith-theme');
        if (storedTheme) {
            return storedTheme as Theme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('zenith-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// --- UI COMPONENTS ---
const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-md rounded-xl p-6 ${className}`}>
        {children}
    </div>
);

const Modal: FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};

// --- DATA MANAGEMENT HOOK ---
type CalendarEntry = { marked: boolean; note: string };

const useAppData = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [calendarEntries, setCalendarEntries] = useState<Record<string, CalendarEntry>>({});

    useEffect(() => {
        try {
            const storedHabits = localStorage.getItem('zenith-habits');
            const storedGoals = localStorage.getItem('zenith-goals');
            const storedCalendar = localStorage.getItem('zenith-calendar-entries');
            if (storedHabits) setHabits(JSON.parse(storedHabits));
            if (storedGoals) setGoals(JSON.parse(storedGoals));
            if (storedCalendar) setCalendarEntries(JSON.parse(storedCalendar));
        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('zenith-habits', JSON.stringify(habits));
    }, [habits]);

    useEffect(() => {
        localStorage.setItem('zenith-goals', JSON.stringify(goals));
    }, [goals]);
    
    useEffect(() => {
        localStorage.setItem('zenith-calendar-entries', JSON.stringify(calendarEntries));
    }, [calendarEntries]);

    const saveHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'logs'>, id?: string) => {
        setHabits(prev => {
            if (id) {
                return prev.map(h => h.id === id ? { ...h, ...habit } : h);
            }
            const newHabit: Habit = {
                id: crypto.randomUUID(),
                ...habit,
                createdAt: new Date().toISOString(),
                logs: [],
            };
            return [...prev, newHabit];
        });
    }, []);
    
    const saveGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>, id?: string) => {
        setGoals(prev => {
            if (id) {
                return prev.map(g => g.id === id ? { ...g, ...goal } : g);
            }
            const newGoal: Goal = {
                id: crypto.randomUUID(),
                ...goal,
                createdAt: new Date().toISOString(),
            };
            return [...prev, newGoal];
        });
    }, []);

    const deleteItem = useCallback((id: string, type: ItemType) => {
        if (type === 'habit') {
            setHabits(prev => prev.filter(h => h.id !== id));
        } else {
            setGoals(prev => prev.filter(g => g.id !== id));
        }
    }, []);

    const logHabit = useCallback((id: string, date: Date) => {
        const dateString = date.toISOString();
        setHabits(prev => prev.map(h => {
            if (h.id !== id) return h;
            const logExists = h.logs.some(log => log.date.startsWith(date.toISOString().split('T')[0]));
            if (logExists) {
                return { ...h, logs: h.logs.filter(log => !log.date.startsWith(date.toISOString().split('T')[0])) };
            } else {
                return { ...h, logs: [...h.logs, { date: dateString }] };
            }
        }));
    }, []);
    
    const updateGoalProgress = useCallback((id: string, newProgress: number) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, currentProgress: Math.max(0, Math.min(g.target, newProgress)) } : g));
    }, []);

    const saveCalendarEntry = useCallback((date: Date, note: string, marked: boolean) => {
        const dateString = date.toISOString().split('T')[0];
        setCalendarEntries(prev => {
            const newEntries = { ...prev };
            if (!marked && !note) {
                delete newEntries[dateString];
            } else {
                newEntries[dateString] = { note, marked };
            }
            return newEntries;
        });
    }, []);

    return { habits, goals, calendarEntries, saveHabit, saveGoal, deleteItem, logHabit, updateGoalProgress, saveCalendarEntry };
};

type AppData = ReturnType<typeof useAppData>;

// --- FEATURE COMPONENTS ---
interface AddEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    saveHabit: AppData['saveHabit'];
    saveGoal: AppData['saveGoal'];
    itemToEdit?: Item | null;
    newItemType?: ItemType;
}

const AddEditModal: FC<AddEditModalProps> = ({ isOpen, onClose, saveHabit, saveGoal, itemToEdit, newItemType = 'habit' }) => {
    const [type, setType] = useState<ItemType>(newItemType);
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');
    const [target, setTarget] = useState(100);
    const [currentProgress, setCurrentProgress] = useState(0);
    const [unit, setUnit] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setName(itemToEdit.name);
                if ('frequency' in itemToEdit) { // It's a Habit
                    setType('habit');
                    setFrequency(itemToEdit.frequency);
                } else { // It's a Goal
                    setType('goal');
                    setTarget(itemToEdit.target);
                    setCurrentProgress(itemToEdit.currentProgress);
                    setUnit(itemToEdit.unit);
                }
            } else {
                // Reset form for a new item
                setName('');
                setFrequency('daily');
                setTarget(100);
                setCurrentProgress(0);
                setUnit('');
                setType(newItemType);
            }
        }
    }, [itemToEdit, isOpen, newItemType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (type === 'habit') {
            saveHabit({ name, frequency }, itemToEdit?.id);
        } else {
            saveGoal({ name, target, currentProgress, unit }, itemToEdit?.id);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={itemToEdit ? "Editar Item" : "Adicionar Novo Item"}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!itemToEdit && (
                    <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button type="button" onClick={() => setType('habit')} className={`w-1/2 p-2 rounded-md transition-colors text-sm font-medium ${type === 'habit' ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow' : 'text-slate-500 dark:text-slate-300'}`}>Hábito</button>
                        <button type="button" onClick={() => setType('goal')} className={`w-1/2 p-2 rounded-md transition-colors text-sm font-medium ${type === 'goal' ? 'bg-white dark:bg-slate-600 text-teal-600 dark:text-teal-400 shadow' : 'text-slate-500 dark:text-slate-300'}`}>Meta</button>
                    </div>
                )}
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                </div>

                {type === 'habit' ? (
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Frequência</label>
                        <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                        </select>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="target" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Alvo</label>
                             <input type="number" id="target" value={target} onChange={e => setTarget(Number(e.target.value))} required min="1" className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                         <div>
                             <label htmlFor="unit" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unidade</label>
                             <input type="text" id="unit" placeholder="ex: páginas, horas" value={unit} onChange={e => setUnit(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};

interface HabitItemProps {
    habit: Habit;
    logHabit: AppData['logHabit'];
    onEdit: () => void;
    onDelete: () => void;
}

const HabitItem: FC<HabitItemProps> = ({ habit, logHabit, onEdit, onDelete }) => {
    const isCompleted = useMemo(() => {
        const today = new Date();
        return habit.logs.some(log => log.date.startsWith(today.toISOString().split('T')[0]));
    }, [habit.logs]);

    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg group border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-4">
                <button onClick={() => logHabit(habit.id, new Date())} className="transition-transform transform hover:scale-110">
                    {isCompleted ? <CheckCircleIcon className="w-8 h-8 text-teal-500" /> : <CircleIcon className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-teal-500 transition-colors" />}
                </button>
                <div>
                    <p className={`font-medium text-slate-800 dark:text-slate-100 ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>{habit.name}</p>
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"><EditIcon /></button>
                <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"><TrashIcon /></button>
            </div>
        </div>
    );
};


interface GoalItemProps {
    goal: Goal;
    updateGoalProgress: AppData['updateGoalProgress'];
    onEdit: () => void;
    onDelete: () => void;
}

const GoalItem: FC<GoalItemProps> = ({ goal, updateGoalProgress, onEdit, onDelete }) => {
    const percentage = goal.target > 0 ? (goal.currentProgress / goal.target) * 100 : 0;

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateGoalProgress(goal.id, Number(e.target.value));
    };

    return (
        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 rounded-lg group border border-slate-200 dark:border-slate-700/50">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{goal.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{goal.currentProgress} / {goal.target} {goal.unit}</p>
                </div>
                <div className="flex items-center gap-1 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={onEdit} className="p-2 text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"><EditIcon /></button>
                     <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"><TrashIcon /></button>
                </div>
            </div>
            <div className="mt-4">
                <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
                <input
                    type="range"
                    min="0"
                    max={goal.target}
                    value={goal.currentProgress}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-transparent appearance-none cursor-pointer mt-2"
                />
            </div>
        </div>
    );
};

const AiFeedback: FC<{ habits: Habit[], goals: Goal[] }> = ({ habits, goals }) => {
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchFeedback = async () => {
        setIsLoading(true);
        setFeedback('');
        const message = await getMotivationalMessage(habits, goals);
        setFeedback(message);
        setIsLoading(false);
    };

    return (
        <Card>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <SparklesIcon />
                Motivação com IA
            </h3>
            {isLoading && <p className="text-teal-600 dark:text-teal-400 mt-2 animate-pulse">Gerando seu feedback...</p>}
            {feedback && <p className="text-slate-700 dark:text-slate-300 mt-2 text-sm">{feedback}</p>}
            {!isLoading && !feedback && <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">Clique para uma dica motivacional personalizada!</p>}
            <button
                onClick={handleFetchFeedback}
                disabled={isLoading}
                className="mt-4 w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-400 dark:disabled:bg-teal-800 transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? 'Pensando...' : 'Obter Dica'}
            </button>
        </Card>
    );
};

const Timer: FC = () => {
    const [time, setTime] = useState(0); // in seconds
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isActive && intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive]);

    const handleStartPause = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
    };

    const formatTime = () => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <Card>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5" />
                Cronômetro de Foco
            </h3>
            <div className="text-5xl font-mono text-center text-slate-800 dark:text-slate-100 my-2 py-2 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg">
                {formatTime()}
            </div>
            <div className="flex justify-center gap-4 mt-2">
                <button
                    onClick={handleStartPause}
                    className={`px-4 py-2 text-sm rounded-md font-semibold text-white transition-colors w-24 ${
                        isActive 
                        ? 'bg-amber-500 hover:bg-amber-600' 
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                >
                    {isActive ? 'Pausar' : 'Iniciar'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 text-sm rounded-md font-semibold bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors w-24"
                >
                    Zerar
                </button>
            </div>
        </Card>
    );
};

// --- PAGE COMPONENTS ---
const Dashboard: FC<AppData & { onEdit: (item: Item) => void; onAddNew: (type: ItemType) => void; }> = ({ habits, goals, logHabit, updateGoalProgress, deleteItem, onEdit, onAddNew }) => {
    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    const otherHabits = habits.filter(h => h.frequency !== 'daily');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Painel</h1>
                    <p className="text-slate-500 dark:text-slate-400">Tenha um ótimo dia e continue progredindo.</p>
                </div>
                
                <Card>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Foco do Dia</h2>
                    <div className="space-y-3">
                        {dailyHabits.length > 0 ? (
                            dailyHabits.map(habit => <HabitItem key={habit.id} habit={habit} logHabit={logHabit} onEdit={() => onEdit(habit)} onDelete={() => deleteItem(habit.id, 'habit')} />)
                        ) : (
                            <button onClick={() => onAddNew('habit')} className="w-full text-left p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                                <p className="text-slate-500 dark:text-slate-400">Nenhum hábito diário ainda.</p>
                                <p className="font-semibold text-teal-600 dark:text-teal-500">Adicione um para começar!</p>
                            </button>
                        )}
                        {otherHabits.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700">
                                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-3">Outros Hábitos</h3>
                                {otherHabits.map(habit => <HabitItem key={habit.id} habit={habit} logHabit={logHabit} onEdit={() => onEdit(habit)} onDelete={() => deleteItem(habit.id, 'habit')} />)}
                            </div>
                        )}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Minhas Metas</h2>
                     <div className="space-y-4">
                        {goals.length > 0 ? (
                            goals.map(goal => <GoalItem key={goal.id} goal={goal} updateGoalProgress={updateGoalProgress} onEdit={() => onEdit(goal)} onDelete={() => deleteItem(goal.id, 'goal')} />)
                        ) : (
                            <button onClick={() => onAddNew('goal')} className="w-full text-left p-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                                 <p className="text-slate-500 dark:text-slate-400">Você ainda não definiu nenhuma meta.</p>
                                 <p className="font-semibold text-teal-600 dark:text-teal-500">O que você quer alcançar?</p>
                             </button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 flex flex-col gap-8 sticky top-24">
                <Timer />
                <AiFeedback habits={habits} goals={goals} />
            </div>
        </div>
    );
};

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    entry?: CalendarEntry;
    onSave: (date: Date, note: string, marked: boolean) => void;
}

const NoteModal: FC<NoteModalProps> = ({ isOpen, onClose, date, entry, onSave }) => {
    const [note, setNote] = useState('');
    const [isMarked, setIsMarked] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNote(entry?.note || '');
            setIsMarked(entry?.marked || false);
        }
    }, [isOpen, entry]);

    const handleSave = () => {
        onSave(date, note, isMarked);
    };
    
    const formattedDate = date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes de ${formattedDate}`}>
            <div className="flex flex-col gap-4">
                 <div>
                    <label htmlFor="note" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nota do Dia</label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Adicione uma nota sobre o seu dia..."
                        rows={4}
                        className="block w-full rounded-md border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={() => setIsMarked(!isMarked)} 
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        {isMarked ? <CheckCircleIcon className="w-6 h-6 text-teal-500" /> : <CircleIcon className="w-6 h-6 text-slate-400" />}
                        <span className="text-slate-700 dark:text-slate-300 font-medium">Marcar como dia concluído</span>
                    </button>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors">Salvar</button>
                </div>
            </div>
        </Modal>
    );
};


const CalendarView: FC<{ calendarEntries: Record<string, CalendarEntry>, onDayClick: (date: Date) => void }> = ({ calendarEntries, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };
    
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const isToday = new Date().toISOString().split('T')[0] === dateString;

            const entry = calendarEntries[dateString];
            const isMarked = entry?.marked ?? false;
            const hasNote = !!entry?.note;

            let classes = "w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer relative";
            if (isToday) {
                classes += " border-2 border-teal-500";
            }
            if (isMarked) {
                classes += " bg-teal-500 text-white hover:bg-teal-600";
            } else {
                classes += " hover:bg-slate-200 dark:hover:bg-slate-700";
            }
            
            days.push(
                <button key={day} onClick={() => onDayClick(date)} className={classes}>
                    <span>{day}</span>
                    {hasNote && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                </button>
            );
        }
        return days;
    };
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ChevronLeftIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                    <ChevronRightIcon />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
             <div className="grid grid-cols-7 gap-y-2 place-items-center">
                {renderCalendar()}
            </div>
        </Card>
    );
};


// --- LAYOUT & MAIN APP ---
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
        >
            {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </button>
    );
};


const Header = () => {
    const location = useLocation();
    const getLinkClass = (path: string) => {
        const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
        const activeClass = "bg-slate-200 dark:bg-slate-700 text-teal-600 dark:text-teal-400";
        const inactiveClass = "text-slate-500 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50";
        return location.pathname === path ? `${baseClass} ${activeClass}` : `${baseClass} ${inactiveClass}`;
    };

    return (
        <header className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-700/80">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Zenith</h1>
                <div className="flex items-center gap-2">
                    <NavLink to="/" className={getLinkClass('/')}>Painel</NavLink>
                    <NavLink to="/calendar" className={getLinkClass('/calendar')}>Calendário</NavLink>
                    <div className="border-l border-slate-200 dark:border-slate-700 h-6 mx-2"></div>
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}

const AppContent = () => {
    const appData = useAppData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<Item | null>(null);
    const [newItemType, setNewItemType] = useState<ItemType>('habit');
    
    const [noteModalDate, setNoteModalDate] = useState<Date | null>(null);

    const handleOpenModal = (itemOrType?: Item | ItemType) => {
        if (typeof itemOrType === 'string') { // It's a type for a new item
            setItemToEdit(null);
            setNewItemType(itemOrType);
        } else { // It's an item to edit, or nothing (from FAB)
            setItemToEdit(itemOrType || null);
            if (!itemOrType) { // From FAB, default to habit
                setNewItemType('habit');
            }
        }
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setItemToEdit(null);
        setIsModalOpen(false);
    };

    const handleOpenNoteModal = (date: Date) => {
        setNoteModalDate(date);
    };

    const handleCloseNoteModal = () => {
        setNoteModalDate(null);
    };

    const handleSaveNote = (date: Date, note: string, marked: boolean) => {
        appData.saveCalendarEntry(date, note, marked);
        handleCloseNoteModal();
    };

    return (
        <div className="min-h-screen text-slate-600 dark:text-slate-400 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[30rem] bg-gradient-to-br from-teal-400 to-sky-500 rounded-full opacity-20 dark:opacity-10 blur-3xl -z-10"></div>
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                 <Routes>
                    <Route path="/" element={<Dashboard {...appData} onEdit={handleOpenModal} onAddNew={handleOpenModal} />} />
                    <Route path="/calendar" element={<CalendarView calendarEntries={appData.calendarEntries} onDayClick={handleOpenNoteModal} />} />
                </Routes>
            </main>
            <button
                onClick={() => handleOpenModal()}
                className="fixed bottom-8 right-8 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900"
                aria-label="Adicionar novo item"
            >
                <PlusIcon className="w-8 h-8"/>
            </button>
            <AddEditModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                saveHabit={appData.saveHabit}
                saveGoal={appData.saveGoal}
                itemToEdit={itemToEdit}
                newItemType={newItemType}
            />
            {noteModalDate && (
                <NoteModal
                    isOpen={!!noteModalDate}
                    onClose={handleCloseNoteModal}
                    date={noteModalDate}
                    entry={appData.calendarEntries[noteModalDate.toISOString().split('T')[0]]}
                    onSave={handleSaveNote}
                />
            )}
        </div>
    );
};


const App = () => {
    return (
        <ThemeProvider>
            <HashRouter>
                <AppContent />
            </HashRouter>
        </ThemeProvider>
    );
};

export default App;