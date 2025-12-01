// utils/historyData.js
import { formatDateKey } from './dateutils';

// Mock history for past dates
// Keys are "YYYY-MM-DD"
export const MOCK_HISTORY = {
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() - 1)))]: {
    // Yesterday
    s101: { status: 'present', time: '8:55 AM' },
    s102: { status: 'present', time: '8:58 AM' },
    s103: { status: 'absent', time: '-' },
    s104: { status: 'present', time: '9:05 AM' },
    s105: { status: 'late', time: '9:15 AM' },
  },
  [formatDateKey(new Date(new Date().setDate(new Date().getDate() - 2)))]: {
    // 2 days ago
    s101: { status: 'absent', time: '-' },
    s102: { status: 'present', time: '8:59 AM' },
    s103: { status: 'present', time: '9:02 AM' },
    s104: { status: 'present', time: '9:01 AM' },
    s105: { status: 'present', time: '9:00 AM' },
  },
};