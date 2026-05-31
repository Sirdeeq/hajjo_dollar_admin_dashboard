import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Lock, Mail, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500"
      style={{
        backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}
    >
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-green-900/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 transition-colors">
        {/* Logo / Branding */}
        <div className="text-center mb-8 transition-colors">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border mb-4 backdrop-blur-md transition-colors">
            <ShieldCheck className="text-primary" size={14} />
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-semibold transition-colors">Secure Gate</span>
          </div>
          <div className="flex justify-center mb-2 transition-colors">
            <img
              src="/HAJJO DOLLARS WEALTH SOLUTIONS LOGO icon.png"
              alt="Hajjo Dollars Wealth Solutions Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.15)] adaptive-logo"
            />
          </div>
          <p className="text-muted-foreground/40 text-[10px] uppercase tracking-[0.25em] transition-colors">Wealth Solutions · Admin Terminal</p>
        </div>

        {/* Login Card */}
        <div className="bg-card/70 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          {/* Top subtle ambient light line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="mb-6 transition-colors">
            <h2 className="text-xl font-bold text-foreground tracking-tight transition-colors">System Sign In</h2>
            <p className="text-muted-foreground/50 text-xs mt-1 transition-colors">Enter your administrative credentials to continue.</p>
          </div>
          
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-start gap-2.5 animate-fadeIn transition-colors">
              <AlertCircle className="flex-shrink-0 mt-0.5 transition-colors" size={14} />
              <div className="font-medium transition-colors">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 transition-colors">
            <div className="transition-colors">
              <label className="block text-muted-foreground/50 text-[10px] uppercase tracking-widest mb-1.5 px-1 font-semibold transition-colors">
                Identity
              </label>
              <div className="relative transition-colors">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 transition-colors" size={16} />
                <input
                  type="email"
                  required
                  placeholder="admin@hajjodollars.com"
                  className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 pl-11 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/5 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="transition-colors">
              <div className="flex justify-between items-center mb-1.5 px-1 transition-colors">
                <label className="block text-muted-foreground/50 text-[10px] uppercase tracking-widest font-semibold transition-colors">
                  Secret Key
                </label>
              </div>
              <div className="relative transition-colors">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 transition-colors" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 pl-11 pr-12 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-3 focus:ring-primary/5 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-xs bg-gradient-to-r from-primary to-emerald-700 text-black font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/20 hover:from-primary hover:to-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin text-black transition-colors" size={15} />
                  <span className="transition-colors">AUTHORIZING SYSTEM ENTRY...</span>
                </>
              ) : (
                <span className="transition-colors">ACCESS CONTROL CENTER</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-muted-foreground/20 text-[9px] uppercase tracking-widest transition-colors">
          Strictly authorized personnel only. Logins are encrypted and audited.
        </p>
      </div>
    </div>
  );
}
