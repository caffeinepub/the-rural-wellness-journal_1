import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, PenSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import CreateBlogPostForm from '../components/blog/CreateBlogPostForm';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (!identity) {
    return <AccessDeniedScreen reason="unauthenticated" backTo="/blog" backLabel="Back to Blog" />;
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
    return <AccessDeniedScreen reason="unauthorized" backTo="/blog" backLabel="Back to Blog" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/blog' })}
        className="gap-2 text-muted-foreground hover:text-foreground mb-8 -ml-2"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-terracotta/15 flex items-center justify-center">
          <PenSquare size={18} className="text-terracotta" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">New Blog Post</h1>
          <p className="text-sm text-muted-foreground">Publish a new entry to the journal</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
        <CreateBlogPostForm onSuccess={() => navigate({ to: '/blog' })} />
      </div>
    </div>
  );
}
