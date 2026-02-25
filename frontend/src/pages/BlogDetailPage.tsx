import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Pencil, Trash2, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
import CategoryBadge from '../components/blog/CategoryBadge';
import ImagePlaceholder from '../components/common/ImagePlaceholder';
import { useGetBlogPost, useIsCallerAdmin, useUpdateBlogPost, useDeleteBlogPost } from '../hooks/useQueries';
import { BlogCategory } from '../backend';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface EditFormData {
  title: string;
  body: string;
  category: BlogCategory;
  featuredImageUrl: string;
}

export default function BlogDetailPage() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useGetBlogPost(BigInt(id ?? '0'));
  const { data: isAdmin } = useIsCallerAdmin();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isEditing, setIsEditing] = useState(false);
  const [editCategory, setEditCategory] = useState<BlogCategory | ''>('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<EditFormData>();

  const startEdit = () => {
    if (!post) return;
    reset({
      title: post.title,
      body: post.body,
      featuredImageUrl: post.featuredImageUrl ?? '',
    });
    setEditCategory(post.category);
    setEditSuccess('');
    setEditError('');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditSuccess('');
    setEditError('');
  };

  const onSubmitEdit = async (data: EditFormData) => {
    if (!post || !editCategory) return;
    setEditSuccess('');
    setEditError('');
    try {
      await updatePost.mutateAsync({
        id: post.id,
        title: data.title,
        body: data.body,
        category: editCategory as BlogCategory,
        featuredImageUrl: data.featuredImageUrl?.trim() || null,
      });
      setEditSuccess('Post updated successfully!');
      setIsEditing(false);
    } catch {
      setEditError('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    await deletePost.mutateAsync(post.id);
    navigate({ to: '/blog' });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Skeleton className="h-4 w-24 mb-8" />
        <Skeleton className="h-5 w-28 rounded-full mb-4" />
        <Skeleton className="h-10 w-3/4 mb-3" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="aspect-[16/9] w-full rounded-xl mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-serif text-2xl text-muted-foreground mb-4">Post not found</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/blog' })}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Button>
      </div>
    );
  }

  // Edit mode
  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Button
          variant="ghost"
          onClick={cancelEdit}
          className="gap-2 text-muted-foreground hover:text-foreground mb-8 -ml-2"
        >
          <X size={16} />
          Cancel Editing
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-terracotta/15 flex items-center justify-center">
            <Pencil size={18} className="text-terracotta" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Edit Blog Post</h1>
            <p className="text-sm text-muted-foreground">Update this journal entry</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
          <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-sm font-medium">Title *</Label>
              <Input
                id="edit-title"
                {...register('title', { required: 'Title is required' })}
                className="bg-ivory"
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category *</Label>
              <Select
                value={editCategory}
                onValueChange={(val) => {
                  setEditCategory(val as BlogCategory);
                  setValue('category', val as BlogCategory);
                }}
              >
                <SelectTrigger className="bg-ivory">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BlogCategory.personalStory}>Personal Story</SelectItem>
                  <SelectItem value={BlogCategory.interview}>Interview</SelectItem>
                  <SelectItem value={BlogCategory.clinicalObservation}>Clinical Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-body" className="text-sm font-medium">Content *</Label>
              <Textarea
                id="edit-body"
                rows={12}
                {...register('body', { required: 'Content is required' })}
                className="bg-ivory resize-none"
              />
              {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image" className="text-sm font-medium">
                Featured Image URL <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Input
                id="edit-image"
                placeholder="https://example.com/image.jpg"
                {...register('featuredImageUrl')}
                className="bg-ivory"
              />
            </div>

            {editSuccess && (
              <div className="flex items-center gap-2 text-sm text-sage bg-sage/10 border border-sage/20 rounded-md px-4 py-3">
                <CheckCircle size={16} />
                {editSuccess}
              </div>
            )}
            {editError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
                <AlertCircle size={16} />
                {editError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={updatePost.isPending || !editCategory}
                className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white"
              >
                {updatePost.isPending ? (
                  <><Loader2 size={16} className="animate-spin mr-2" />Saving…</>
                ) : (
                  'Save Changes'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/blog' })}
          className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Button>

        {/* Admin controls */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startEdit}
              className="gap-1.5 text-terracotta border-terracotta/30 hover:bg-terracotta/8"
            >
              <Pencil size={14} />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/8"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
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
      </div>

      {/* Success message after edit */}
      {editSuccess && (
        <div className="flex items-center gap-2 text-sm text-sage bg-sage/10 border border-sage/20 rounded-md px-4 py-3 mb-6">
          <CheckCircle size={16} />
          {editSuccess}
        </div>
      )}

      {/* Meta */}
      <div className="mb-5">
        <CategoryBadge category={post.category} size="md" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
        {post.title}
      </h1>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Calendar size={14} />
        <time>{formatDate(post.publishedDate)}</time>
      </div>

      {/* Featured Image */}
      {post.featuredImageUrl ? (
        <div className="rounded-xl overflow-hidden mb-10 shadow-card">
          <img
            src={post.featuredImageUrl}
            alt={post.title}
            className="w-full object-cover max-h-[480px]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className="mb-10">
          <ImagePlaceholder
            variant="field"
            aspectRatio="landscape"
            label="Field Photo Coming Soon"
            className="w-full rounded-xl"
          />
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-border" />
        <div className="w-2 h-2 rounded-full bg-terracotta" />
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Body */}
      <div className="prose prose-stone max-w-none font-sans text-foreground/90 leading-relaxed">
        {post.body.split('\n').map((paragraph, i) =>
          paragraph.trim() ? (
            <p key={i} className="mb-5 text-base leading-[1.85]">
              {paragraph}
            </p>
          ) : (
            <br key={i} />
          )
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/blog' })}
          className="gap-2 border-terracotta/30 text-terracotta hover:bg-terracotta/8"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Button>
      </div>
    </article>
  );
}
