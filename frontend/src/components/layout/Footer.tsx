import { Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'rural-wellness-journal';
  const appId = encodeURIComponent(hostname);

  return (
    <footer className="bg-warm-brown/5 border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <div className="w-7 h-7 rounded-full bg-terracotta flex items-center justify-center">
                <span className="text-white text-xs font-serif font-bold">RW</span>
              </div>
              <span className="font-serif font-semibold text-foreground">The Rural Wellness Journal</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Documenting mental health and healthcare accessibility in rural Vietnam.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/blog" className="hover:text-terracotta transition-colors">Blog</a>
              <a href="/portfolio" className="hover:text-terracotta transition-colors">Portfolio</a>
              <a href="/about" className="hover:text-terracotta transition-colors">About</a>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              © {year} The Rural Wellness Journal · Built with{' '}
              <Heart size={12} className="text-terracotta fill-terracotta" />{' '}
              using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
