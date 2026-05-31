import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle,
  ExternalLink,
  User,
  BookOpen,
  DollarSign,
  MessageCircle,
  StickyNote,
  Share2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PAYMENT_TABS = [
  { id: 'pending', label: 'Pending', status: 'Under Review' },
  { id: 'approved', label: 'Approved', status: 'Paid' },
  { id: 'rejected', label: 'Rejected', status: 'Rejected' },
  { id: 'unresolved', label: 'Unresolved', status: 'Unresolved' },
  { id: 'all', label: 'All', status: null }
];

export default function AdminPayments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [adminNotes, setAdminNotes] = useState('');

  const fetchEnrollments = async (tab = activeTab) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/enrollments/status/${tab}`);
      setEnrollments(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEnrollments(); }, [activeTab]);

  const handleApprove = async (id) => {
    if (confirm('Approve this payment and grant program access?')) {
      try {
        await axios.put(`${API_URL}/enrollments/approve/${id}`, { notes: adminNotes });
        fetchEnrollments();
        setShowReceiptModal(false);
        setAdminNotes('');
      } catch (err) { console.error(err); }
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason (sent to student):');
    if (reason) {
      try {
        await axios.put(`${API_URL}/enrollments/reject/${id}`, { reason, notes: adminNotes });
        fetchEnrollments();
        setShowReceiptModal(false);
        setAdminNotes('');
      } catch (err) { console.error(err); }
    }
  };

  const handleMarkUnresolved = async (id) => {
    try {
      await axios.put(`${API_URL}/enrollments/mark-unresolved/${id}`, { notes: adminNotes });
      fetchEnrollments();
      setShowReceiptModal(false);
      setAdminNotes('');
    } catch (err) { console.error(err); }
  };

  const handleSaveNotes = async (id) => {
    try {
      await axios.put(`${API_URL}/enrollments/notes/${id}`, { notes: adminNotes });
      fetchEnrollments();
      alert('Notes saved successfully!');
    } catch (err) { console.error(err); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Paid':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Unresolved':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filtered = enrollments.filter(e => 
    e.user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.program.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight italic">Payment <span className="text-primary">Verification</span></h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Reviewing incoming liquidity signals.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-1 overflow-x-auto">
        {PAYMENT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setAdminNotes(''); }}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab.id 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="relative group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder="SEARCH TRANSACTIONS..." 
          className="w-full bg-card border border-border rounded-[2rem] py-4 pl-12 pr-4 text-[10px] text-foreground focus:outline-none focus:border-primary/30 transition-all font-mono uppercase tracking-[0.2em]"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center uppercase tracking-widest font-mono text-[10px] text-muted-foreground animate-pulse">Accessing Secure Ledger...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border rounded-[3rem] space-y-4">
           <Clock size={40} className="mx-auto text-muted-foreground/20" />
           <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">No {PAYMENT_TABS.find(t => t.id === activeTab)?.label} Transactions in Queue</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filtered.map(enr => (
             <div key={enr._id} className="bg-card border border-border rounded-[2.5rem] p-6 space-y-6 hover:border-primary/20 transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 text-primary/5 group-hover:text-primary/10 transition-colors">
                   <DollarSign size={80} />
                </div>
                
                <div className="flex justify-between items-start relative z-10">
                   <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(enr.paymentStatus)}`}>
                      {enr.paymentStatus}
                   </div>
                   <button 
                    onClick={() => { 
                      setSelectedEnrollment(enr); 
                      setAdminNotes(enr.adminNotes || ''); 
                      setShowReceiptModal(true); 
                    }}
                    className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-black transition-all"
                   >
                      <Eye size={16} />
                   </button>
                </div>

                <div className="space-y-4 relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-foreground font-black text-xs border border-border">
                         {enr.user.name[0]}
                      </div>
                      <div>
                         <p className="text-xs font-black text-foreground uppercase tracking-tight">{enr.user.name}</p>
                         <p className="text-[9px] text-muted-foreground font-mono truncate max-w-[150px]">{enr.user.email}</p>
                      </div>
                   </div>

                   <div className="pt-4 border-t border-border space-y-3">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Program</span>
                         <span className="text-[9px] font-black text-foreground uppercase tracking-tight text-right">{enr.program.title}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Amount</span>
                         <span className="text-xs font-black text-primary font-mono">{enr.program.price}</span>
                      </div>
                      {enr.sharedOnWhatsapp && (
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Shared</span>
                           <div className="flex items-center gap-1 text-[9px] font-black text-green-500">
                             <MessageCircle size={12} />
                             <span>WhatsApp</span>
                           </div>
                        </div>
                      )}
                   </div>
                </div>

                {activeTab === 'pending' && (
                  <div className="pt-4 flex gap-2 relative z-10">
                     <button onClick={() => handleApprove(enr._id)} className="flex-1 py-3 bg-primary text-black text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all">Approve</button>
                     <button onClick={() => handleReject(enr._id)} className="flex-1 py-3 bg-muted text-muted-foreground hover:text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/10 border border-border hover:border-red-500/20 transition-all">Reject</button>
                  </div>
                )}
             </div>
           ))}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedEnrollment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
           <div className="bg-card border border-border w-full max-w-4xl rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-8 shrink-0">
                 <div>
                    <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Receipt <span className="text-primary">Analysis</span></h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">Verification Node: {selectedEnrollment._id}</p>
                 </div>
                 <button onClick={() => { setShowReceiptModal(false); setAdminNotes(''); }} className="p-3 bg-muted rounded-2xl text-muted-foreground hover:text-foreground transition-all"><XCircle size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-8">
                  {/* Image View */}
                  {selectedEnrollment.paymentReceipt && (
                    <div className="bg-black rounded-[2rem] overflow-hidden border border-border relative group aspect-video">
                      <img 
                        src={selectedEnrollment.paymentReceipt} 
                        alt="Payment Receipt" 
                        className="w-full h-full object-contain"
                      />
                      <a 
                        href={selectedEnrollment.paymentReceipt} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="absolute bottom-6 right-6 p-4 bg-primary text-black rounded-2xl shadow-xl shadow-primary/20 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                         <ExternalLink size={16} /> Original
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Data */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest italic">Identity Metadata</p>
                          <div className="p-4 bg-muted rounded-2xl border border-border space-y-1">
                             <p className="text-sm font-black text-foreground uppercase tracking-tight">{selectedEnrollment.user.name}</p>
                             <p className="text-[10px] text-muted-foreground font-mono">{selectedEnrollment.user.email}</p>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest italic">Transaction Details</p>
                          <div className="p-4 bg-muted rounded-2xl border border-border space-y-3">
                             <div className="flex justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Program</span>
                                <span className="text-[10px] font-black text-foreground uppercase tracking-tight">{selectedEnrollment.program.title}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Amount</span>
                                <span className="text-xs font-black text-primary font-mono">{selectedEnrollment.program.price}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">Status</span>
                                <span className={`text-[10px] font-black uppercase tracking-tight ${
                                  selectedEnrollment.paymentStatus === 'Paid' ? 'text-green-500' : 
                                  selectedEnrollment.paymentStatus === 'Rejected' ? 'text-red-500' : 
                                  selectedEnrollment.paymentStatus === 'Unresolved' ? 'text-purple-500' : 'text-amber-500'
                                }`}>{selectedEnrollment.paymentStatus}</span>
                             </div>
                             {selectedEnrollment.paymentSubmittedAt && (
                               <div className="flex justify-between">
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Submitted</span>
                                  <span className="text-[9px] font-black text-foreground font-mono uppercase">{new Date(selectedEnrollment.paymentSubmittedAt).toLocaleString()}</span>
                               </div>
                             )}
                             {selectedEnrollment.sharedOnWhatsapp && (
                               <div className="flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Shared</span>
                                  <span className="flex items-center gap-2 text-[9px] font-black text-green-500 uppercase"><Share2 size={12} /> WhatsApp</span>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Right: Notes & Actions */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest italic">Admin Notes</p>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add notes about this payment..."
                            className="w-full bg-muted border border-border rounded-2xl p-4 text-xs text-foreground focus:outline-none focus:border-primary/30"
                            rows={6}
                          />
                          <button onClick={() => handleSaveNotes(selectedEnrollment._id)} className="w-full py-3 bg-muted text-primary text-[10px] font-black uppercase tracking-widest rounded-2xl border border-border hover:border-primary/30 transition-all">
                            <StickyNote size={14} className="inline mr-2" />
                            Save Notes
                          </button>
                       </div>

                       <div className="space-y-3 pt-6 border-t border-border">
                          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                             <AlertCircle size={16} className="text-primary shrink-0" />
                             <p className="text-[8px] font-bold text-muted-foreground uppercase leading-relaxed">Ensure the account name and amount match the provided bank records before authorization.</p>
                          </div>
                          {activeTab === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(selectedEnrollment._id)} className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Approve Payment
                              </button>
                              <button onClick={() => handleReject(selectedEnrollment._id)} className="w-full py-5 bg-muted text-muted-foreground hover:text-red-500 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-border hover:border-red-500/20 transition-all">
                                Reject Payment
                              </button>
                              <button onClick={() => handleMarkUnresolved(selectedEnrollment._id)} className="w-full py-5 bg-muted text-muted-foreground hover:text-purple-500 font-black uppercase text-[10px] tracking-widest rounded-2xl border border-border hover:border-purple-500/20 transition-all">
                                Mark as Unresolved
                              </button>
                            </>
                          )}
                          {activeTab === 'unresolved' && (
                            <button onClick={() => { setActiveTab('pending'); fetchEnrollments('pending'); }} className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                              Back to Pending
                            </button>
                          )}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
