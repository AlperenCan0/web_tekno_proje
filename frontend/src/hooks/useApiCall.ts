import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * useApiCall Hook - API çağrıları için reusable hook
 * Loading state ve error handling'i merkezi olarak yönetir
 */
export const useApiCall = <T,>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<T>,
    options?: {
      successMessage?: string | ((data: T) => string);
      errorMessage?: string;
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      showToast?: boolean;
    },
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall();
      
      if (options?.successMessage) {
        const message = typeof options.successMessage === 'function' 
          ? options.successMessage(data) 
          : options.successMessage;
        toast.success(message);
      }
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (err: any) {
      const errorMessage = options?.errorMessage || err.response?.data?.message || 'Bir hata oluştu';
      const error = new Error(errorMessage);
      
      setError(error);
      
      if (options?.showToast !== false) {
        toast.error(errorMessage);
      }
      
      if (options?.onError) {
        options.onError(error);
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { execute, isLoading, error };
};

