import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreatePortfolioItem } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  location: string;
}

interface CreatePortfolioFormProps {
  onSuccess?: () => void;
}

export default function CreatePortfolioForm({ onSuccess }: CreatePortfolioFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { location: 'Càng Long, Vietnam' },
  });
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const createItem = useCreatePortfolioItem();

  const addImageUrl = () => setImageUrls((prev) => [...prev, '']);
  const removeImageUrl = (index: number) => setImageUrls((prev) => prev.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) => {
    setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const onSubmit = async (data: FormData) => {
    setSuccessMsg('');
    setErrorMsg('');
    const validUrls = imageUrls.filter((url) => url.trim() !== '');
    try {
      await createItem.mutateAsync({
        title: data.title,
        description: data.description,
        imageUrls: validUrls,
        location: data.location,
      });
      setSuccessMsg('Photo essay added successfully!');
      reset({ location: 'Càng Long, Vietnam' });
      setImageUrls(['']);
      onSuccess?.();
    } catch (err) {
      setErrorMsg('Failed to add photo essay. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
        <Input
          id="title"
          placeholder="Enter essay title…"
          {...register('title', { required: 'Title is required' })}
          className="bg-ivory"
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
        <Textarea
          id="description"
          placeholder="Describe this photo essay…"
          rows={5}
          {...register('description', { required: 'Description is required' })}
          className="bg-ivory resize-none"
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Image URLs</Label>
        {imageUrls.map((url, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => updateImageUrl(index, e.target.value)}
              placeholder={`https://example.com/photo-${index + 1}.jpg`}
              className="bg-ivory flex-1"
            />
            {imageUrls.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeImageUrl(index)}
                className="shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImageUrl}
          className="text-sage border-sage/30 hover:bg-sage/10"
        >
          <Plus size={14} className="mr-1.5" />
          Add Image URL
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">Location</Label>
        <Input
          id="location"
          {...register('location')}
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
        disabled={createItem.isPending}
        className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
      >
        {createItem.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Saving…
          </>
        ) : (
          'Add Photo Essay'
        )}
      </Button>
    </form>
  );
}
