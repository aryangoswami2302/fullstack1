import { useState } from 'react';
import AddProduct from '../components/AddProduct';
import ProductList from '../components/ProductList';

const AdminDashboard = () => {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleClearEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <header className="page-header">
        <h2>System Control Panel</h2>
        <p>Manage store inventory, edit items, and oversee additions.</p>
      </header>

      <div className="dashboard-layout">
        <aside>
          <AddProduct 
            editingProduct={editingProduct} 
            onClearEdit={handleClearEdit} 
          />
        </aside>
        
        <section>
          <ProductList onEdit={handleEdit} />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
