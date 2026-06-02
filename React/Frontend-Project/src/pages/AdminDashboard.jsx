import { useState } from 'react';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { FaTrash, FaPen, FaFilter, FaUsers, FaCheckCircle, FaExclamationCircle, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { users, loading, deleteUser, updateUserPlan } = useAdminUsers();
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Searching & Filtering
  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (u.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesPlan = filterPlan === 'All' ? true : u.plan === filterPlan;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Stats
  const totalMembers = users.length;
  const activeMembers = users.filter(u => u.plan !== 'none' && u.plan !== undefined).length;
  const inactiveMembers = totalMembers - activeMembers;

  const chartData = [
    { name: 'Active Plans', value: activeMembers },
    { name: 'No Plan', value: inactiveMembers }
  ];
  const COLORS = ['#10B981', '#EF4444'];

  const handlePlanChange = (userId, newPlan) => {
    updateUserPlan(userId, newPlan);
  };

  return (
    <PageWrapper className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center justify-between border-l-4 border-blue-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalMembers}</p>
            </div>
            <FaUsers className="text-4xl text-blue-100 dark:text-blue-900/30" />
          </div>
          <div className="card flex items-center justify-between border-l-4 border-green-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Plans</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeMembers}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-100 dark:text-green-900/30" />
          </div>
          <div className="card flex items-center justify-between border-l-4 border-red-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No Plan / Inactive</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{inactiveMembers}</p>
            </div>
            <FaExclamationCircle className="text-4xl text-red-100 dark:text-red-900/30" />
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center p-2 border border-gray-100 dark:border-gray-800">
           <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Plan Distribution</h3>
           <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#333', color: '#fff' }} itemStyle={{ color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaUsers className="mr-2 text-blue-500" /> User Database
          </h2>
          
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              placeholder="Search name or email..." 
              className="input-field py-1.5 px-3 min-w-[200px] text-sm"
              value={search}
              onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
            />
            <select 
              className="input-field py-1.5 px-2 text-sm max-w-[140px]"
              value={filterPlan} 
              onChange={(e) => {setFilterPlan(e.target.value); setCurrentPage(1);}}
            >
              <option value="All">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="space-y-4 animate-pulse pt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between items-center border-b dark:border-gray-800 pb-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/12"></div>
                </div>
              ))}
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 px-4 font-semibold">User Details</th>
                <th className="pb-3 px-4 font-semibold">Email</th>
                <th className="pb-3 px-4 font-semibold">Role</th>
                <th className="pb-3 px-4 font-semibold">Plan</th>
                <th className="pb-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-gray-900 dark:text-white">{u.name || 'Unnamed User'}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                    {u.email}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border
                      ${u.isAdmin 
                        ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800' 
                        : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                      {u.isAdmin ? 'Admin' : 'Member'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select 
                      value={u.plan || 'none'} 
                      onChange={(e) => handlePlanChange(u.id, e.target.value)}
                      className="text-sm border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                      disabled={u.isAdmin} // Prevent changing admin's plan to avoid accidental demotions
                    >
                      <option value="none">None</option>
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 flex justify-end space-x-2">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      disabled={u.isAdmin} // Prevent deleting other admins
                      className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded transition-colors disabled:opacity-50"
                      title={u.isAdmin ? "Cannot delete an admin" : "Delete User"}
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                    {search ? `No users found matching "${search}"` : "No users found in database."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
            </span>
            <div className="flex space-x-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="p-1.5 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                <FaAngleLeft className="text-lg" />
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="p-1.5 border dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition"
              >
                <FaAngleRight className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
