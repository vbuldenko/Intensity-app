import { RefObject, useEffect, useCallback } from "react";

/**
 * Hook that detects clicks outside of a specified element
 * @param ref - Reference to the element to monitor
 * @param callback - Function to call when a click outside occurs
 * @param enabled - Optional flag to enable/disable the hook
 */
export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  enabled: boolean = true
): void => {
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent) => {
      // Early return if the ref or current element doesn't exist
      if (!ref?.current) return;

      // Check if click target is inside the referenced element
      const clickedOutside = !ref.current.contains(event.target as Node);

      if (clickedOutside) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    // Don't attach listeners if the hook is disabled
    if (!enabled) return;

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    // Clean up event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handleClickOutside, enabled]);
};

export default useClickOutside;
