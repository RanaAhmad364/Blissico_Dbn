import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingIds, setPendingIds] = useState(() => new Set());

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setFavorites([]);
      setFavoriteIds(new Set());
      setError('');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError('');
    api.get('/api/favorites')
      .then((response) => {
        if (!cancelled) {
          const nextFavorites = response.data.data || [];
          setFavorites(nextFavorites);
          setFavoriteIds(new Set(nextFavorites.map((favorite) => favorite.card_id)));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Could not load your favorites. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const isFavorite = (cardId) => favoriteIds.has(cardId);

  const toggleFavorite = async (cardId) => {
    if (!user) {
      navigate('/login');
      return false;
    }
    if (pendingIds.has(cardId)) return false;

    const wasFavorite = favoriteIds.has(cardId);
    const previousFavorites = favorites;
    const previousFavoriteIds = favoriteIds;
    const nextFavorites = wasFavorite
      ? favorites.filter((favorite) => favorite.card_id !== cardId)
      : [...favorites, { card_id: cardId }];
    const nextFavoriteIds = new Set(favoriteIds);
    if (wasFavorite) nextFavoriteIds.delete(cardId);
    else nextFavoriteIds.add(cardId);

    setPendingIds((previous) => new Set(previous).add(cardId));
    setFavorites(nextFavorites);
    setFavoriteIds(nextFavoriteIds);
    setError('');

    try {
      if (wasFavorite) {
        await api.delete(`/api/cards/${cardId}/favorite`);
      } else {
        await api.post(`/api/cards/${cardId}/favorite`);
      }
      return true;
    } catch (requestError) {
      setFavorites(previousFavorites);
      setFavoriteIds(previousFavoriteIds);
      setError(requestError.response?.data?.message || 'Could not update your favorites. Please try again.');
      return false;
    } finally {
      setPendingIds((previous) => {
        const next = new Set(previous);
        next.delete(cardId);
        return next;
      });
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        favoritesCount: favorites.length,
        loading,
        error,
        pendingIds,
        clearError: () => setError(''),
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
