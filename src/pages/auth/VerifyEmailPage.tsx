import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary"><span className="text-xl font-bold text-primary-foreground">A</span></div>
          <span className="text-2xl font-bold font-heading">Abancool</span>
        </Link>
        <div className="rounded-xl border border-border bg-card p-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><Mail className="h-8 w-8 text-primary" /></div>
          <h1 className="text-2xl font-bold font-heading mb-2">Verify Your Email</h1>
          <p className="text-muted-foreground mb-6">We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.</p>
          <Button variant="outline" className="w-full mb-3">Resend Verification Email</Button>
          <Button variant="ghost" asChild className="w-full"><Link to="/login">Back to Login</Link></Button>
        </div>
      </div>
    </div>
  );
}
