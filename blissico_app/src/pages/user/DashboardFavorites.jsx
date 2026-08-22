import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { assetUrl } from '../../api/catalog';
import UserLayout from '../../components/user/UserLayout';
import './DashboardFavorites.css';

const DashboardFavorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { favorites, favoritesCount, loading, toggleFavorite, pendingIds } = useFavorites();

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  if (authLoading || !user) {
    return (
      <UserLayout>
        <div className="dashboard-favorites-loading">
          <div className="user-loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <section className="dashboard-favorites-page">
        <div className="dashboard-favorites-header">
          <div>
            <h2>My Favorites ({favoritesCount})</h2>
            <p>Cards you have saved for later.</p>
          </div>
          <Link to="/cards" className="dashboard-favorites-browse-link">Browse Cards</Link>
        </div>

        {loading ? (
          <div className="dashboard-favorites-grid" aria-label="Loading favorites">
            {[1, 2, 3, 4].map((item) => (
              <div className="dashboard-favorite-skeleton" key={item}>
                <div className="dashboard-favorite-skeleton-image"></div>
                <div className="dashboard-favorite-skeleton-line"></div>
                <div className="dashboard-favorite-skeleton-short-line"></div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="dashboard-favorites-empty">
            <FaHeartBroken className="dashboard-favorites-empty-icon" />
            <h3>You haven't favorited any cards yet</h3>
            <p>Browse our collection and save the designs you love.</p>
            <Link to="/cards" className="dashboard-favorites-browse-button">Browse Cards</Link>
          </div>
        ) : (
          <div className="dashboard-favorites-grid">
            {favorites.map((favorite) => {
              const title = favorite.title || 'Favorite card';
              const isPending = pendingIds.has(favorite.card_id);

              return (
                <article className="dashboard-favorite-card" key={favorite.id || favorite.card_id}>
                  <Link to={`/product/${favorite.card_id}`} className="dashboard-favorite-card-link">
                    <div className="dashboard-favorite-image-wrap">
                      {favorite.thumbnail ? (
                        <img
                          src={assetUrl(favorite.thumbnail)}
                          alt={title}
                          className="dashboard-favorite-image"
                        />
                      ) : (
                        <div className="dashboard-favorite-image-placeholder" />
                      )}
                    </div>
                    <div className="dashboard-favorite-card-info">
                      <h3>{title}</h3>
                      <span className={favorite.is_free ? 'dashboard-favorite-free' : 'dashboard-favorite-price'}>
                        {favorite.is_free ? 'Free' : `$${(Number(favorite.price) || 0).toFixed(2)}`}
                      </span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    className="dashboard-favorite-remove"
                    aria-label={`Remove ${title} from favorites`}
                    onClick={() => toggleFavorite(favorite.card_id)}
                    disabled={isPending}
                  >
                    <FaHeart />
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </UserLayout>
  );
};

export default DashboardFavorites;
