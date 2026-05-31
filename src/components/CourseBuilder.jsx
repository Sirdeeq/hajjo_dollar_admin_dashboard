import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp, Video, FileText, Move } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function CourseBuilder({ program, onBack }) {
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({}); // { moduleId: [lessons] }
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(null);

  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newModule, setNewModule] = useState({ title: '', description: '', order: 0 });
  const [newLesson, setNewLesson] = useState({ title: '', content: '', videoUrl: '', videoType: 'youtube', isFreePreview: false, order: 0 });

  const fetchData = async () => {
    try {
      const modRes = await axios.get(`${API_URL}/modules/program/${program._id}`);
      setModules(modRes.data);
      
      const lessonData = {};
      for (const mod of modRes.data) {
        const lesRes = await axios.get(`${API_URL}/lessons/module/${mod._id}`);
        lessonData[mod._id] = lesRes.data;
      }
      setLessons(lessonData);
    } catch (err) {
      console.error('Error fetching curriculum:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [program._id]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/modules`, { ...newModule, program: program._id, order: modules.length });
      setShowAddModule(false);
      setNewModule({ title: '', description: '', order: 0 });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/lessons`, { ...newLesson, module: activeModuleId, order: (lessons[activeModuleId] || []).length });
      setShowAddLesson(false);
      setNewLesson({ title: '', content: '', videoUrl: '', videoType: 'youtube', isFreePreview: false, order: 0 });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteModule = async (id) => {
    if (confirm('Delete module and all its lessons?')) {
      try {
        await axios.delete(`${API_URL}/modules/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  const handleDeleteLesson = async (id) => {
    if (confirm('Delete this lesson?')) {
      try {
        await axios.delete(`${API_URL}/lessons/${id}`);
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  if (loading) return <div className="py-20 text-center animate-pulse text-muted-foreground uppercase tracking-widest font-mono text-xs">Accessing Curriculum Database...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight transition-colors">Course <span className="text-primary italic transition-colors">Architect</span></h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono mt-1 transition-colors">BUILDING: {program.title}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModule(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
        >
          <Plus size={14} /> New Module
        </button>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modules.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-[2rem] transition-colors">
            <p className="text-muted-foreground/30 uppercase tracking-[0.3em] text-[10px] font-bold">No structural modules found.</p>
          </div>
        ) : (
          modules.map((mod, mIdx) => (
            <div key={mod._id} className="bg-card border border-border rounded-[2rem] overflow-hidden transition-colors shadow-sm">
              <div className="p-6 flex items-center justify-between bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary font-mono font-black transition-colors">
                    {String(mIdx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-tight transition-colors">{mod.title}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono transition-colors">{(lessons[mod._id] || []).length} Lessons Enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => { setActiveModuleId(mod._id); setShowAddLesson(true); }}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all"
                    title="Add Lesson"
                  >
                    <Plus size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteModule(mod._id)}
                    className="p-2 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Lessons in Module */}
              <div className="p-4 space-y-2">
                {(lessons[mod._id] || []).length === 0 ? (
                  <p className="text-center py-6 text-[9px] text-muted-foreground/30 uppercase tracking-widest font-bold transition-colors">Empty module node.</p>
                ) : (
                  (lessons[mod._id] || []).map((les, lIdx) => (
                    <div key={les._id} className="group flex items-center justify-between p-4 bg-background border border-border rounded-xl hover:border-primary/20 transition-all transition-colors">
                      <div className="flex items-center gap-4">
                        <Video size={14} className="text-muted-foreground/30 transition-colors" />
                        <div>
                          <p className="text-xs font-bold text-foreground uppercase tracking-tight transition-colors">{les.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] text-muted-foreground/30 font-mono uppercase transition-colors">{les.duration || '00:00'}</span>
                            {les.isFreePreview && <span className="text-[7px] bg-primary/10 text-primary px-1 rounded font-black uppercase transition-colors">PREVIEW</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-1.5 text-muted-foreground/40 hover:text-primary transition-colors"><Edit3 size={12}/></button>
                        <button onClick={() => handleDeleteLesson(les._id)} className="p-1.5 text-muted-foreground/40 hover:text-red-600 transition-colors"><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Module Modal */}
      {showAddModule && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative transition-colors duration-300">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-6 transition-colors">Initialize <span className="text-primary transition-colors">Module</span></h3>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors ml-1">Title</label>
                <input type="text" required className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all" value={newModule.title} onChange={e => setNewModule({...newModule, title: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors ml-1">Description</label>
                <textarea className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground h-24 focus:outline-none focus:border-primary/40 transition-all resize-none" value={newModule.description} onChange={e => setNewModule({...newModule, description: e.target.value})} />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModule(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-muted-foreground/40 border border-border rounded-xl hover:bg-muted transition-colors transition-all">Abort</button>
                <button type="submit" className="flex-2 py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors">Commit Module</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-xl rounded-[2rem] p-8 shadow-2xl relative transition-colors duration-300">
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-6 transition-colors">Deploy <span className="text-primary transition-colors">Lesson</span></h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors ml-1">Title</label>
                  <input type="text" required className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all" value={newLesson.title} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors ml-1">Duration</label>
                  <input type="text" placeholder="e.g. 12:45" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={newLesson.duration} onChange={e => setNewLesson({...newLesson, duration: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors ml-1">Video URL (YouTube/Cloudinary)</label>
                <input type="text" required className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={newLesson.videoUrl} onChange={e => setNewLesson({...newLesson, videoUrl: e.target.value})} />
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 border border-border rounded-xl transition-colors">
                <input type="checkbox" id="free-prev" className="w-4 h-4 accent-primary" checked={newLesson.isFreePreview} onChange={e => setNewLesson({...newLesson, isFreePreview: e.target.checked})} />
                <label htmlFor="free-prev" className="text-[10px] font-black uppercase text-foreground/70 transition-colors cursor-pointer">Allow free preview for non-enrolled users</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddLesson(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-muted-foreground/40 border border-border rounded-xl transition-colors">Abort</button>
                <button type="submit" className="flex-2 py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-colors">Secure Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function ArrowLeft({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>; }
