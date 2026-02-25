import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, BookOpen, Image, User, Home, PenSquare, LayoutGrid } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsCallerAdmin();
  const location = useLocation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/blog', label: 'Blog', icon: BookOpen },
    { to: '/portfolio', label: 'Portfolio', icon: Image },
    { to: '/about', label: 'About', icon: User },
  ];

  const adminLinks = isAdmin
    ? [
        { to: '/admin/blog', label: 'New Post', icon: PenSquare },
        { to: '/admin/portfolio', label: 'New Essay', icon: LayoutGrid },
      ]
    : [];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center">
              <span className="text-white text-xs font-serif font-bold">RW</span>
            </div>
            <span className="font-serif font-semibold text-foreground text-sm sm:text-base leading-tight hidden sm:block">
              The Rural Wellness Journal
            </span>
            <span className="font-serif font-semibold text-foreground text-sm sm:hidden">
              RW Journal
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-terracotta bg-terracotta/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </Link>
            ))}
            {adminLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-sage bg-sage/10'
                    : 'text-sage hover:text-sage/80 hover:bg-sage/10'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className={isAuthenticated ? '' : 'bg-terracotta hover:bg-terracotta/90 text-white border-0'}
            >
              {isLoggingIn ? 'Logging in…' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
            <button
              className="md:hidden p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in">
            {[...navLinks, ...adminLinks].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'text-terracotta bg-terracotta/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
