import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Users, 
  BookOpen, 
  Edit3, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  ArrowLeft
} from 'lucide-react';
import CourseBuilder from '../components/CourseBuilder';
import ResponsiveTable from '../components/ResponsiveTable';

import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminAcademy() {
  const [activeSubTab, setActiveSubTab] = useState('programs'); 
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // LMS Integration
  const [viewingCurriculum, setViewingCurriculum] = useState(null); // Holds the program object

  // Modals
  const [showAddProg, setShowAddProg] = useState(false);
  const [showEditProg, setShowEditProg] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [showAddStud, setShowAddStud] = useState(false);
  const [showEditStud, setShowEditStud] = useState(false);
  const [editingStud, setEditingStud] = useState(null);

  // Forms
  const [newProg, setNewProg] = useState({ title: '', description: '', level: 'Beginner', price: 'Free', type: 'free', whatsappLink: '', telegramLink: '', img: '', status: 'Active', slug: '' });
  const [newStud, setNewStud] = useState({ name: '', email: '', program: '', status: 'Active', progress: 0 });

  const fetchAll = async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        axios.get(`${API_URL}/programs`),
        axios.get(`${API_URL}/students`)
      ]);
      setPrograms(pRes.data);
      setStudents(sRes.data);
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredItems = useMemo(() => {
    const list = activeSubTab === 'programs' ? programs : students;
    return list.filter(item => {
      const name = item.title || item.name || '';
      const email = item.email || '';
      return name.toLowerCase().includes(searchTerm.toLowerCase()) || email.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [activeSubTab, programs, students, searchTerm]);

  // CRUD Handlers
  const handleAddProgSubmit = async (e) => {
    e.preventDefault();
    try {
      const slug = newProg.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await axios.post(`${API_URL}/programs`, { ...newProg, slug });
      setShowAddProg(false);
      setNewProg({ title: '', description: '', level: 'Beginner', price: 'Free', type: 'free', whatsappLink: '', telegramLink: '', img: '', status: 'Active', slug: '' });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleEditProgSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/programs/${editingProg._id}`, editingProg);
      setShowEditProg(false);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleAddStudSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/students`, newStud);
      setShowAddStud(false);
      setNewStud({ name: '', email: '', program: '', status: 'Active', progress: 0 });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleEditStudSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/students/${editingStud._id}`, editingStud);
      setShowEditStud(false);
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (type, id) => {
    if (confirm(`Delete this ${type}?`)) {
      try {
        await axios.delete(`${API_URL}/${type}s/${id}`);
        fetchAll();
      } catch (err) { console.error('Delete error:', err); }
    }
  };

  if (viewingCurriculum) {
    return <CourseBuilder program={viewingCurriculum} onBack={() => setViewingCurriculum(null)} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight transition-colors">Academy <span className="text-primary italic transition-colors">Command</span></h2>
          <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-mono transition-colors">Orchestrate courses and manage student cohorts.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => activeSubTab === 'programs' ? setShowAddProg(true) : setShowAddStud(true)}
            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary to-emerald-600 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98] shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-colors"
          >
            <Plus size={16} />
            <span>Add {activeSubTab === 'programs' ? 'Program' : 'Student'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TABS */}
      <div className="flex gap-4 border-b border-border pb-1 transition-colors">
        {[
          { id: 'programs', label: 'Program Catalog', icon: BookOpen },
          { id: 'students', label: 'Student Directory', icon: Users }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative transition-colors
              ${activeSubTab === tab.id ? 'text-primary' : 'text-muted-foreground/30 hover:text-foreground'}
            `}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full transition-colors" />}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="relative group transition-colors">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
        <input 
          type="text" 
          placeholder={`SEARCH ${activeSubTab === 'programs' ? 'PROGRAMS' : 'STUDENTS'} DATABASE...`} 
          className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 text-[10px] text-foreground focus:outline-none focus:border-primary/30 transition-all font-mono uppercase tracking-[0.2em] transition-colors"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* CONTENT GRID / LIST */}
      {activeSubTab === 'programs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors">
          {filteredItems.map(p => (
            <div key={p._id} className="group relative bg-card border border-border rounded-[2rem] p-6 space-y-6 hover:border-primary/20 transition-all overflow-hidden transition-colors shadow-sm">
               <div className="flex justify-between items-start transition-colors">
                 <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-colors ${p.type === 'paid' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                   {p.type} resource
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => { setViewingCurriculum(p); }} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all" title="Manage Curriculum"><Zap size={14}/></button>
                   <button onClick={() => { setEditingProg(p); setShowEditProg(true); }} className="p-2 bg-muted rounded-lg text-muted-foreground/20 hover:text-primary transition-colors"><Edit3 size={14}/></button>
                   <button onClick={() => handleDelete('program', p._id)} className="p-2 bg-muted rounded-lg text-muted-foreground/20 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{p.title}</h3>
                 <p className="text-[10px] text-muted-foreground/40 mt-1 uppercase tracking-widest leading-relaxed line-clamp-2 transition-colors">{p.description}</p>
                 <p className="text-[9px] text-muted-foreground/20 font-mono mt-3 uppercase tracking-widest transition-colors">{p.level} level // {p.price}</p>
               </div>
               <div className="pt-4 border-t border-border flex items-center justify-between transition-colors">
                 <div className="flex flex-col">
                   <span className="text-[14px] font-black text-foreground font-mono transition-colors">{p.studentCount || 0}</span>
                   <span className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-widest transition-colors">Enrolled Scholars</span>
                 </div>
                 <button onClick={() => setViewingCurriculum(p)} className="flex items-center gap-2 text-[9px] font-black text-primary/60 uppercase tracking-widest group-hover:gap-3 transition-all transition-colors">
                    Architect <ArrowRight size={12}/>
                 </button>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <ResponsiveTable
          columns={[
            { key: 'name', title: 'Student Identity', render: (st) => (
              <Link to={`/academy/student/${st.user?._id || st._id}`} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                  {st.name[0]}
                </div>
                <div>
                  <p className="text-sm font-black text-foreground uppercase tracking-tight">{st.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono lowercase">{st.email}</p>
                </div>
              </Link>
            )},
            { key: 'program', title: 'Allocated Program', render: (st) => (
              <span className="text-[10px] font-black text-foreground/60 uppercase tracking-widest bg-muted px-3 py-1 rounded-lg">{st.program?.title || 'Standalone Enrollment'}</span>
            )},
            { key: 'status', title: 'Status', render: (st) => (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${st.status === 'Active' ? 'bg-primary shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-muted'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${st.status === 'Active' ? 'text-foreground/70' : 'text-muted-foreground/30'}`}>{st.status}</span>
              </div>
            )},
            { key: 'progress', title: 'Mastery Progress', render: (st) => (
              <div className="flex items-center gap-3">
                 <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden min-w-[80px]">
                   <div className="h-full bg-gradient-to-r from-primary to-emerald-400 shadow-[0_0_8px_rgba(34,197,94,0.3)]" style={{width: `${st.progress}%`}} />
                 </div>
                 <span className="text-[10px] font-black font-mono text-primary/80">{st.progress}%</span>
              </div>
            )},
          ]}
          data={filteredItems}
          renderActions={(st) => (
            <div className="flex gap-2">
              <button onClick={() => { setEditingStud(st); setShowEditStud(true); }} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary transition-all"><Edit3 size={14}/></button>
              <button onClick={() => handleDelete('student', st._id)} className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-red-600 transition-all"><Trash2 size={14}/></button>
            </div>
          )}
          emptyMessage="No students in the directory"
        />
      )}

      {/* MODALS */}
      {showAddProg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-colors duration-300">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
             <div className="flex justify-between items-center mb-10 transition-colors">
                <div>
                   <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter transition-colors">New Program Entry</h3>
                   <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] mt-1 transition-colors">Configure Course Parameters.</p>
                </div>
                <button onClick={() => setShowAddProg(false)} className="p-3 rounded-2xl bg-muted text-muted-foreground/40 hover:text-foreground transition-all transition-colors"><X size={24}/></button>
             </div>
             
             <form onSubmit={handleAddProgSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar transition-colors">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Title</label>
                   <input type="text" required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all uppercase tracking-tight font-bold" value={newProg.title} onChange={e => setNewProg({...newProg, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Curriculum Summary</label>
                   <textarea required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground h-32 focus:outline-none focus:border-primary/40 transition-all resize-none leading-relaxed" value={newProg.description} onChange={e => setNewProg({...newProg, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Proficiency Level</label>
                      <input type="text" className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground focus:border-primary/30 transition-all" value={newProg.level} onChange={e => setNewProg({...newProg, level: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Price Point</label>
                      <input type="text" className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground focus:border-primary/30 transition-all" value={newProg.price} onChange={e => setNewProg({...newProg, price: e.target.value})} />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Access Protocol</label>
                      <select className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground focus:outline-none transition-colors" value={newProg.type} onChange={e => setNewProg({...newProg, type: e.target.value})}>
                         <option value="free">FREE ACCESS</option>
                         <option value="paid">PAID GATEWAY</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Registry Status</label>
                      <select className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground focus:outline-none transition-colors" value={newProg.status} onChange={e => setNewProg({...newProg, status: e.target.value})}>
                         <option value="Active">LIVE_NODE</option>
                         <option value="Closed">ARCHIVE_ONLY</option>
                      </select>
                   </div>
                </div>
                <div className="flex justify-end pt-6 border-t border-border transition-colors">
                   <button type="submit" className="w-full py-5 bg-primary text-black font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all">Authorize Course Instance</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Edit Program Modal */}
      {showEditProg && editingProg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-xl rounded-[2.5rem] p-10 shadow-2xl transition-colors duration-300">
             <div className="flex justify-between items-center mb-8 transition-colors">
                <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter text-primary transition-colors">Modify Course Instance</h3>
                <button onClick={() => setShowEditProg(false)} className="p-2 text-muted-foreground/20 hover:text-foreground transition-all transition-colors"><X size={24}/></button>
             </div>
             <form onSubmit={handleEditProgSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar transition-colors">
                <input type="text" required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground transition-colors" value={editingProg.title} onChange={e => setEditingProg({...editingProg, title: e.target.value})} />
                <textarea required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground h-32 transition-colors resize-none leading-relaxed" value={editingProg.description} onChange={e => setEditingProg({...editingProg, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-6 transition-colors">
                   <select className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground transition-colors" value={editingProg.type} onChange={e => setEditingProg({...editingProg, type: e.target.value})}>
                      <option value="free">FREE</option>
                      <option value="paid">PAID</option>
                   </select>
                   <select className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground transition-colors" value={editingProg.status} onChange={e => setEditingProg({...editingProg, status: e.target.value})}>
                      <option value="Active">ACTIVE</option>
                      <option value="Closed">CLOSED</option>
                   </select>
                </div>
                <div className="flex justify-end pt-6 border-t border-border transition-colors">
                   <button type="submit" className="w-full py-5 bg-foreground text-background font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-lg shadow-foreground/10 transition-colors">Overwrite Metadata</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStud && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl transition-colors duration-300">
             <div className="flex justify-between items-center mb-8 text-center w-full transition-colors">
                <div className="w-full">
                   <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tighter transition-colors">Enroll Scholar</h3>
                   <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.3em] mt-2 transition-colors">Initialize Database Record.</p>
                </div>
             </div>
             <form onSubmit={handleAddStudSubmit} className="space-y-5 transition-colors">
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Full Identity</label>
                   <input type="text" placeholder="e.g. Sadiq Idris" required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground focus:border-primary/40 transition-all font-bold uppercase transition-colors" value={newStud.name} onChange={e => setNewStud({...newStud, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Communication Endpoint</label>
                   <input type="email" placeholder="email@server.host" required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-sm text-foreground font-mono lowercase transition-colors" value={newStud.email} onChange={e => setNewStud({...newStud, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest ml-1 transition-colors">Target Curriculum</label>
                   <select required className="w-full bg-background border border-border rounded-2xl py-4 px-6 text-xs text-foreground uppercase font-bold tracking-tight transition-colors" value={newStud.program} onChange={e => setNewStud({...newStud, program: e.target.value})}>
                      <option value="">-- SELECT PROTOCOL --</option>
                      {programs.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                   </select>
                </div>
                <div className="flex gap-4 pt-4 transition-colors">
                   <button type="button" onClick={() => setShowAddStud(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-muted-foreground/40 border border-border rounded-2xl hover:bg-muted transition-all transition-colors">Cancel</button>
                   <button type="submit" className="flex-[2] py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-colors">Commit Entry</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStud && editingStud && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl transition-colors duration-300">
             <h3 className="text-xl font-black text-foreground uppercase italic mb-8 transition-colors">Update Scholar Record</h3>
             <form onSubmit={handleEditStudSubmit} className="space-y-5 transition-colors">
                <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground font-bold transition-colors" value={editingStud.name} onChange={e => setEditingStud({...editingStud, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4 transition-colors">
                   <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-foreground transition-colors" value={editingStud.status} onChange={e => setEditingStud({...editingStud, status: e.target.value})}>
                      <option value="Active">ACTIVE</option>
                      <option value="Graduated">GRADUATED</option>
                      <option value="Inactive">INACTIVE</option>
                   </select>
                   <div className="relative">
                      <input type="number" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-xs text-primary font-mono transition-colors" value={editingStud.progress} onChange={e => setEditingStud({...editingStud, progress: e.target.value})} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground/20 transition-colors">%</span>
                   </div>
                </div>
                <div className="flex gap-4 pt-4 transition-colors">
                   <button type="button" onClick={() => setShowEditStud(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-muted-foreground/40 rounded-2xl transition-colors transition-all hover:bg-muted">Abort</button>
                   <button type="submit" className="flex-[2] py-4 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-colors">Sync Record</button>
                </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}
