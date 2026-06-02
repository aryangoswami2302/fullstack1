import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaFilePdf, FaSpinner, FaDownload, FaTimes, FaPrint } from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { fetchPayments as fetchPaymentsFromFirebase } from '../services/firebaseService';

const MemberBilling = () => {
  const { user } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewPayment, setPreviewPayment] = useState(null);

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const allPayments = await fetchPaymentsFromFirebase();
      
      const normalizedUserId = user?.uid || user?.id;
      const normalizedEmail = user?.email?.toLowerCase();

      // Filter payments for current member (Admins see all for testing)
      const memberPayments = user?.role === 'admin'
        ? allPayments
        : allPayments.filter(p => {
            const paymentMemberId = p.memberId || p.userId || p.uid || p.memberUid;
            const paymentEmail = p.memberEmail?.toLowerCase();
            return (
              paymentMemberId === normalizedUserId ||
              paymentEmail === normalizedEmail ||
              p.memberName?.toLowerCase() === user?.name?.toLowerCase()
            );
          });
      
      setPayments(memberPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      toast.error('Failed to load billing information');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => `₹${Number(value || 0).toFixed(2)}`;

  const generatePDF = (payment) => {
    try {
      const doc = new jsPDF();
      
      // Add Gym Logo/Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(0, 102, 204);
      doc.text('GYM Pro', 20, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont('helvetica', 'normal');
      doc.text('123 Fitness Street', 20, 28);
      doc.text('Healthy City, HC 12345', 20, 33);
      doc.text('Phone: (555) 123-4567', 20, 38);

      // Invoice Details
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('INVOICE', 20, 48);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Bill Number: ${payment.billNumber || 'N/A'}`, 140, 48);
      doc.text(`Date: ${payment.paymentDate || 'N/A'}`, 140, 55);

      // Bill to section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('BILL TO:', 20, 68);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Member Name: ${payment.memberName || 'Member'}`, 20, 76);
      doc.text(`Membership Plan: ${payment.plan || 'Plan'}`, 20, 83);
      doc.text(`Status: ${payment.paymentStatus || 'Paid'}`, 20, 90);

      // Items table
      autoTable(doc, {
        startY: 100,
        head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
        body: [
          [(payment.plan || 'Plan') + ' Plan', payment.quantity || 1, `Rs.${(payment.planAmount || 0).toFixed(2)}`, `Rs.${(payment.baseAmount || 0).toFixed(2)}`],
          ['', '', '', ''],
          ['Plan Charges', '', '', `Rs.${(payment.baseAmount || 0).toFixed(2)}`],
          [`Discount (${payment.discountPercent || 0}%)`, '', '', `-Rs.${(payment.discountAmount || 0).toFixed(2)}`],
          ['After Discount', '', '', `Rs.${(payment.afterDiscount || 0).toFixed(2)}`],
          [`GST (${payment.gstPercent || 0}%)`, '', '', `Rs.${(payment.gstAmount || 0).toFixed(2)}`],
          ['', '', '', ''],
          ['TOTAL AMOUNT', '', '', `Rs.${(payment.totalAmount || 0).toFixed(2)}`],
        ],
        headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        styles: { fontSize: 10 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } }
      });

      let finalY = 160;
      if (doc.lastAutoTable && doc.lastAutoTable.finalY) {
        finalY = doc.lastAutoTable.finalY + 15;
      }

      // Installment info if applicable
      const labelX = 20;
      const rightX = 140;

      if (payment.installments > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Payment Structure: ${payment.installments} Installments`, 20, finalY);
        doc.text(`Amount per Installment: Rs.${(payment.installmentAmount || 0).toFixed(2)}`, 20, finalY + 6);
        finalY += 15;
      }

      finalY += 20;
      if (payment.notes) {
        doc.setFont('helvetica', 'bold');
        doc.text('Notes:', labelX, finalY);
        doc.setFont('helvetica', 'normal');
        doc.text(payment.notes, labelX, finalY + 6);
      }

      // Footer
      finalY = 270;
      doc.setDrawColor(0, 102, 204);
      doc.line(20, finalY, 190, finalY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Thank you for choosing GYM Pro. For queries, contact us at +91 9687577089', 20, finalY + 5);
      doc.text('This is a computer-generated document.', 20, finalY + 10);

      doc.save(`${payment.billNumber || 'invoice'}-Invoice.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Check console.');
    }
  };

  const totalDue = payments
    .filter(p => p.paymentStatus !== 'Paid')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const totalPaid = payments
    .filter(p => p.paymentStatus === 'Paid')
    .reduce((sum, p) => sum + p.totalAmount, 0);

  if (!user) {
    return (
      <PageWrapper className="max-w-7xl mx-auto py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Please login to view your billing information</h2>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto py-8 space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-slate-900 to-slate-950 text-white p-10 shadow-2xl border border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),transparent_20%)]"></div>
        <div className="relative">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/80 mb-4">My Account</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-3xl">
            Billing & Invoices
          </h1>
          <p className="mt-4 max-w-2xl text-base text-emerald-100/90">
            View your membership invoices, payment history, and download bills.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card border-l-4 border-green-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totalPaid.toFixed(2)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card border-l-4 border-orange-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Amount Due</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">₹{totalDue.toFixed(2)}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card border-l-4 border-blue-500">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Invoices</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{payments.length}</p>
        </motion.div>
      </div>

      {/* Invoices List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Invoices</h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-5xl text-blue-500 opacity-50" />
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FaFilePdf className="text-6xl opacity-20 mx-auto mb-4" />
            <p className="text-lg font-bold">No invoices yet</p>
            <p className="text-sm">Your billing invoices will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Bill #</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Plan</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Date</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{payment.billNumber}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{payment.plan}</td>
                    <td className="px-6 py-4 font-bold text-lg text-gray-900 dark:text-white">{formatAmount(payment.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        payment.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                        payment.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{payment.paymentDate}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setPreviewPayment(payment)}
                        className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold transition-colors"
                      >
                        <FaFilePdf className="text-lg" /> Invoice
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300 text-right">{formatAmount(previewPayment.planAmount)}</td>
                    <td className="p-3 border-b dark:border-gray-700 print:border-gray-300 text-right">{formatAmount(previewPayment.baseAmount)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plan Charges:</span>
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

export default MemberBilling;
