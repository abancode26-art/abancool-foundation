import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Key, Smartphone, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientSecurity() {
  const { user } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success('Password updated!');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold font-heading flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> Security Settings</h1><p className="text-muted-foreground">Manage your account security</p></div>

      {/* Email verification */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading font-semibold mb-3">Email Verification</h3>
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${user?.email_verified_at ? 'bg-success' : 'bg-warning'}`} />
          <span className="text-sm">{user?.email_verified_at ? 'Email verified' : 'Email not verified'}</span>
          {!user?.email_verified_at && <Button size="sm" variant="outline">Resend Verification</Button>}
        </div>
      </div>

      {/* Change password */}
      <form onSubmit={handleChangePassword} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-heading font-semibold flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> Change Password</h3>
        <div><label className="text-sm font-medium mb-1.5 block">Current Password</label>
          <div className="relative"><Input type={showPw ? 'text' : 'password'} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
        </div>
        <div><label className="text-sm font-medium mb-1.5 block">New Password</label><Input type="password" placeholder="Min 8 characters" required /></div>
        <div><label className="text-sm font-medium mb-1.5 block">Confirm New Password</label><Input type="password" placeholder="Repeat new password" required /></div>
        <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
      </form>

      {/* 2FA placeholder */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading font-semibold mb-2 flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /> Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
        <Button variant="outline" disabled>Coming Soon</Button>
      </div>
    </div>
  );
}
