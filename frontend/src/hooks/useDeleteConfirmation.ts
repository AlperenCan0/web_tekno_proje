import { useCallback } from 'react';

/**
 * useDeleteConfirmation Hook - Silme işlemleri için onay dialog'u
 * Tekrarlanan window.confirm kodlarını reusable hale getirir
 */
export const useDeleteConfirmation = () => {
  const confirmDelete = useCallback((
    onConfirm: () => void | Promise<void>,
    message: string = 'Bu öğeyi silmek istediğinize emin misiniz?',
  ) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  }, []);

  return { confirmDelete };
};

