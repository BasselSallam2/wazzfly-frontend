import { Link } from 'react-router-dom';
import { Button } from '@components/ui/Button';
import { Icon } from '@components/ui/Icon';
import { ROUTES } from '@/config/constants';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
        <Icon name="travel_explore" size={32} />
      </span>
      <div>
        <h1 className="text-display font-bold text-on-surface">404</h1>
        <p className="text-body-lg text-on-surface-variant">We couldn’t find that page.</p>
      </div>
      <Button asChild iconLeft="arrow_back">
        <Link to={ROUTES.overview}>Back to overview</Link>
      </Button>
    </div>
  );
}
