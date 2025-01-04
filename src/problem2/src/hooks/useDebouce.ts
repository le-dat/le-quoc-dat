/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

/**
 * useDebounce - Delays the update of a value until after a specified delay time has passed since the last change.
 *
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounceValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(handler); // Cleanup the timeout if value or delay changes
    };
  }, [value, delay]);

  return debouncedValue;
};



