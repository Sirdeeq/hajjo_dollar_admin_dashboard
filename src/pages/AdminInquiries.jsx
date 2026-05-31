import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Filter,
  MessageSquare,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminInquiries() {
  const [contacts, setContacts] = useState([
    { _id: '1', name: 'Ngozi Okafor', email: 'ngozi.o@gmail.com', message: 'I want to enroll in the 1-on-1 Mentorship program. Is there a payment plan available?', status: 'New', createdAt: '2026-05-27T10:00:00Z' },
    { _id: '2', name: 'Tunde Bakare', email: 'tunde.b@yahoo.com', message: 'Hello, do you accept CPA Beginner Course applications from outside Nigeria? I am in Ghana.', status: 'Replied', createdAt: '2026-05-24T15:30:00Z' },
  ]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  const toggleStatus = (id) => {
    setContacts(prev => prev.map(c => c._id === id ? { ...c, status: c.status === 'New' ? 'Replied' : 'New' } : c));
  };

  const handleDelete = (id) => {
    if(confirm('Archive this message?')) {
      setContacts(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tight transition-colors duration-300">Signal <span className="text-primary italic transition-colors">Intelligence</span></h2>
          <p className="text-muted-foreground text-xs mt-1 uppercase tracking-widest font-mono transition-colors duration-300">Process incoming transmissions and user inquiries.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="FILTER BY SENDER OR KEYWORD..." 
            className="w-full bg-card border border-border rounded-2xl py-4 pl-12 pr-4 text-[10px] text-foreground focus:outline-none focus:border-primary/30 transition-all font-mono uppercase tracking-[0.2em]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* INQUIRIES LIST */}
      <div className="space-y-4">
        {filtered.map((msg) => (
          <div key={msg._id} className="group relative bg-card border border-border rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row gap-6 hover:border-foreground/10 transition-all overflow-hidden transition-colors duration-300 shadow-sm">
             
             {/* Status line */}
             <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${msg.status === 'New' ? 'bg-primary' : 'bg-muted'}`} />

             <div className="flex-1 space-y-4">
               <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-black text-muted-foreground/40 transition-colors">
                      {msg.name[0]}
                   </div>
                   <span className="text-sm font-black text-foreground uppercase tracking-tight transition-colors">{msg.name}</span>
                 </div>
                 <span className="text-[10px] text-muted-foreground/20 font-mono lowercase transition-colors">{msg.email}</span>
                 <div className="flex items-center gap-2 text-[10px] text-muted-foreground/20 font-mono uppercase ml-auto transition-colors">
                    <Clock size={12}/>
                    {new Date(msg.createdAt).toLocaleDateString()}
                 </div>
               </div>
               
               <div className="bg-muted border border-border rounded-2xl p-5 transition-colors">
                 <p className="text-xs sm:text-sm text-foreground/70 leading-relaxed italic transition-colors">"{msg.message}"</p>
               </div>

               <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleStatus(msg._id)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all transition-colors
                      ${msg.status === 'New' 
                        ? 'bg-primary text-black hover:bg-primary/90 shadow-lg shadow-primary/20' 
                        : 'bg-muted text-muted-foreground/40 hover:bg-muted/80 hover:text-foreground'}
                    `}
                  >
                    {msg.status === 'New' ? 'Mark Processed' : 'Re-open Signal'}
                  </button>
                  <button 
                    onClick={() => handleDelete(msg._id)}
                    className="p-2 rounded-xl bg-muted text-muted-foreground/20 hover:text-red-600 hover:bg-red-500/10 transition-all transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
               </div>
             </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center space-y-4 transition-colors">
           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground/20 transition-colors">
              <AlertCircle size={32} />
           </div>
           <p className="text-muted-foreground/20 uppercase tracking-[0.3em] text-[10px] font-bold transition-colors">No active signals found in the matrix.</p>
        </div>
      )}

    </div>
  );
}
