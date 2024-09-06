import { useState } from "react";

export const useLocalStorage = <T>(
  keyName: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.error(`Error reading from localStorage for key ${keyName}:`, err);
      return defaultValue;
    }
  });

  const setValue = (newValue: T) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch (err) {
      console.error(`Error writing to localStorage for key ${keyName}:`, err);
    }
  };

  return [storedValue, setValue];
};
