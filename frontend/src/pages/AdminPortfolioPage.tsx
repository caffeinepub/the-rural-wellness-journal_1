import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreatePortfolioForm from '../components/portfolio/CreatePortfolioForm';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';

export default function AdminPortfolioPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return <AccessDeniedScreen reason="unauthenticated" backTo="/portfolio" backLabel="Back to Portfolio" />;
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen reason="unauthorized" backTo="/portfolio" backLabel="Back to Portfolio" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/portfolio' })}
        className="gap-2 text-muted-foreground hover:text-foreground mb-8 -ml-2"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center">
          <LayoutGrid size={18} className="text-sage" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">New Photo Essay</h1>
          <p className="text-sm text-muted-foreground">Add a new photo essay to the portfolio</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
        <CreatePortfolioForm onSuccess={() => navigate({ to: '/portfolio' })} />
      </div>
    </div>
  );
}
