import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Mail, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  Search as SearchIcon,
  CreditCard,
  UserCircle
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { admin, logout } = useAdmin();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Console', icon: LayoutDashboard, path: '/' },
    { id: 'blogs', label: 'Library', icon: FileText, path: '/blogs' },
    { id: 'academy', label: 'Academy', icon: BookOpen, path: '/academy' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
    { id: 'inquiries', label: 'Signals', icon: Mail, path: '/inquiries' },
    { id: 'settings', label: 'System', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-x-hidden transition-colors duration-300">
      
      {/* MOBILE HEADER */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card/90 backdrop-blur-xl border-b border-border px-6 flex items-center justify-between z-40 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img src="/HAJJO DOLLARS WEALTH SOLUTIONS LOGO icon.png" alt="Logo" className="h-10 w-auto adaptive-logo" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden transition-colors duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[60] w-72 bg-card border-r border-border 
        transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-colors duration-300
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 pb-10">
            <Link to="/" className="flex flex-col items-center text-center space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                <img src="/HAJJO DOLLARS WEALTH SOLUTIONS LOGO icon.png" alt="Hajjo Dollars" className="relative h-24 w-auto object-contain adaptive-logo drop-shadow-2xl" />
              </div>
              <div>
                <h1 className="font-serif font-black text-xs tracking-[0.3em] text-foreground uppercase transition-colors duration-300">Hajjo Dollars</h1>
                <p className="text-[8px] text-muted-foreground uppercase tracking-[0.4em] mt-1 font-mono transition-colors duration-300">Operations Command</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group
                    ${isActive 
                      ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(34,197,94,0.02)]' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'}
                  `}
                >
                  <item.icon size={16} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer Card */}
          <div className="p-6">
             <div className="bg-muted border border-border rounded-3xl p-5 space-y-4 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20 overflow-hidden">
                    {admin?.profilePicture ? (
                      <img
                        src={admin.profilePicture}
                        alt={admin.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] font-black text-foreground truncate uppercase tracking-tighter transition-colors duration-300">{admin?.name || 'ADMIN'}</p>
                    <p className="text-[8px] text-muted-foreground truncate font-mono transition-colors duration-300">{admin?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 rounded-2xl bg-background hover:bg-red-500/10 text-muted-foreground hover:text-red-600 text-[9px] font-black uppercase tracking-widest transition-all border border-border hover:border-red-500/20"
                >
                  Terminate Link
                </button>
             </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col lg:pl-72 min-h-screen">
        
        {/* Top Header - Desktop Only */}
        <header className="hidden lg:flex h-24 items-center justify-between px-6 lg:px-10 border-b border-border transition-colors duration-300">
          <div className="flex items-center gap-6">
             <div className="flex flex-col">
               <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] transition-colors duration-300">Sector Alpha</span>
               <span className="text-xs font-bold text-foreground uppercase tracking-widest mt-0.5 transition-colors duration-300 truncate max-w-[200px]">Secure Environment Established</span>
             </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-muted border border-border rounded-2xl transition-colors duration-300">
               <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground transition-colors duration-300">Node Sync Active</span>
            </div>
            <ThemeToggle />
            <button className="p-3 rounded-2xl bg-muted border border-border text-muted-foreground hover:text-foreground transition-all relative shrink-0">
              <Bell size={18} />
              <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <section className="flex-1 p-4 sm:p-8 lg:p-10 pt-20 lg:pt-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </section>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(var(--foreground), 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(var(--primary), 0.2); }
      `}} />
    </div>
  );
}
