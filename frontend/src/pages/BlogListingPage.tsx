import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { BlogCategory, type BlogPost } from '../backend';
import { useGetAllBlogPosts, useIsCallerAdmin } from '../hooks/useQueries';
import BlogPostCard from '../components/blog/BlogPostCard';
import CategoryBadge from '../components/blog/CategoryBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Personal Story', value: BlogCategory.personalStory },
  { label: 'Interview', value: BlogCategory.interview },
  { label: 'Clinical Observation', value: BlogCategory.clinicalObservation },
];

export default function BlogListingPage() {
  const { data: posts, isLoading } = useGetAllBlogPosts();
  const { data: isAdmin } = useIsCallerAdmin();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | null>(null);

  const filteredPosts = activeCategory
    ? posts?.filter((p) => p.category === activeCategory)
    : posts;

  const handleEdit = (post: BlogPost) => {
    navigate({ to: '/blog/$id', params: { id: post.id.toString() } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-terracotta text-sm font-medium mb-3">
          <BookOpen size={16} />
          <span className="tracking-wide uppercase text-xs">Journal</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Reflections on rural healthcare, personal stories from the field, and conversations with community members in Càng Long, Vietnam.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setActiveCategory(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              activeCategory === value
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-transparent text-foreground/70 border-border hover:border-terracotta/40 hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPosts && filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogPostCard
              key={post.id.toString()}
              post={post}
              onEdit={isAdmin ? handleEdit : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-border">
          <BookOpen size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          {activeCategory ? (
            <>
              <p className="font-serif text-xl text-muted-foreground mb-2">No posts in this category</p>
              <button
                onClick={() => setActiveCategory(null)}
                className="text-sm text-terracotta hover:underline"
              >
                View all posts
              </button>
            </>
          ) : (
            <>
              <p className="font-serif text-xl text-muted-foreground mb-2">No posts yet</p>
              <p className="text-sm text-muted-foreground">
                Journal entries will appear here once they are published.
              </p>
            </>
          )}
        </div>
      )}

      {/* Category legend */}
      {!isLoading && filteredPosts && filteredPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Categories</p>
          <div className="flex flex-wrap gap-2">
            {[BlogCategory.personalStory, BlogCategory.interview, BlogCategory.clinicalObservation].map((cat) => (
              <CategoryBadge key={cat} category={cat} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
