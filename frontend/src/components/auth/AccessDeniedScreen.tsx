import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

interface AccessDeniedScreenProps {
  reason?: 'unauthenticated' | 'unauthorized';
  backTo?: string;
  backLabel?: string;
}

export default function AccessDeniedScreen({
  reason = 'unauthenticated',
  backTo = '/',
  backLabel = 'Go Home',
}: AccessDeniedScreenProps) {
  const navigate = useNavigate();
  const { login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    } catch (error: unknown) {
      const err = error as Error;
      if (err?.message === 'User is already authenticated') {
        // Already authenticated, just invalidate
        queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
        <ShieldAlert size={32} className="text-destructive/60" />
      </div>

      {reason === 'unauthenticated' ? (
        <>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Login Required</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            You must be logged in to access this page. Please sign in to continue.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="bg-terracotta hover:bg-terracotta/90 text-white gap-2"
            >
              <LogIn size={16} />
              {isLoggingIn ? 'Logging in…' : 'Login'}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: backTo as '/' })}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              {backLabel}
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">Access Denied</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            You don't have permission to access this page. This area is restricted to administrators.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: backTo as '/' })}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Button>
        </>
      )}
    </div>
  );
}
