import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FaTrash, FaEdit, FaPlus, FaSpinner, FaSave, FaTimes } from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    tag: '',
    features: ''
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api.getPlans();
      setPlans(data);
      setError(null);
    } catch (err) {
      setError('Failed to load plans. Is the JSON server running?');
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (plan) => {
    setEditingId(plan.id);
    setFormData({
      name: plan.name,
      price: plan.price,
      tag: plan.tag || '',
      features: plan.features.join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      try {
        await api.deletePlan(id);
        toast.success("Plan deleted successfully");
        fetchPlans();
      } catch (err) {
        toast.error('Failed to delete the plan');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Parse comma-separated features into an array and trim whitespace
    const parsedFeatures = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
    
    const payload = {
      name: formData.name,
      price: formData.price,
      tag: formData.tag,
      features: parsedFeatures
    };

    try {
      if (editingId) {
        await api.updatePlan(editingId, payload);
        toast.success("Plan updated successfully");
        setEditingId(null);
      } else {
        await api.createPlan(payload);
        toast.success("New plan created successfully");
      }
      setFormData({ name: '', price: '', tag: '', features: '' });
      fetchPlans();
    } catch (err) {
      toast.error('Failed to save the plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', tag: '', features: '' });
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin <span className="text-blue-600">Plans Management</span></h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="card bg-white dark:bg-admin-darkCard p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 sticky top-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800 dark:text-white">
              {editingId ? <><FaEdit className="mr-3 text-blue-500" /> Edit Plan</> : <><FaPlus className="mr-3 text-blue-500" /> Add New Plan</>}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Plan Name</label>
                <input required name="name" type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 focus:bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" value={formData.name} onChange={handleInputChange} placeholder="e.g., Diamond VIP" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Price (/mo or /yr)</label>
                <input required name="price" type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 focus:bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" value={formData.price} onChange={handleInputChange} placeholder="e.g., $120" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Tag (Optional)</label>
                <input name="tag" type="text" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 focus:bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all" value={formData.tag} onChange={handleInputChange} placeholder="e.g., Best Value" />
              </div>
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Features</label>
                <p className="text-xs text-gray-500 mb-2">Comma-separated list</p>
                <textarea required name="features" rows="4" className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 focus:bg-white dark:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all resize-none" value={formData.features} onChange={handleInputChange} placeholder="Pool access, unlimited classes, personal locker" />
              </div>
              
              <div className="flex flex-col space-y-3 pt-4">
                <button disabled={isSubmitting} type="submit" className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-lg flex justify-center items-center ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} disabled:opacity-70 disabled:hover:scale-100`}>
                  {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : (editingId ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />)}
                  {editingId ? 'Update Plan' : 'Create Plan'}
                </button>
                {editingId && (
                  <button type="button" onClick={cancelEdit} className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex justify-center items-center">
                    <FaTimes className="mr-2" /> Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* List Section */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-64 text-blue-500 bg-white dark:bg-admin-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <FaSpinner className="animate-spin text-5xl opacity-50" />
            </div>
          ) : (
            <div className="bg-white dark:bg-admin-darkCard overflow-hidden rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 relative min-h-[500px]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider font-bold">
                      <th className="p-5">Name</th>
                      <th className="p-5">Price</th>
                      <th className="p-5">Features Count</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-base">
                    {plans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-blue-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                        <td className="p-5 flex flex-col items-start min-w-[200px]">
                          <span className="font-extrabold text-gray-900 dark:text-white text-lg">{plan.name}</span>
                          {plan.tag && <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs uppercase font-bold mt-2 inline-block border border-blue-200 dark:border-blue-800/50">{plan.tag}</span>}
                        </td>
                        <td className="p-5 font-bold text-gray-700 dark:text-gray-300 min-w-[120px]">
                          {plan.price}
                        </td>
                        <td className="p-5 text-gray-500 dark:text-gray-400 font-medium">
                          {plan.features?.length || 0} features
                        </td>
                        <td className="p-5">
                          <div className="flex justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(plan)}
                              className="bg-blue-50 text-blue-600 p-2.5 rounded-lg hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm"
                              title="Edit Plan"
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDelete(plan.id)}
                              className="bg-red-50 text-red-600 p-2.5 rounded-lg hover:bg-red-600 hover:text-white dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
                              title="Delete Plan"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {plans.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-16 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20">
                          <p className="text-xl font-bold mb-2">No plans available.</p>
                          <p className="text-sm">Use the form on the left to add your first membership plan.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminPlans;
