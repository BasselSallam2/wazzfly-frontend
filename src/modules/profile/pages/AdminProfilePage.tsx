import { PageHeader } from '@components/layout/PageHeader';
import { ProfileForm } from '../components/ProfileForm';
import { UpdatePasswordCard } from '../components/UpdatePasswordCard';
import { useCurrentUser } from '@lib/auth/useCurrentUser';
import { LoadingState } from '@components/feedback/LoadingState';

export function AdminProfilePage() {
  const user = useCurrentUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profile" description="Manage your admin identity and credentials." />
      {!user ? (
        <LoadingState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <ProfileForm user={user} />
          <UpdatePasswordCard />
        </div>
      )}
    </div>
  );
}
