/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Priority, ParseResult } from '../types';

/**
 * Filter words that don't add value to a task title.
 */
const FILLER_WORDS = [
  'i think', 'maybe', 'just', 'actually', 'sort of', 'kind of', 
  'i need to', 'i should', 'please', 'can you', 'potentially',
  'basically', 'honestly', 'literally'
];

/**
 * Time-based keywords for deadline extraction.
 */
const TEMPORAL_MAP: Record<string, string> = {
  'today': 'Today',
  'tonight': 'Tonight',
  'tomorrow': 'Tomorrow',
  'this evening': 'This Evening',
  'by evening': 'By Evening',
  'next week': 'Next Week',
  'asap': 'ASAP',
  'now': 'Now',
  'soon': 'Soon',
  'this weekend': 'This Weekend'
};

/**
 * Priority mapping.
 */
const PRIORITY_KEYWORDS = {
  [Priority.HIGH]: ['urgent', 'asap', 'critical', 'now', 'important', 'immediately', 'must'],
  [Priority.MEDIUM]: ['soon', 'tomorrow', 'next', 'eventually'],
  [Priority.LOW]: ['later', 'maybe', 'eventually', 'fallback', 'someday']
};

/**
 * Category keywords mapping.
 */
const CATEGORY_MAP: Record<string, string[]> = {
  'College': ['assignment', 'quiz', 'exam', 'study', 'class', 'lecture', 'professor', 'campus', 'thesis'],
  'Home': ['clean', 'dishes', 'laundry', 'fix', 'apartment', 'house', 'kitchen', 'repair', 'garden'],
  'Groceries': ['buy', 'milk', 'eggs', 'bread', 'store', 'market', 'grocery', 'shopping', 'food'],
  'Work': ['email', 'meeting', 'boss', 'report', 'deadline', 'client', 'project', 'zoom', 'office', 'budget'],
  'Personal': ['workout', 'gym', 'exercise', 'call', 'family', 'friend', 'hobby', 'read', 'meditate']
};

/**
 * Recurrence keywords.
 */
const RECURRENCE_KEYWORDS = {
  'daily': ['every day', 'daily', 'everyday', 'each day'],
  'weekly': ['every week', 'weekly', 'every monday', 'every tuesday', 'every wednesday', 'every thursday', 'every friday', 'every saturday', 'every sunday']
};

export function parseBrainDump(input: string): ParseResult[] {
  if (!input.trim()) return [];

  // 1. Initial Cleaning: Remove irregular spacing and normalize casing for analysis
  const normalizedInput = input.replace(/\s+/g, ' ').trim();

  // 2. Intelligent Splitting
  const fragments = normalizedInput
    .split(/\n|(?:\s*,\s*)|(?:\s+and\s+)/i)
    .map(f => f.trim())
    .filter(f => f.length > 5);

  const results: ParseResult[] = [];
  const seenTitles = new Set<string>();

  for (const fragment of fragments) {
    let title = fragment;
    let priority = Priority.LOW;
    let deadline: string | undefined;
    let category = 'Uncategorized';
    let isRecurring = false;
    let recurrenceType: 'daily' | 'weekly' | undefined;

    const lowerFragment = fragment.toLowerCase();

    // 3. Category Detection
    for (const [cat, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(k => lowerFragment.includes(k))) {
        category = cat;
        break;
      }
    }

    // 4. Recurrence Detection
    if (RECURRENCE_KEYWORDS.daily.some(k => lowerFragment.includes(k))) {
      isRecurring = true;
      recurrenceType = 'daily';
      // Clean up title
      RECURRENCE_KEYWORDS.daily.forEach(k => {
        const regex = new RegExp(`\\b${k}\\b`, 'gi');
        title = title.replace(regex, '');
      });
    } else if (RECURRENCE_KEYWORDS.weekly.some(k => lowerFragment.includes(k))) {
      isRecurring = true;
      recurrenceType = 'weekly';
      // Clean up title
      RECURRENCE_KEYWORDS.weekly.forEach(k => {
        const regex = new RegExp(`\\b${k}\\b`, 'gi');
        title = title.replace(regex, '');
      });
    }

    // 5. Normalization & Cleaning (Filler words)
    FILLER_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      title = title.replace(regex, '');
    });

    // 6. Temporal Extraction
    for (const [key, val] of Object.entries(TEMPORAL_MAP)) {
      if (lowerFragment.includes(key)) {
        deadline = val;
        if (key === 'today' || key === 'now' || key === 'asap') priority = Priority.HIGH;
        if (key === 'tomorrow') priority = Priority.MEDIUM;
        
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        title = title.replace(regex, '');
        break; 
      }
    }

    // 7. Priority Detection (Rule-based)
    for (const pLevel of [Priority.HIGH, Priority.MEDIUM]) {
      const keywords = PRIORITY_KEYWORDS[pLevel];
      if (keywords.some(k => lowerFragment.includes(k))) {
        priority = pLevel;
        keywords.forEach(k => {
          const regex = new RegExp(`\\b${k}\\b`, 'gi');
          title = title.replace(regex, '');
        });
        break;
      }
    }

    // 8. Final title normalization
    title = title
      .replace(/[.,;!]$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    if (!title || title.length < 3) {
      title = fragment; 
    }

    // 9. Deduplication
    const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenTitles.has(normalizedTitle)) {
      results.push({ title, priority, category, deadline, isRecurring, recurrenceType });
      seenTitles.add(normalizedTitle);
    }
  }

  return results;
}

