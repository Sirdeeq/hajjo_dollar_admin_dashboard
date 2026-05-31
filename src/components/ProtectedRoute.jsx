import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
