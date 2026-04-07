import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, deleteProduct } from '../features/products/productSlice';
import { FiEdit2, FiTrash2, FiGrid, FiList } from 'react-icons/fi';

const ProductList = ({ onEdit }) => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const filteredProducts = items.filter(product => 
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-container">
      <div className="list-toolbar">
        <div className="search-container no-margin">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by Product Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
            title="Card View"
          >
            <FiGrid />
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <FiList />
          </button>
        </div>
      </div>

      {status === 'loading' && <div className="loading-indicator">Loading products...</div>}
      {status === 'failed' && <div className="error-indicator">Error: {error}</div>}

      {filteredProducts.length === 0 && status === 'succeeded' ? (
        <div className="empty-state glass-panel">
          <h3>No records found</h3>
          <p>Try adjusting your search or add a new product.</p>
        </div>
      ) : (
        <>
          {viewMode === 'card' ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="card-image-box">
                    <img 
                      src={product.Photo || 'https://via.placeholder.com/300?text=No+Image'} 
                      alt={product.ProductName} 
                      onError={(e) => {e.target.src = 'https://via.placeholder.com/300?text=Error'}}
                    />
                  </div>
                  <div className="product-info">
                    <h3>{product.ProductName}</h3>
                    
                    <div className="product-price">
                      ${product.OfferPrice || product.Price} 
                      {product.OfferPrice && <span className="original-price">${product.Price}</span>}
                    </div>
                    
                    <div className="product-meta">
                      <span>Qty: {product.Qty}</span>
                      <span>Date: {product.added_date}</span>
                    </div>
                    
                    <div className="product-actions">
                      <button className="btn-icon" onClick={() => onEdit(product)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className="btn-icon danger" onClick={() => handleDelete(product.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="table-wrapper glass-panel">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img 
                          src={product.Photo || 'https://via.placeholder.com/50?text=img'} 
                          alt="thumb" 
                          className="table-thumb"
                          onError={(e) => {e.target.src = 'https://via.placeholder.com/50?text=img'}} 
                        />
                      </td>
                      <td className="bold-cell">{product.ProductName}</td>
                      <td>
                        <span className="highlight-price">${product.OfferPrice || product.Price}</span>
                      </td>
                      <td>{product.Qty}</td>
                      <td>{product.added_date}</td>
                      <td>
                         <div className="table-actions">
                          <button className="btn-icon" onClick={() => onEdit(product)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className="btn-icon danger" onClick={() => handleDelete(product.id)} title="Delete">
                            <FiTrash2 />
                          </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
