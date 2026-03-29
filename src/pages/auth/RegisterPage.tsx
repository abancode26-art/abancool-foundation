import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPw) { toast.error('Passwords do not match'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"><span className="text-xl font-bold text-primary-foreground">A</span></div>
            <span className="text-2xl font-bold font-heading">Abancool</span>
          </Link>
          <h1 className="text-2xl font-bold font-heading mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start hosting with Abancool today</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="text-sm font-medium mb-1.5 block">Full Name</label><Input value={name} onChange={e => setName(e.target.value)} placeholder="John Mwangi" required /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><EyeOff className="h-4 w-4" /></button>
              </div>
            </div>
            <div><label className="text-sm font-medium mb-1.5 block">Confirm Password</label><Input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" required /></div>
            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-semibold">{loading ? 'Creating account...' : 'Create Account'}</Button>
          </form>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  );
}
