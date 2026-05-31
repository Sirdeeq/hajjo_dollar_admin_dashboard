import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Clock, 
  BookOpen, 
  Award, 
  ShieldCheck, 
  CheckCircle2,
  TrendingUp,
  Zap
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminStudentProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // I need an endpoint for this. 
        // GET /api/students/:id might work if I update it.
        const [stRes, enrRes] = await Promise.all([
          axios.get(`${API_URL}/students/user/${userId}`), // Need to add this
          axios.get(`${API_URL}/enrollments/user/${userId}`) // Need to add this
        ]);
        setStudent(stRes.data);
        setEnrollments(enrRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [userId]);

  if (loading) return <div className="py-20 text-center uppercase tracking-widest font-mono text-[10px] text-muted-foreground animate-pulse">Syncing Scholar Nodes...</div>;

  return (
    <div className="space-y-10 animate-fadeIn">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-foreground uppercase tracking-tight italic">Scholar <span className="text-primary">Intelligence</span></h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em] mt-1">Deep-Dive Analysis Protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card */}
        <div className="space-y-8">
           <div className="bg-card border border-border rounded-[3rem] p-10 flex flex-col items-center text-center space-y-6 relative overflow-hidden group transition-colors">
              <div className="absolute top-0 left-0 w-full h-24 bg-primary/5 transition-colors" />
              <div className="relative z-10">
                 <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-700 p-[2px] transition-colors">
                    <div className="w-full h-full rounded-[2.4rem] bg-card flex items-center justify-center text-primary font-black text-4xl overflow-hidden border border-black/20 transition-colors">
                       {student?.name?.[0]}
                    </div>
                 </div>
                 <div className="mt-6 space-y-1 transition-colors">
                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tight transition-colors">{student?.name}</h2>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] transition-colors">Scholar Database Node</p>
                 </div>
              </div>

              <div className="w-full pt-6 border-t border-border space-y-4 transition-colors">
                 <div className="flex items-center gap-4 text-left p-4 bg-muted/50 rounded-2xl border border-border transition-colors">
                    <Mail size={16} className="text-muted-foreground/30" />
                    <div className="truncate">
                       <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Communication</p>
                       <p className="text-[10px] font-bold text-foreground font-mono transition-colors">{student?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 text-left p-4 bg-muted/50 rounded-2xl border border-border transition-colors">
                    <Clock size={16} className="text-muted-foreground/30" />
                    <div>
                       <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Registry Date</p>
                       <p className="text-[10px] font-bold text-foreground transition-colors">{new Date(student?.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Metrics Grid */}
           <div className="bg-primary border border-primary/20 rounded-[2.5rem] p-8 space-y-6 transition-colors">
              <div className="flex items-center gap-3 text-black">
                 <TrendingUp size={20} />
                 <h3 className="text-xs font-black uppercase tracking-[0.3em]">Performance</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-black/10 rounded-2xl transition-colors">
                    <p className="text-2xl font-black text-black font-mono leading-none">{enrollments.length}</p>
                    <p className="text-[8px] font-bold text-black/60 uppercase tracking-widest mt-2">Allocations</p>
                 </div>
                 <div className="p-4 bg-black/10 rounded-2xl transition-colors">
                    <p className="text-2xl font-black text-black font-mono leading-none">{enrollments.filter(e => e.progress === 100).length}</p>
                    <p className="text-[8px] font-bold text-black/60 uppercase tracking-widest mt-2">Masteries</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Enrollment List */}
        <div className="lg:col-span-2 space-y-8">
           <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic">Active <span className="text-primary">Allocations</span></h3>
           
           <div className="space-y-4">
              {enrollments.map(enr => (
                <div key={enr._id} className="bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/20 transition-all group overflow-hidden relative transition-colors">
                   <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                      <BookOpen size={64} />
                   </div>

                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 transition-colors">
                      <div className="space-y-2">
                         <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${enr.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                               {enr.status}
                            </span>
                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Modified: {new Date(enr.updatedAt).toLocaleDateString()}</span>
                         </div>
                         <h4 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{enr.program.title}</h4>
                      </div>

                      <div className="flex items-center gap-4 transition-colors">
                         <div className="text-right">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 transition-colors">Mastery Progress</p>
                            <p className="text-xl font-black text-foreground font-mono transition-colors">{enr.progress}%</p>
                         </div>
                         <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center relative transition-colors">
                            <svg className="w-16 h-16 absolute -rotate-90 transition-colors">
                               <circle 
                                  cx="32" cy="32" r="28" 
                                  stroke="currentColor" 
                                  strokeWidth="4" 
                                  fill="transparent" 
                                  className="text-primary transition-all duration-1000"
                                  strokeDasharray={2 * Math.PI * 28}
                                  strokeDashoffset={2 * Math.PI * 28 * (1 - enr.progress / 100)}
                               />
                            </svg>
                            {enr.progress === 100 ? <CheckCircle2 size={24} className="text-primary animate-bounce transition-colors" /> : <Zap size={20} className="text-muted-foreground/20 transition-colors" />}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
