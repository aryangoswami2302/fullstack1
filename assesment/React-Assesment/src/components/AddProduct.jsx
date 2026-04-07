import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct, updateProduct } from '../features/products/productSlice';
import { v4 as uuidv4 } from 'uuid';

const AddProduct = ({ editingProduct, onClearEdit }) => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    ProductName: '',
    Price: '',
    OfferPrice: '',
    Photo: '',
    Qty: '',
    Description: '',
    added_date: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const resetForm = () => {
    setFormData({
      ProductName: '',
      Price: '',
      OfferPrice: '',
      Photo: '',
      Qty: '',
      Description: '',
      added_date: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ProductName || !formData.Price) {
      alert("Product Name and Price are required.");
      return;
    }

    if (editingProduct) {
      dispatch(updateProduct(formData));
      onClearEdit();
    } else {
      const newProduct = { ...formData, id: uuidv4() };
      dispatch(addProduct(newProduct));
      resetForm();
    }
  };

  return (
    <div className="glass-panel">
      <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input 
            type="text" 
            name="ProductName" 
            value={formData.ProductName} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Wireless Mouse"
          />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Price ($)</label>
            <input 
              type="number" 
              name="Price" 
              value={formData.Price} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Offer Price ($)</label>
            <input 
              type="number" 
              name="OfferPrice" 
              value={formData.OfferPrice} 
              onChange={handleChange} 
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Photo URL</label>
          <input 
            type="url" 
            name="Photo" 
            value={formData.Photo} 
            onChange={handleChange} 
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Quantity</label>
            <input 
              type="number" 
              name="Qty" 
              value={formData.Qty} 
              onChange={handleChange} 
              required 
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Added Date</label>
            <input 
              type="date" 
              name="added_date" 
              value={formData.added_date} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="Description" 
            value={formData.Description} 
            onChange={handleChange} 
            rows="3"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingProduct ? 'Update Product' : 'Save Product'}
          </button>
          {editingProduct && (
            <button type="button" className="btn btn-outline" onClick={onClearEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
