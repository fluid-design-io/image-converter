/* eslint-disable react/require-default-props */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader, Plus } from 'lucide-react';

function UploadButton({
  loading,
  onUpload,
  className = '',
  variant = 'default',
  icon = false,
}: {
  loading: boolean;
  onUpload: (files: File[]) => Promise<void>;
  className?: string;
  variant?: 'default' | 'ghost';
  icon?: boolean;
}) {
  return (
    <>
      {loading ? (
        <Button size="icon" variant="outline" className={cn(className)}>
          <Loader className="size-3 animate-spin" />
        </Button>
      ) : (
        <Button
          size={icon ? 'icon' : 'sm'}
          variant={variant}
          className={cn(className, 'cursor-pointer')}
          asChild
        >
          <label htmlFor="upload">
            <span className={cn(icon && 'sr-only')}>Choose a file</span>
            {icon ? <Plus className="size-3.5" /> : null}
          </label>
        </Button>
      )}
      <input
        className="sr-only"
        type="file"
        id="upload"
        multiple
        onChange={async (event) => {
          if (!event.target.files) return;
          const files = Array.from(event.target.files);
          // eslint-disable-next-line no-unused-expressions
          files.length && (await onUpload(files));
        }}
        disabled={loading}
        hidden
        // images: jpg, jpeg, png, webp, avif only
        accept="image/jpeg, image/png, image/webp, image/avif"
      />
    </>
  );
}

export default UploadButton;
