import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../dataModel/userResponse';

type FavoriteContextType = {
  favorites: User[];
  toggleFavorite: (user: User) => void;
  isFavorite: (userId: number) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);


export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<User[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const json = await AsyncStorage.getItem('favorites');
      if (json) setFavorites(JSON.parse(json));
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (user: User) => {
    setFavorites(prev => {
      const exists = prev.find(u => u.id === user.id);
      return exists ? prev.filter(u => u.id !== user.id) : [...prev, user];
    });
  };

  const isFavorite = (userId: number) => favorites.some(u => u.id === userId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
    
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error('useFavorites must be used within FavoriteProvider');
  return context;
};
