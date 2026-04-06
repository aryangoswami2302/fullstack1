import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMembers, addMember, deleteMemberAsync, updateMemberStatusAsync, updateMemberAsync, setFilter } from '../store/membersSlice';
import { FaTrash, FaPen, FaFilter, FaPlus, FaUsers, FaCheckCircle, FaExclamationCircle, FaFilePdf, FaFileExcel, FaAngleLeft, FaAngleRight, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import PageWrapper from '../components/PageWrapper';

const AdminDashboard = () => {
  const { list: members, filter, loading } = useSelector((state) => state.members);
  const dispatch = useDispatch();

  const [newMember, setNewMember] = useState({
    name: '',
    age: '',
    plan: 'Basic',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.age) return;
    try {
      if (editingId) {
        await dispatch(updateMemberAsync({ id: editingId, member: newMember })).unwrap();
        toast.success('Member updated successfully!');
        setEditingId(null);
      } else {
        await dispatch(addMember(newMember)).unwrap();
        toast.success('Member added successfully!');
      }
      setNewMember({ name: '', age: '', plan: 'Basic', joinDate: new Date().toISOString().split('T')[0], status: 'Active' });
    } catch (err) {
      toast.error(editingId ? 'Failed to update member' : 'Failed to add member');
    }
  };

  const handleEditClick = (member) => {
    setEditingId(member.id);
    setNewMember({
      name: member.name,
      age: member.age,
      plan: member.plan,
      joinDate: member.joinDate,
      status: member.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await dispatch(updateMemberStatusAsync({ id: member.id, status: newStatus, member })).unwrap();
      toast.success(`Member status changed to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await dispatch(deleteMemberAsync(id)).unwrap();
        toast.success('Member deleted successfully');
      } catch (err) {
        toast.error('Failed to delete member');
      }
    }
  };

  // Export functions
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Members Roster", 20, 10);
    doc.autoTable({
      head: [['Name', 'Age', 'Plan', 'Join Date', 'Status']],
      body: members.map(m => [m.name, m.age, m.plan, m.joinDate, m.status]),
    });
    doc.save("members.pdf");
    toast.success('Exported to PDF');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(members.map(m => ({
      Name: m.name, Age: m.age, Plan: m.plan, "Join Date": m.joinDate, Status: m.status
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Members");
    XLSX.writeFile(wb, "members.xlsx");
    toast.success('Exported to Excel');
  };

  // Searching, Filtering, Pagination
  const searchedMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  const filteredMembers = searchedMembers.filter(m => {
    if (filter === 'All') return true;
    return m.status === filter;
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const currentMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const inactiveMembers = members.filter(m => m.status === 'Inactive').length;

  const chartData = [
    { name: 'Active', value: activeMembers },
    { name: 'Inactive', value: inactiveMembers }
  ];
  const COLORS = ['#10B981', '#EF4444'];

  return (
    <PageWrapper className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Cards remain same but chart added */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card flex items-center justify-between border-l-4 border-blue-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{totalMembers}</p>
            </div>
            <FaUsers className="text-4xl text-blue-100 dark:text-blue-900/30" />
          </div>
          <div className="card flex items-center justify-between border-l-4 border-green-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeMembers}</p>
            </div>
            <FaCheckCircle className="text-4xl text-green-100 dark:text-green-900/30" />
          </div>
          <div className="card flex items-center justify-between border-l-4 border-red-500">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Inactive Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{inactiveMembers}</p>
            </div>
            <FaExclamationCircle className="text-4xl text-red-100 dark:text-red-900/30" />
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center p-2 border border-gray-100 dark:border-gray-800">
           <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Member Status</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
              {editingId ? <FaPen className="mr-2 text-blue-500 text-sm" /> : <FaPlus className="mr-2 text-blue-500 text-sm" />} 
              {editingId ? 'Edit Member' : 'Add Member'}
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input required type="text" className="input-field" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                <input required type="number" min="1" className="input-field" value={newMember.age} onChange={e => setNewMember({...newMember, age: e.target.value})} placeholder="Age" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plan</label>
                <select className="input-field" value={newMember.plan} onChange={e => setNewMember({...newMember, plan: e.target.value})}>
                  <option value="Basic">Basic</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select className="input-field" value={newMember.status} onChange={e => setNewMember({...newMember, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button disabled={loading} type="submit" className="w-full btn-primary mt-2 flex justify-center items-center">
                {loading ? 'Processing...' : (editingId ? 'Update Member' : 'Add New Member')}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setNewMember({ name: '', age: '', plan: 'Basic', joinDate: new Date().toISOString().split('T')[0], status: 'Active' });
                  }} 
                  className="w-full mt-2 py-2 px-4 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition flex justify-center items-center"
                >
                  <FaTimes className="mr-2" /> Cancel Edit
                </button>
              )}
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card overflow-hidden h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaUsers className="mr-2 text-blue-500" /> Member Roster
              </h2>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Search name..." 
                  className="input-field py-1.5 px-3 min-w-[140px] text-sm"
                  value={search}
                  onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                />
                <select 
                  className="input-field py-1.5 px-2 text-sm max-w-[120px]"
                  value={filter} 
                  onChange={(e) => {dispatch(setFilter(e.target.value)); setCurrentPage(1);}}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="flex space-x-1 pl-2 border-l dark:border-gray-700">
                  <button onClick={exportPDF} title="Export PDF" className="p-2 border dark:border-gray-600 rounded text-red-500 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700 transition"><FaFilePdf /></button>
                  <button onClick={exportExcel} title="Export Excel" className="p-2 border dark:border-gray-600 rounded text-green-600 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 transition"><FaFileExcel /></button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto flex-grow min-h-[300px]">
              {loading && members.length === 0 ? (
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
                    <th className="pb-3 px-4 font-semibold">Member Details</th>
                    <th className="pb-3 px-4 font-semibold">Plan</th>
                    <th className="pb-3 px-4 font-semibold">Join Date</th>
                    <th className="pb-3 px-4 font-semibold">Status</th>
                    <th className="pb-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                  {currentMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{member.age} years old</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 py-1 px-3 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
                          {member.plan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                        {member.joinDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border
                          ${member.status === 'Active' 
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' 
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex justify-end space-x-2">
                        <button 
                          onClick={() => handleToggleStatus(member)}
                          className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
                          title="Toggle Status"
                        >
                          <FaCheckCircle className="text-xs" />
                        </button>
                        <button 
                          onClick={() => handleEditClick(member)}
                          className="p-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded transition-colors"
                          title="Edit Member"
                        >
                          <FaPen className="text-xs" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded transition-colors"
                          title="Delete Member"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentMembers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/20 rounded-lg">
                        {search ? `No members found matching "${search}"` : "No members found."}
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length}
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
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
