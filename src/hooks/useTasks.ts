/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Task, Priority } from '../types';

const STORAGE_KEY = 'brain_dump_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const taskIndex = prev.findIndex(t => t.id === id);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const isCompleting = !task.completed;
      const newTasks = [...prev];
      
      newTasks[taskIndex] = { ...task, completed: isCompleting };

      // If completing a recurring task, spawn a new one
      if (isCompleting && task.isRecurring) {
        const nextTask: Task = {
          ...task,
          id: Math.random().toString(36).substring(2, 9),
          completed: false,
          createdAt: Date.now(),
          // Shift deadline if possible (very simple logic for MVP)
          deadline: task.deadline === 'Today' ? (task.recurrenceType === 'daily' ? 'Tomorrow' : 'Next Week') : task.deadline
        };
        newTasks.unshift(nextTask);
      }

      return newTasks;
    });
  };

  return { tasks, addTask, updateTask, deleteTask, toggleTask };
}
