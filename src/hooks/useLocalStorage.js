import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key);

      if (savedValue !== null) {
        return JSON.parse(savedValue);
      }

      return typeof initialValue === 'function'
        ? initialValue()
        : initialValue;
    } catch {
      return typeof initialValue === 'function'
        ? initialValue()
        : initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch {
      // Bỏ qua lỗi lưu dữ liệu
    }
  }, [key, value]);

  return [value, setValue];
};