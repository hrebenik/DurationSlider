import { useCallback } from 'react';
import {
  addDays,
  findDays,
  asMinutes,
  removeDays,
  fromMinutes,
  normalizeTime,
} from 'pomeranian-durations';

const useDuration = () => {
  const isoToMinutes = useCallback((v) => {
    const d = findDays(v) || 0;
    const m = asMinutes(removeDays(v));
    return (d * 24 * 60) + m;
  }, []);

  const minutesToIso = useCallback((v) => {
    const d = Math.floor(v / 24 / 60);
    const m = v - (d * 60 * 24);
    return addDays(d, normalizeTime(fromMinutes(m)));
  }, []);

  return { isoToMinutes, minutesToIso };
};

export default useDuration;
