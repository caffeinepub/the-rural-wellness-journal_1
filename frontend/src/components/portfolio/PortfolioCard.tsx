import { useState } from 'react';
import { MapPin, Pencil, Trash2, Loader2 } from 'lucide-react';
import { PortfolioItem } from '../../backend';
import ImagePlaceholder from '../common/ImagePlaceholder';
import { useIsCallerAdmin, useDeletePortfolioItem } from '../../hooks/useQueries';
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

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: () => void;
  onEdit?: (item: PortfolioItem) => void;
}

export default function PortfolioCard({ item, onClick, onEdit }: PortfolioCardProps) {
  const coverImage = item.imageUrls[0];
  const { data: isAdmin } = useIsCallerAdmin();
  const deleteItem = useDeletePortfolioItem();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteItem.mutateAsync(item.id);
    setDeleteOpen(false);
  };

  return (
    <article className="group relative rounded-lg overflow-hidden bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
            onClick={handleEdit}
            title="Edit item"
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
                title="Delete item"
              >
                <Trash2 size={13} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Portfolio Item</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{item.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteItem.isPending}
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  {deleteItem.isPending ? (
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

      <div onClick={onClick} className="cursor-pointer">
        <div className="aspect-[4/3] relative overflow-hidden bg-muted">
          {coverImage ? (
            <img
              src={coverImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <ImagePlaceholder
              variant="field"
              aspectRatio="landscape"
              label="Field Photo Coming Soon"
              className="w-full h-full rounded-none border-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white text-sm font-sans leading-relaxed line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif font-semibold text-foreground group-hover:text-terracotta transition-colors mb-2 leading-snug">
            {item.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin size={12} className="text-terracotta" />
            <span>{item.location}</span>
          </div>
          {item.imageUrls.length > 1 && (
            <p className="text-xs text-muted-foreground mt-1.5">
              {item.imageUrls.length} photos
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
