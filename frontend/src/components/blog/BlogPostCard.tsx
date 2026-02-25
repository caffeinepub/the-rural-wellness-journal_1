import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Calendar, Pencil, Trash2, Loader2 } from 'lucide-react';
import { BlogPost } from '../../backend';
import CategoryBadge from './CategoryBadge';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { useIsCallerAdmin, useDeleteBlogPost } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface BlogPostCardProps {
  post: BlogPost;
  onEdit?: (post: BlogPost) => void;
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getExcerpt(body: string, maxLength = 150): string {
  if (body.length <= maxLength) return body;
  return body.slice(0, maxLength).trimEnd() + '…';
}

export default function BlogPostCard({ post, onEdit }: BlogPostCardProps) {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const deletePost = useDeleteBlogPost();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleCardClick = () => {
    navigate({ to: '/blog/$id', params: { id: post.id.toString() } });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deletePost.mutateAsync(post.id);
    setDeleteOpen(false);
  };

  return (
    <article className="group bg-card rounded-lg border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col relative">
      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleEdit}
            title="Edit post"
          >
            <Pencil size={13} />
          </Button>
          <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="secondary"
                className="h-7 w-7 bg-white/90 hover:bg-destructive hover:text-white shadow-sm"
                onClick={(e) => e.stopPropagation()}
                title="Delete post"
              >
                <Trash2 size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{post.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deletePost.isPending}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  {deletePost.isPending ? (
                    <><Loader2 size={14} className="animate-spin mr-1.5" />Deleting…</>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div
        onClick={handleCardClick}
        className="cursor-pointer flex flex-col flex-1"
      >
        <div className="aspect-[16/9] overflow-hidden">
          {post.featuredImageUrl ? (
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <ImagePlaceholder
              variant="field"
              aspectRatio="landscape"
              className="w-full h-full rounded-none border-0 border-b border-dashed border-sage/30"
            />
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <CategoryBadge category={post.category} />
          </div>
          <h3 className="font-serif font-semibold text-lg text-foreground mb-2 group-hover:text-terracotta transition-colors leading-snug">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
            {getExcerpt(post.body)}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
            <Calendar size={12} />
            <time>{formatDate(post.publishedDate)}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
