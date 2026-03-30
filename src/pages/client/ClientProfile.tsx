import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ClientProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    toast.success('Profile updated!');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Profile Settings</h1><p className="text-muted-foreground">Manage your personal information</p></div>

      <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="text-sm font-medium mb-1.5 block">Full Name</label><Input defaultValue={user?.full_name} /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Email</label><Input defaultValue={user?.email} type="email" /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Phone</label><Input placeholder="+254 700 000 000" /></div>
          <div><label className="text-sm font-medium mb-1.5 block">Company (Optional)</label><Input placeholder="Company name" /></div>
        </div>
        <div className="border-t border-border pt-6">
          <h3 className="font-heading font-semibold mb-4">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2"><label className="text-sm font-medium mb-1.5 block">Address Line 1</label><Input placeholder="Street address" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">City</label><Input placeholder="Nairobi" /></div>
            <div><label className="text-sm font-medium mb-1.5 block">Country</label><Input placeholder="Kenya" /></div>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="h-11 px-6">{loading ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
}
