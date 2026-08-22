import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaHeartBroken } from 'react-icons/fa';
import { useFavorites } from '../../context/FavoritesContext';
import { assetUrl } from '../../api/catalog';
import './FavoritesPage.css';

const FavoritesPage = () => {
	const { favorites, toggleFavorite, loading, error, pendingIds } = useFavorites();
	const totalItems = favorites.length;
	const estimatedValue = favorites.reduce(
		(total, item) => total + (Number(item.price) || 0),
		0
	);

	return (
		<div className="favorites-page-wrapper">
			<div className="favorites-page-header">
				<div className="favorites-header-content">
					<Link to="/cards" className="back-to-shop">
						<FaArrowLeft /> Back to Shop
					</Link>
					<h1>My Favorites</h1>
					<p>{totalItems} Items saved</p>
				</div>
			</div>

			<div className="favorites-container">
				<div className="favorites-items-section">
					{loading ? (
						<div className="empty-favorites">
							<p>Loading your favorites...</p>
						</div>
					) : error ? (
						<div className="empty-favorites">
							<p>{error}</p>
						</div>
					) : favorites.length === 0 ? (
						<div className="empty-favorites">
							<FaHeartBroken className="empty-fav-icon" />
							<h3>No favorites yet</h3>
							<p>Start adding cards you love to your favorites list.</p>
							<Link to="/cards" className="shop-now-btn">Browse Cards</Link>
						</div>
					) : (
						favorites.map((item) => {
							const cardId = item.card_id;
							const title = item.title || 'Favorite card';
							const isPending = pendingIds.has(cardId);

							return (
								<div className="favorite-item-card" key={item.id || cardId}>
									<div className="favorite-item-image">
										{item.thumbnail && (
											<img src={assetUrl(item.thumbnail)} alt={title} />
										)}
									</div>

									<div className="favorite-item-details">
										<div className="fav-item-header">
											<h4>{title}</h4>
										</div>
										<p className="item-price">
											{item.is_free ? 'Free' : `$${(Number(item.price) || 0).toFixed(2)}`}
										</p>

										<div className="fav-item-actions">
											<Link to={`/product/${cardId}`} className="view-product-btn">
												View Card
											</Link>
											<button
												className="remove-fav-btn"
												type="button"
												onClick={() => toggleFavorite(cardId)}
												disabled={isPending}
											>
												<FaHeartBroken /> {isPending ? 'Removing...' : 'Unfavorite'}
											</button>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				<div className="favorites-summary-section">
					<div className="summary-card">
						<h3>Favorites Summary</h3>
						<div className="summary-row">
							<span>Total Saved Cards</span>
							<span>{totalItems} items</span>
						</div>
						<div className="summary-row">
							<span>Estimated Value</span>
							<span>${estimatedValue.toFixed(2)}</span>
						</div>
						<div className="summary-divider"></div>
						<div className="secure-badge">
							<span>❤️ Saved items are synced to your account</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FavoritesPage;
