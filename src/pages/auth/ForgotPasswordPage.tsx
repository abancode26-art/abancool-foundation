import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent!');
    } catch {
      toast.error('Failed to send reset link');
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
          <h1 className="text-2xl font-bold font-heading mb-2">Forgot Password</h1>
          <p className="text-muted-foreground">We'll send you a link to reset your password</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto"><span className="text-2xl">✉️</span></div>
              <h2 className="font-heading font-semibold">Check Your Email</h2>
              <p className="text-sm text-muted-foreground">We sent a password reset link to <strong>{email}</strong></p>
              <Button variant="outline" onClick={() => setSent(false)} className="w-full">Try another email</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-semibold">{loading ? 'Sending...' : 'Send Reset Link'}</Button>
            </form>
          )}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6"><Link to="/login" className="text-primary font-medium hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}
