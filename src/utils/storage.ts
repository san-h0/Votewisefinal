/**
 * Defensive localStorage wrapper with comprehensive error handling
 * Prevents application crashes in iframe, incognito mode, or restricted security sandboxes.
 */

export function safeGetStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[SafeStorage] Failed to read key "${key}":`, err);
    return defaultValue;
  }
}

export function safeSetStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] Failed to save key "${key}":`, err);
    return false;
  }
}

export function safeRemoveStorage(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[SafeStorage] Failed to remove key "${key}":`, err);
    return false;
  }
}
