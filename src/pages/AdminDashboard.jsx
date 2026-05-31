import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  FileText, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  ChevronRight,
  ArrowUpRight,
  Clock,
  Zap,
  RefreshCw,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    blogs: 0,
    programs: 0,
    messages: 0,
    enrollments: 0,
    pendingPayments: 0
  });
  const [pendingPaymentsList, setPendingPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`),
        axios.get(`${API_URL}/enrollments/status/pending`)
      ]);
      setStats({
        students: statsRes.data.students,
        blogs: statsRes.data.blogs,
        programs: statsRes.data.programs,
        enrollments: statsRes.data.enrollments,
        pendingPayments: statsRes.data.pendingPayments
      });
      setPendingPaymentsList(paymentsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleApprovePayment = async (enrollmentId) => {
    if (confirm('Approve this payment and grant program access?')) {
      try {
        await axios.put(`${API_URL}/enrollments/approve/${enrollmentId}`);
        fetchData();
      } catch (err) {
        console.error('Error approving payment:', err);
      }
    }
  };

  const kpis = [
    { label: 'Global Students', value: stats.students, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Enrollments', value: stats.enrollments, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Course Assets', value: stats.programs, icon: BookOpen, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Active Articles', value: stats.blogs, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Pending Payments', value: stats.pendingPayments, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-500/10' }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10 animate-fadeIn font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase transition-colors duration-300">System <span className="text-primary italic transition-colors">Overview</span></h2>
          <p className="text-muted-foreground text-[10px] sm:text-xs mt-1 uppercase tracking-widest font-mono transition-colors duration-300">NODE_STATUS: <span className="text-primary transition-colors">OPERATIONAL</span> // LAST_SYNC: {new Date().toLocaleTimeString()}</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button 
            onClick={handleRefresh} 
            className="px-4 py-2 bg-muted border border-border rounded-xl flex items-center gap-3 transition-colors duration-300 hover:bg-primary/10"
            disabled={refreshing}
          >
            <RefreshCw size={14} className={`text-muted-foreground/30 transition-colors ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest transition-colors duration-300 shrink-0">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute inset-0 bg-primary/2 rounded-[2rem] blur-xl group-hover:bg-primary/5 transition-all" />
            <div className="relative h-full bg-card border border-border rounded-[1.5rem] lg:rounded-[2rem] p-5 lg:p-6 flex flex-col justify-between overflow-hidden group hover:border-foreground/10 transition-all duration-300 min-h-[140px] lg:min-h-[160px]">
              <div className="flex items-center justify-between">
                <div className={`p-2 lg:p-3 rounded-xl lg:rounded-2xl ${kpi.bg} ${kpi.color} shrink-0`}>
                  <kpi.icon size={18} className="lg:size-20" />
                </div>
                <div className="flex items-center gap-1 text-primary text-[9px] lg:text-[10px] font-bold transition-colors">
                  <TrendingUp size={10} className="lg:size-12" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[8px] lg:text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] mb-1 transition-colors duration-300 truncate">{kpi.label}</p>
                <p className="text-xl lg:text-2xl font-black text-foreground tracking-tighter transition-colors duration-300 truncate">{kpi.value}</p>
              </div>
              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        
        {/* Pending Payments */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <div className="bg-card border border-border rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 space-y-6 relative overflow-hidden transition-colors duration-300 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-3 transition-colors">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse transition-colors shrink-0" />
                Pending Payments
              </h3>
              <button className="text-[9px] font-bold text-muted-foreground/30 hover:text-foreground transition-colors uppercase tracking-widest">Export</button>
            </div>

            <div className="space-y-4">
              {pendingPaymentsList.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">No pending payments at the moment</p>
                </div>
              ) : pendingPaymentsList.map((enrollment) => (
                <div key={enrollment._id} className="group flex items-center justify-between p-4 bg-muted/30 border border-border rounded-2xl hover:bg-muted/50 hover:border-foreground/10 transition-all duration-300 overflow-hidden">
                  <div className="flex items-center gap-4 overflow-hidden flex-1">
                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-muted flex items-center justify-center text-[10px] lg:text-xs font-black text-muted-foreground/40 group-hover:text-primary transition-colors duration-300 shrink-0">
                      {enrollment.user.name[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-foreground uppercase tracking-tight transition-colors duration-300 truncate">{enrollment.user.name}</p>
                      <p className="text-[9px] text-muted-foreground/30 font-mono mt-0.5 uppercase tracking-wider transition-colors duration-300 truncate">{enrollment.program.title} // {new Date(enrollment.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => navigate('/payments')} 
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-black transition-all flex items-center gap-1 text-[9px] font-black uppercase"
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button 
                      onClick={() => handleApprovePayment(enrollment._id)} 
                      className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all flex items-center gap-1 text-[9px] font-black uppercase"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="space-y-8 lg:space-y-10">
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-[2rem] lg:rounded-[2.5rem] p-8 text-black space-y-6 shadow-xl shadow-primary/10 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 text-black/5">
               <Zap size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-2 transition-colors">Power Tools</h3>
              <p className="text-black/60 text-xs font-bold uppercase tracking-widest transition-colors">System Operations</p>
            </div>
            <div className="space-y-3 relative z-10">
              {[
                { label: 'Create Campaign', path: '/blogs' },
                { label: 'Enroll Scholar', path: '/academy' },
                { label: 'System Config', path: '/settings' }
              ].map((act, i) => (
                <button 
                  key={i}
                  onClick={() => navigate(act.path)}
                  className="w-full bg-black/10 hover:bg-black/20 border border-black/5 rounded-xl py-3.5 px-5 text-left text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all"
                >
                  {act.label}
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
