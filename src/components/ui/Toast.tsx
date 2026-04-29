import { Toaster as SonnerToaster, toast } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-outline-variant shadow-popover',
          title: 'text-label-md font-semibold',
          description: 'text-body-sm text-on-surface-variant',
        },
      }}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { toast };
