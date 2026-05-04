/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Priority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export type RecurrenceType = 'daily' | 'weekly' | 'custom';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: string;
  deadline?: string;
  notes?: string;
  completed: boolean;
  createdAt: number;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number;
}

export type View = 'dashboard' | 'brain-dump' | 'output' | 'detail';

export interface ParseResult {
  title: string;
  priority: Priority;
  category: string;
  deadline?: string;
  isRecurring: boolean;
  recurrenceType?: RecurrenceType;
}
