import { useState, useCallback, useTransition } from "react";

export const useNotification = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const showNotification = useCallback((message: string) => {
    startTransition(() => {
      setNotification(message);
      setTimeout(() => setNotification(null), 5000);
    });
  }, []);

  const showError = useCallback((message: string) => {
    startTransition(() => {
      setError(message);
      setTimeout(() => setError(null), 5000);
    });
  }, []);

  return {
    notification,
    error,
    isPending,
    showNotification,
    showError,
  };
};
