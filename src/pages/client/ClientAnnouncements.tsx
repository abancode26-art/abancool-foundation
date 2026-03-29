import { sampleAnnouncements } from '@/data/placeholder';

export default function ClientAnnouncements() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold font-heading">Announcements</h1><p className="text-muted-foreground">Latest updates from Abancool</p></div>
      <div className="space-y-4 max-w-3xl">
        {sampleAnnouncements.map(ann => (
          <div key={ann.id} className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-bold font-heading mb-2">{ann.title}</h3>
            <p className="text-muted-foreground mb-3">{ann.content}</p>
            <span className="text-xs text-muted-foreground">{new Date(ann.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
