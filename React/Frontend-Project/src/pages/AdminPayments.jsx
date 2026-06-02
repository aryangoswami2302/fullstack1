import { useState, useEffect } from 'react';
import { fetchPayments as fetchPaymentsFromFirebase, fetchMembers as fetchMembersFromFirebase, fetchPlans as fetchPlansFromFirebase, createPayment, modifyPayment, removePayment } from '../services/firebaseService';
import { FaTrash, FaEdit, FaPlus, FaSpinner, FaSave, FaTimes, FaFilePdf, FaCheck, FaClock, FaPrint } from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewPayment, setPreviewPayment] = useState(null);

  const [formData, setFormData] = useState({
    memberId: '',
    memberUid: '',
    memberEmail: '',
    memberName: '',
    plan: '',
    planAmount: 0,
    quantity: 1,
    discount: 0,
    discountPercent: 0,
    gstPercent: 18,
    installments: 1,
    paymentStatus: 'Pending',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsData, membersData, plansData] = await Promise.all([
        fetchPaymentsFromFirebase(),
        fetchMembersFromFirebase(),
        fetchPlansFromFirebase()
      ]);
      setPayments(paymentsData);
      setMembers(membersData);
      setPlans(plansData);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    const baseAmount = (data.planAmount || 0) * (data.quantity || 1);
    const discountAmount = data.discountPercent ? (baseAmount * data.discountPercent) / 100 : (data.discount || 0);
    const afterDiscount = baseAmount - discountAmount;
    const gstAmount = (afterDiscount * (data.gstPercent || 18)) / 100;
    const totalAmount = afterDiscount + gstAmount;
    const installmentAmount = data.installments ? totalAmount / data.installments : totalAmount;

    return { baseAmount, discountAmount, afterDiscount, gstAmount, totalAmount, installmentAmount };
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    const member = members.find(m => m.id === memberId);
    const plan = plans.find(p => p.name === member?.plan);
    
    const planPrice = plan?.price?.replace(/\D/g, '') || 0;
    
    setFormData({
      ...formData,
      memberId,
      memberUid: member?.uid || member?.id || '',
      memberEmail: member?.email || '',
      memberName: member?.name || '',
      plan: member?.plan || '',
      planAmount: parseInt(planPrice) || 0
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.memberId) {
      toast.error('Please select a member');
      setIsSubmitting(false);
      return;
    }

    const totals = calculateTotals(formData);
    const billNumber = `BILL-${String(payments.length + 1).padStart(3, '0')}`;

    const payload = {
      ...formData,
      ...totals,
      paymentDate: new Date().toISOString().split('T')[0],
      billNumber: editingId ? payments.find(p => p.id === editingId)?.billNumber : billNumber,
      memberUid: formData.memberUid || formData.memberId,
      memberEmail: formData.memberEmail || '',
    };

    try {
      if (editingId) {
        await modifyPayment(editingId, payload);
        toast.success('Payment updated');
        setEditingId(null);
      } else {
        await createPayment(payload);
        toast.success('Payment added');
      }

      setFormData({
        memberId: '',
        memberUid: '',
        memberEmail: '',
        memberName: '',
        plan: '',
        planAmount: 0,
        quantity: 1,
        discount: 0,
        discountPercent: 0,
        gstPercent: 18,
        installments: 1,
        paymentStatus: 'Pending',
        notes: ''
      });

      fetchData();
    } catch (err) {
      toast.error('Failed to save payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (payment) => {
    setEditingId(payment.id);
    setFormData({
      memberId: payment.memberId || '',
      memberUid: payment.memberUid || payment.memberId || '',
      memberEmail: payment.memberEmail || '',
      memberName: payment.memberName || '',
      plan: payment.plan || '',
      planAmount: payment.planAmount || 0,
      quantity: payment.quantity || 1,
      discount: payment.discount || 0,
      discountPercent: payment.discountPercent || 0,
      gstPercent: payment.gstPercent || 18,
      installments: payment.installments || 1,
      paymentStatus: payment.paymentStatus || 'Pending',
      notes: payment.notes || ''
    });
    // Scroll smoothly to top form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this payment?')) {
      try {
        await removePayment(id);
        toast.success('Payment deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const generatePDF = (payment) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('GYM Pro', 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Invoice', 20, 30);
      
      // Bill details
      doc.setFontSize(12);
      doc.text(`Bill #: ${payment.billNumber || 'N/A'}`, 130, 30);
      doc.setFontSize(10);
      doc.text(`Date: ${payment.paymentDate || 'N/A'}`, 130, 40);

      // Member info
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${payment.memberName || 'Member'}`, 20, 65);
      doc.text(`Plan: ${payment.plan || 'Plan'}`, 20, 75);

      // Table
      autoTable(doc, {
        startY: 90,
        head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
        body: [
          [payment.plan || 'Plan', payment.quantity || 1, `Rs.${payment.planAmount || 0}`, `Rs.${((payment.planAmount || 0) * (payment.quantity || 1)).toFixed(2)}`],
          ['', '', '', ''],
          ['Plan Charges', '', '', `Rs.${(payment.baseAmount || 0).toFixed(2)}`],
          [`Discount (${payment.discountPercent || 0}%)`, '', '', `-Rs.${(payment.discountAmount || 0).toFixed(2)}`],
          ['After Discount', '', '', `Rs.${(payment.afterDiscount || 0).toFixed(2)}`],
          [`GST (${payment.gstPercent || 0}%)`, '', '', `Rs.${(payment.gstAmount || 0).toFixed(2)}`],
          ['', '', '', ''],
          ['Total Amount', '', '', `Rs.${(payment.totalAmount || 0).toFixed(2)}`],
          [`Per Installment (${payment.installments || 1})`, '', '', `Rs.${(payment.installmentAmount || 0).toFixed(2)}`]
        ]
      });

      // Safely get finalY
      let finalY = 150;
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY;
      } else if (doc.autoTable && doc.autoTable.previous && doc.autoTable.previous.finalY) {
        finalY = doc.autoTable.previous.finalY;
      }

      // Status
      doc.setFont('helvetica', 'bold');
      doc.text(`Status: ${payment.paymentStatus || 'Completed'}`, 20, finalY + 20);

      if (payment.notes) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Notes: ${payment.notes}`, 20, finalY + 30);
      }

      doc.save(`${payment.billNumber || 'invoice'}.pdf`);
      toast.success('PDF downloaded');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Check console.');
    }
  };

  const filteredPayments = payments.filter(p => 
    p.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.billNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totals = calculateTotals(formData);

  return (
    <PageWrapper className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-slate-900 to-slate-950 text-white p-10 shadow-2xl border border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_20%)]"></div>
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-200/80 mb-4">Financial Management</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
            Member Payments & Billing
          </h1>
          <p className="mt-4 max-w-2xl text-base text-blue-100/90">
            Manage payments with discounts, GST, installments, and generate professional PDF invoices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="card bg-gradient-to-br from-white to-slate-100 dark:from-admin-darkCard dark:to-slate-800 p-8 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {editingId ? 'Edit Payment' : 'Add Payment'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Member</label>
                <select
                  required
                  value={formData.memberId}
                  onChange={handleMemberChange}
                  className="input-field"
                >
                  <option value="">Select Member</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.plan})</option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                  <FaCheck className="mr-2" />
                  Base plan amount is automatically fetched from the member's plan details.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Base Price (₹)</label>
                  <input
                    type="number"
                    value={formData.planAmount}
                    onChange={(e) => setFormData({ ...formData, planAmount: parseInt(e.target.value) || 0 })}
                    className="input-field bg-gray-100 dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Qty (Months/Items)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">GST %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.gstPercent}
                    onChange={(e) => setFormData({ ...formData, gstPercent: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Installments</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="input-field"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="2"
                  className="input-field resize-none"
                  placeholder="Payment notes"
                />
              </div>

              {/* Summary */}
              <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Plan Charges:</span>
                  <span className="font-bold">₹{totals.baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₹{totals.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({formData.gstPercent}%):</span>
                  <span>₹{totals.gstAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{totals.totalAmount.toFixed(2)}</span>
                </div>
                {formData.installments > 1 && (
                  <div className="flex justify-between text-blue-600 dark:text-blue-400">
                    <span>Per Installment:</span>
                    <span>₹{totals.installmentAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-3 pt-4">
                <button
                  disabled={isSubmitting || !formData.memberId}
                  type="submit"
                  className="w-full py-3 text-white font-bold rounded-xl transition-all shadow-lg flex justify-center items-center bg-green-600 hover:bg-green-700 disabled:opacity-70"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : (editingId ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />)}
                  {editingId ? 'Update Payment' : 'Generate Invoice'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { setEditingId(null); setFormData({ memberId: '', memberName: '', plan: '', planAmount: 0, quantity: 1, discount: 0, discountPercent: 0, gstPercent: 18, installments: 1, paymentStatus: 'Pending', notes: '' }); }}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 flex justify-center items-center"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Payments List */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by member name or bill number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 text-blue-500">
              <FaSpinner className="animate-spin text-5xl opacity-50" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 max-h-[700px] overflow-y-auto">
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">{payment.memberName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{payment.billNumber} • {payment.paymentDate}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      payment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                      payment.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {payment.paymentStatus === 'Paid' ? <FaCheck /> : <FaClock />}
                      {payment.paymentStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div><span className="text-gray-600 dark:text-gray-400">Plan:</span> <span className="font-bold">{payment.plan}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Qty:</span> <span className="font-bold">{payment.quantity}</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">Discount:</span> <span className="font-bold text-red-600">-{payment.discountPercent}%</span></div>
                    <div><span className="text-gray-600 dark:text-gray-400">GST:</span> <span className="font-bold">+{payment.gstPercent}%</span></div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded mb-4">
                    <div className="flex justify-between font-bold text-lg mb-1">
                      <span>₹{payment.totalAmount.toFixed(2)}</span>
                      {payment.installments > 1 && <span className="text-sm font-normal text-gray-600">({payment.installments}x ₹{payment.installmentAmount.toFixed(2)})</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewPayment(payment)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 font-bold text-sm flex items-center justify-center gap-2 print:hidden"
                    >
                      <FaFilePdf /> Invoice
                    </button>
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100 font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200 font-bold text-sm flex items-center justify-center"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
              {filteredPayments.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-bold">No payments found</p>
                  <p className="text-sm">Create your first payment using the form</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {previewPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 print:p-0 print:bg-white print:static print:inset-auto">
          <div className="bg-white dark:bg-admin-darkCard w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:w-full print:block">
            
            {/* Modal Header (Hidden on Print) */}
            <div className="flex justify-between items-center p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 print:hidden">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Invoice Preview</h2>
              <button onClick={() => setPreviewPayment(null)} className="text-gray-500 hover:text-red-500">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Invoice Content */}
            <div className="p-8 overflow-y-auto print:overflow-visible print:p-0 text-gray-800 dark:text-gray-200 print:text-black">
              {/* Gym Header */}
              <div className="flex justify-between items-start mb-8 border-b pb-6 dark:border-gray-700 print:border-gray-300">
                <div>
                  <h1 className="text-3xl font-black text-blue-600 print:text-black">GYM Pro</h1>
                  <p className="text-sm mt-1">Premium Fitness Center</p>
                  <p className="text-sm text-gray-500 print:text-gray-600">123 Fitness Avenue, NY 10001</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-400 print:text-gray-800">INVOICE</h2>
                  <p className="font-bold mt-1">Bill #: {previewPayment.billNumber}</p>
                  <p className="text-sm">Date: {previewPayment.paymentDate}</p>
                  <p className="text-sm mt-2 font-bold">
                    Status: <span className={previewPayment.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}>{previewPayment.paymentStatus}</span>
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-500 mb-2 print:text-gray-800">BILL TO:</h3>
                <p className="font-bold text-lg">{previewPayment.memberName}</p>
                <p>Plan: {previewPayment.plan}</p>
              </div>

              {/* Table */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-blue-50 dark:bg-gray-800 print:bg-gray-100 text-left">
                    <th className="p-3 border-b dark:border-gray-700 print:border-gray-300 font-bold">Description</th>
                    <th className="p-3 border-b dark:border-gray-700 print:border-gray-300 font-bold text-center">Qty</th>
                    <th className="p-3 border-b dark:border-gray-700 print:border-gray-300 font-bold text-right">Unit Price</th>
                    <th className="p-3 border-b dark:border-gray-700 print:border-gray-300 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300">{previewPayment.plan} Plan</td>
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300 text-center">{previewPayment.quantity || 1}</td>
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300 text-right">₹{(previewPayment.planAmount || 0).toFixed(2)}</td>
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300 text-right">₹{(previewPayment.baseAmount || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{(previewPayment.baseAmount || 0).toFixed(2)}</span>
                  </div>
                  {previewPayment.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Discount ({previewPayment.discountPercent}%):</span>
                      <span>-₹{(previewPayment.discountAmount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  {previewPayment.discountPercent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>After Discount:</span>
                      <span>₹{(previewPayment.afterDiscount || 0).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>GST ({previewPayment.gstPercent || 0}%):</span>
                    <span>₹{(previewPayment.gstAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700 print:border-gray-300">
                    <span>Total Amount:</span>
                    <span className="text-blue-600 print:text-black">₹{(previewPayment.totalAmount || 0).toFixed(2)}</span>
                  </div>
                  {previewPayment.installments > 1 && (
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{previewPayment.installments} Installments of:</span>
                      <span>₹{(previewPayment.installmentAmount || 0).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {previewPayment.notes && (
                <div className="mb-4">
                  <h4 className="font-bold text-sm text-gray-500 print:text-gray-800">Notes:</h4>
                  <p className="text-sm">{previewPayment.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer (Hidden on Print) */}
            <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-4 print:hidden">
              <button 
                onClick={() => window.print()}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold flex items-center gap-2"
              >
                <FaPrint /> Print
              </button>
              <button 
                onClick={() => generatePDF(previewPayment)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold flex items-center gap-2"
              >
                <FaFilePdf /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </PageWrapper>
  );
};

export default AdminPayments;
