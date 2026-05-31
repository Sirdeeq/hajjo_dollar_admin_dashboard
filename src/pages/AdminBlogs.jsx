import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  X,
  FileText,
  Lock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter
} from 'lucide-react';
import ResponsiveTable from '../components/ResponsiveTable';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal States
  const [showAddModal, setShowAddBlogModal] = useState(false);
  const [showEditModal, setShowEditBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [newBlog, setNewBlog] = useState({ 
    title: '', 
    category: 'CPA BASICS', 
    status: 'Published',
    excerpt: '',
    content: '',
    readTime: '5 MIN',
    type: 'free',
    socialLink: '',
    img: '',
    images: []
  });

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [blogs, searchTerm]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentItems = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFileUpload = async (e, isEdit = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 5) { alert('Max 5 images'); return; }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);

    setUploading(true);
    try {
      const res = await axios.post(`${API_URL}/upload`, formData);
      const urls = res.data.urls;
      if (isEdit) {
        setEditingBlog(prev => ({ ...prev, img: urls[0], images: urls }));
      } else {
        setNewBlog(prev => ({ ...prev, img: urls[0], images: urls }));
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/blogs`, newBlog);
      setBlogs(prev => [res.data, ...prev]);
      setShowAddBlogModal(false);
      setNewBlog({ title: '', category: 'CPA BASICS', status: 'Published', excerpt: '', content: '', readTime: '5 MIN', type: 'free', socialLink: '', img: '', images: [] });
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleEditBlog = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/blogs/${editingBlog._id}`, editingBlog);
      setBlogs(prev => prev.map(b => (b._id === editingBlog._id ? res.data : b)));
      setShowEditBlogModal(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const deleteBlog = async (id) => {
    if (confirm('Permanently delete this article?')) {
      try {
        await axios.delete(`${API_URL}/blogs/${id}`);
        setBlogs(prev => prev.filter(b => b._id !== id));
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight transition-colors duration-300">Content <span className="text-primary italic transition-colors">Library</span></h2>
          <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-mono transition-colors duration-300">Manage your CPA marketing articles and guides.</p>
        </div>
        <button 
          onClick={() => setShowAddBlogModal(true)}
          className="flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-primary to-emerald-600 text-black text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-[0.98]"
        >
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="FILTER BY TITLE OR CATEGORY..." 
            className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 text-[10px] text-foreground focus:outline-none focus:border-primary/30 transition-all font-mono uppercase tracking-[0.2em]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-4 bg-muted border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-all flex items-center gap-3 transition-colors">
          <Filter size={14} /> Filters
        </button>
      </div>

      {/* Blog Grid */}
      <div className="bg-card border border-border rounded-[2rem] overflow-hidden transition-colors duration-300">
        <ResponsiveTable
          columns={[
            { key: 'details', title: 'Article Details', render: (blog) => (
              <div className="flex items-center gap-4">
                <div className="w-14 h-10 rounded-xl overflow-hidden border border-border bg-muted flex-shrink-0 transition-colors">
                  <img src={blog.img} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt="" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-foreground uppercase tracking-tight truncate transition-colors">{blog.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded transition-colors ${blog.type === 'paid' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' : 'bg-primary/10 text-primary'}`}>
                      {blog.type === 'paid' ? 'Premium Gate' : 'Public Access'}
                    </span>
                  </div>
                </div>
              </div>
            )},
            { key: 'category', title: 'Category', render: (blog) => (
              <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest bg-muted px-3 py-1 rounded-full transition-colors">{blog.category}</span>
            )},
            { key: 'metrics', title: 'Metrics', render: (blog) => (
              <div className="flex flex-col items-center">
                <span className="text-sm font-black text-primary font-mono tracking-tighter transition-colors">{blog.views || 0}</span>
                <span className="text-[8px] text-muted-foreground/20 font-bold uppercase tracking-widest mt-0.5 transition-colors">Visits</span>
              </div>
            )},
            { key: 'visibility', title: 'Visibility', render: (blog) => (
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${blog.status === 'Published' ? 'bg-primary' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${blog.status === 'Published' ? 'text-foreground/60' : 'text-yellow-600 dark:text-yellow-500/60'}`}>{blog.status}</span>
              </div>
            )}
          ]}
          data={currentItems}
          renderActions={(blog) => (
            <div className="flex gap-3">
              <button onClick={() => { setEditingBlog(blog); setShowEditBlogModal(true); }} className="p-2.5 rounded-xl bg-muted text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-all"><Edit3 size={14}/></button>
              <button onClick={() => deleteBlog(blog._id)} className="p-2.5 rounded-xl bg-muted text-muted-foreground/40 hover:text-red-600 hover:bg-red-500/10 transition-all"><Trash2 size={14}/></button>
            </div>
          )}
          emptyMessage="No articles yet"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-border flex items-center justify-between transition-colors">
            <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em] font-mono transition-colors">Index Node: {currentPage} of {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-muted text-muted-foreground/40 hover:text-foreground disabled:opacity-10 transition-all transition-colors"><ChevronLeft size={16}/></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-muted text-muted-foreground/40 hover:text-foreground disabled:opacity-10 transition-all transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="flex justify-between items-center mb-8 transition-colors">
              <div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight transition-colors">Generate <span className="text-primary italic transition-colors">Article</span></h3>
                <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em] mt-1 transition-colors">Populate core content database.</p>
              </div>
              <button onClick={() => setShowAddBlogModal(false)} className="p-2 rounded-xl bg-muted text-muted-foreground/40 hover:text-foreground transition-all transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleAddBlog} className="space-y-6 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Title</label>
                  <input type="text" required placeholder="e.g. TikTok Masterclass" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Category</label>
                  <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={newBlog.category} onChange={e => setNewBlog({...newBlog, category: e.target.value})}>
                    <option value="CPA BASICS">CPA BASICS</option>
                    <option value="TRAFFIC">TRAFFIC</option>
                    <option value="GETTING STARTED">GETTING STARTED</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Content Structure (HTML)</label>
                <textarea required rows="8" placeholder="Build the rich content here..." className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none focus:border-primary/40 transition-all resize-none leading-relaxed" value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Resource Access</label>
                  <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={newBlog.type} onChange={e => setNewBlog({...newBlog, type: e.target.value})}>
                    <option value="free">FREE ACCESS</option>
                    <option value="paid">PAID GATE</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest transition-colors">Media Assets</label>
                  <input type="file" multiple className="text-[10px] text-muted-foreground/20 transition-colors" onChange={handleFileUpload} />
                </div>
              </div>
              <div className="flex justify-end pt-6 border-t border-border transition-colors">
                <button type="submit" disabled={uploading} className="px-8 py-4 bg-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/30 transition-all disabled:opacity-50">Publish Instance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingBlog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-colors">
          <div className="bg-card border border-border w-full max-w-2xl rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
            <div className="flex justify-between items-center mb-8 transition-colors">
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight italic transition-colors">Modify Database Instance</h3>
              <button onClick={() => setShowEditBlogModal(false)} className="p-2 rounded-xl bg-muted text-muted-foreground/40 hover:text-foreground transition-colors"><X size={20}/></button>
            </div>
            <form onSubmit={handleEditBlog} className="space-y-6 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar transition-colors">
              <input type="text" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={editingBlog.title} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} />
              <textarea rows="8" className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors resize-none" value={editingBlog.content} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} />
              <div className="grid grid-cols-2 gap-6 transition-colors">
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={editingBlog.status} onChange={e => setEditingBlog({...editingBlog, status: e.target.value})}>
                  <option value="Published">PUBLISHED</option>
                  <option value="Draft">DRAFT</option>
                </select>
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm text-foreground focus:outline-none transition-colors" value={editingBlog.type} onChange={e => setEditingBlog({...editingBlog, type: e.target.value})}>
                  <option value="free">FREE</option>
                  <option value="paid">PAID</option>
                </select>
              </div>
              <div className="flex justify-end pt-6 border-t border-border transition-colors">
                <button type="submit" className="px-8 py-4 bg-primary text-black text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-primary/10 transition-colors">Overwrite Instance</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
