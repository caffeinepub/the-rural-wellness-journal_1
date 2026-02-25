import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BlogCategory } from '../../backend';
import { useCreateBlogPost } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface FormData {
  title: string;
  body: string;
  category: BlogCategory;
  featuredImageUrl: string;
}

interface CreateBlogPostFormProps {
  onSuccess?: () => void;
}

export default function CreateBlogPostForm({ onSuccess }: CreateBlogPostFormProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | ''>('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createPost = useCreateBlogPost();

  const onSubmit = async (data: FormData) => {
    if (!selectedCategory) return;
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await createPost.mutateAsync({
        title: data.title,
        body: data.body,
        category: selectedCategory as BlogCategory,
        featuredImageUrl: data.featuredImageUrl?.trim() || null,
      });
      setSuccessMsg('Post published successfully!');
      reset();
      setSelectedCategory('');
      onSuccess?.();
    } catch (err) {
      setErrorMsg('Failed to publish post. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
        <Input
          id="title"
          placeholder="Enter post title…"
          {...register('title', { required: 'Title is required' })}
          className="bg-ivory"
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
        <Select
          value={selectedCategory}
          onValueChange={(val) => {
            setSelectedCategory(val as BlogCategory);
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
        {!selectedCategory && errors.category && (
          <p className="text-xs text-destructive">Category is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" className="text-sm font-medium">Content *</Label>
        <Textarea
          id="body"
          placeholder="Write your post content here…"
          rows={10}
          {...register('body', { required: 'Content is required' })}
          className="bg-ivory resize-none"
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="featuredImageUrl" className="text-sm font-medium">
          Featured Image URL <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="featuredImageUrl"
          placeholder="https://example.com/image.jpg"
          {...register('featuredImageUrl')}
          className="bg-ivory"
        />
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-sm text-sage bg-sage/10 border border-sage/20 rounded-md px-4 py-3">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      <Button
        type="submit"
        disabled={createPost.isPending || !selectedCategory}
        className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
      >
        {createPost.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Publishing…
          </>
        ) : (
          'Publish Post'
        )}
      </Button>
    </form>
  );
}
