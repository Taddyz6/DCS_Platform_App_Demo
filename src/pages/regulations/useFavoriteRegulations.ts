import { useEffect, useState } from 'react';
import { readJsonStorage, writeJsonStorage } from '@/utils/localStorage';

const STORAGE_KEY = 'dcs-favorite-regulations';

export function useFavoriteRegulations() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readJsonStorage<string[]>(STORAGE_KEY, []));
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      writeJsonStorage(STORAGE_KEY, next);
      return next;
    });
  };

  return {
    favorites,
    isFavorite: (id: string) => favorites.includes(id),
    toggleFavorite,
  };
}
