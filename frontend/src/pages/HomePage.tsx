import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, BookOpen, Camera, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import BlogPostCard from '../components/blog/BlogPostCard';
import { useGetAllBlogPosts, useGetAllPortfolioItems } from '../hooks/useQueries';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: posts, isLoading: postsLoading } = useGetAllBlogPosts();
  const { data: portfolioItems, isLoading: portfolioLoading } = useGetAllPortfolioItems();

  const recentPosts = posts ? [...posts].reverse().slice(0, 3) : [];
  const portfolioCount = portfolioItems?.length ?? 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-terracotta/8 border-b border-terracotta/15 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
          <div className="max-w-2xl">
            <p className="text-terracotta text-xs font-medium tracking-widest uppercase mb-4">
              Rural Wellness Journal
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Mental Health in Rural Vietnam
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
              Documenting the mental health landscape and healthcare accessibility in Càng Long, Vietnam — through personal stories, interviews, and clinical observations.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate({ to: '/blog' })}
                className="gap-2 bg-terracotta hover:bg-terracotta/90 text-white"
              >
                <BookOpen size={16} />
                Read the Journal
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/portfolio' })}
                className="gap-2 border-terracotta/30 text-terracotta hover:bg-terracotta/8"
              >
                <Camera size={16} />
                View Field Photos
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
          <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-terracotta" />
          <div className="absolute bottom-8 right-32 w-40 h-40 rounded-full bg-sage" />
        </div>
      </section>

      {/* Mission Strip */}
      <section className="bg-card border-b border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: BookOpen,
                label: 'Personal Stories',
                desc: 'First-hand accounts from the community',
              },
              {
                icon: Users,
                label: 'Interviews',
                desc: 'Conversations with residents & healthcare workers',
              },
              {
                icon: Camera,
                label: 'Field Documentation',
                desc: 'Visual records from Càng Long',
              },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <Icon size={18} className="text-terracotta" />
                </div>
                <p className="font-serif font-semibold text-sm text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-terracotta text-xs font-medium tracking-widest uppercase mb-1">
              Latest Entries
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              From the Journal
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/blog' })}
            className="gap-1.5 text-terracotta hover:text-terracotta hover:bg-terracotta/8 text-sm"
          >
            All posts
            <ArrowRight size={14} />
          </Button>
        </div>

        {postsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border border-border overflow-hidden">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
            <p className="font-serif text-lg">No journal entries yet.</p>
            <p className="text-sm mt-1">Check back soon for the first post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogPostCard key={post.id.toString()} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Portfolio Teaser */}
      <section className="bg-sage-light/20 border-t border-sage/15 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sage text-xs font-medium tracking-widest uppercase mb-2">
            Field Documentation
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Photo Portfolio
          </h2>
          <p className="text-muted-foreground text-base max-w-lg mx-auto mb-8 leading-relaxed">
            {portfolioLoading
              ? 'Loading portfolio…'
              : portfolioCount > 0
                ? `${portfolioCount} photo ${portfolioCount === 1 ? 'series' : 'series'} documenting life and healthcare in Càng Long.`
                : 'Visual documentation of rural healthcare and community life in Càng Long, Vietnam.'}
          </p>
          <Button
            onClick={() => navigate({ to: '/portfolio' })}
            variant="outline"
            className="gap-2 border-sage/40 text-sage hover:bg-sage/10"
          >
            <Camera size={16} />
            Explore the Portfolio
          </Button>
        </div>
      </section>
    </div>
  );
}
