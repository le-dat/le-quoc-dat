import { useEffect } from "react";

/**
 * useClickOutside - A custom hook that triggers a callback when a click is detected outside of the specified element.
 *
 * @param ref The ref of the element to detect clicks outside of.
 * @param callback The callback function to execute when a click outside is detected.
 */
const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;