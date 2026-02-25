import { useState } from 'react';
import { Image, Pencil, X, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { PortfolioItem } from '../backend';
import { useGetAllPortfolioItems, useIsCallerAdmin, useUpdatePortfolioItem } from '../hooks/useQueries';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import PortfolioLightbox from '../components/portfolio/PortfolioLightbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface EditFormData {
  title: string;
  description: string;
  location: string;
}

export default function PortfolioPage() {
  const { data: items, isLoading } = useGetAllPortfolioItems();
  const { data: isAdmin } = useIsCallerAdmin();
  const updateItem = useUpdatePortfolioItem();

  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editImageUrls, setEditImageUrls] = useState<string[]>(['']);
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFormData>();

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description,
      location: item.location,
    });
    setEditImageUrls(item.imageUrls.length > 0 ? [...item.imageUrls] : ['']);
    setEditSuccess('');
    setEditError('');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditSuccess('');
    setEditError('');
  };

  const addEditImageUrl = () => setEditImageUrls((prev) => [...prev, '']);
  const removeEditImageUrl = (index: number) => setEditImageUrls((prev) => prev.filter((_, i) => i !== index));
  const updateEditImageUrl = (index: number, value: string) => {
    setEditImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)));
  };

  const onSubmitEdit = async (data: EditFormData) => {
    if (!editingItem) return;
    setEditSuccess('');
    setEditError('');
    const validUrls = editImageUrls.filter((url) => url.trim() !== '');
    try {
      await updateItem.mutateAsync({
        id: editingItem.id,
        title: data.title,
        description: data.description,
        imageUrls: validUrls,
        location: data.location,
      });
      setEditSuccess('Photo essay updated successfully!');
      setEditingItem(null);
    } catch {
      setEditError('Failed to update photo essay. Please try again.');
    }
  };

  // Edit mode
  if (editingItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Button
          variant="ghost"
          onClick={cancelEdit}
          className="gap-2 text-muted-foreground hover:text-foreground mb-8 -ml-2"
        >
          <X size={16} />
          Cancel Editing
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-sage/15 flex items-center justify-center">
            <Pencil size={18} className="text-sage" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Edit Photo Essay</h1>
            <p className="text-sm text-muted-foreground">Update this portfolio item</p>
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
              <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
              <Textarea
                id="edit-description"
                rows={5}
                {...register('description', { required: 'Description is required' })}
                className="bg-ivory resize-none"
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Image URLs</Label>
              {editImageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => updateEditImageUrl(index, e.target.value)}
                    placeholder={`https://example.com/photo-${index + 1}.jpg`}
                    className="bg-ivory flex-1"
                  />
                  {editImageUrls.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeEditImageUrl(index)}
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
                onClick={addEditImageUrl}
                className="text-sage border-sage/30 hover:bg-sage/10"
              >
                <Plus size={14} className="mr-1.5" />
                Add Image URL
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location" className="text-sm font-medium">Location</Label>
              <Input
                id="edit-location"
                {...register('location')}
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
                disabled={updateItem.isPending}
                className="flex-1 bg-terracotta hover:bg-terracotta/90 text-white"
              >
                {updateItem.isPending ? (
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sage text-sm font-medium mb-3">
          <Image size={16} />
          <span className="tracking-wide uppercase text-xs">Visual Stories</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">Portfolio</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Photo essays documenting healthcare accessibility and daily life in Càng Long, Vietnam — a visual record of community, resilience, and care.
        </p>
      </div>

      {/* Success message */}
      {editSuccess && (
        <div className="flex items-center gap-2 text-sm text-sage bg-sage/10 border border-sage/20 rounded-md px-4 py-3 mb-6">
          <CheckCircle size={16} />
          {editSuccess}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-lg border border-border overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <PortfolioCard
              key={item.id.toString()}
              item={item}
              onClick={() => setSelectedItem(item)}
              onEdit={isAdmin ? startEdit : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-border">
          <Image size={48} className="mx-auto text-muted-foreground/30 mb-4" />
          <p className="font-serif text-xl text-muted-foreground mb-2">No photo essays yet</p>
          <p className="text-sm text-muted-foreground">
            Photo essays will appear here once they are added.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {selectedItem && (
        <PortfolioLightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
