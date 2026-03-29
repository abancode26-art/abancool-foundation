import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleDomainResults } from '@/data/placeholder';
import type { DomainSearchResult } from '@/types';

interface DomainSearchProps {
  variant?: 'hero' | 'compact';
  onAddToCart?: (result: DomainSearchResult) => void;
}

export function DomainSearch({ variant = 'hero', onAddToCart }: DomainSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    // Kiro: Replace with POST /domains/search
    await new Promise(r => setTimeout(r, 600));
    setResults(sampleDomainResults.map(r => ({ ...r, domain: query.replace(/\..+$/, '') + r.tld })));
    setSearched(true);
    setLoading(false);
  };

  const isHero = variant === 'hero';

  return (
    <div className={isHero ? 'w-full max-w-2xl mx-auto' : 'w-full'}>
      <div className={`flex gap-2 ${isHero ? 'flex-col sm:flex-row' : ''}`}>
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Find your perfect domain name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className={`pl-12 ${isHero ? 'h-14 text-base rounded-xl bg-card border-2 border-border/50 focus:border-primary' : 'h-11'}`}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={loading}
          className={`btn-primary-glow ${isHero ? 'h-14 px-8 rounded-xl text-base font-semibold' : 'h-11 px-6'}`}
        >
          {loading ? 'Searching...' : 'Search Domain'}
        </Button>
      </div>

      {searched && (
        <div className="mt-4 space-y-2 animate-fade-in">
          {results.map(result => (
            <div key={result.domain} className={`flex items-center justify-between rounded-lg border p-3 ${result.available ? 'bg-success/5 border-success/20' : 'bg-muted/50 border-border'}`}>
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${result.available ? 'bg-success' : 'bg-destructive'}`} />
                <span className="font-semibold font-heading">{result.domain}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{result.currency} {result.price.toLocaleString()}/yr</span>
                {result.available ? (
                  <Button size="sm" onClick={() => onAddToCart?.(result)}>Add to Cart</Button>
                ) : (
                  <span className="text-sm text-muted-foreground">Taken</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
