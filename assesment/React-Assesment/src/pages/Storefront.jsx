import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { FiShoppingCart } from 'react-icons/fi';

const Storefront = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div className="loading-state">Loading catalog...</div>;
  if (status === 'failed') return <div className="error-state">Error loading products: {error}</div>;

  return (
    <div className="storefront-page">
      <header className="page-header store-header">
        <h2>Latest Arrivals</h2>
        <p>Premium products imported for you. Buy now and enjoy huge offers!</p>
      </header>

      <div className="store-grid">
        {items.length === 0 ? (
          <div className="empty-state">
            <h3>No products available yet.</h3>
          </div>
        ) : (
          items.map((product) => (
            <div key={product.id} className="store-card glass-panel">
              <div className="img-wrapper">
                <img 
                  src={product.Photo || 'https://via.placeholder.com/400?text=Premium'} 
                  alt={product.ProductName} 
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/400?text=Premium'}}
                />
                {product.OfferPrice && product.OfferPrice < product.Price && (
                  <span className="badge">Sale</span>
                )}
              </div>
              <div className="store-card-body">
                <h3>{product.ProductName}</h3>
                <p className="desc">{product.Description || 'High quality premium item.'}</p>
                <div className="price-row">
                  <span className="current-price">${product.OfferPrice || product.Price}</span>
                  {product.OfferPrice && <span className="old-price">${product.Price}</span>}
                </div>
                <button className="btn btn-primary buy-btn">
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Storefront;
