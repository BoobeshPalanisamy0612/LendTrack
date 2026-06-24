import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { familyService } from '../services/familyService';
import { useAuth } from '../context/AuthContext';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import MemberRow from '../components/family/MemberRow';
import InviteMemberForm from '../components/family/InviteMemberForm';

const FamilySharing = () => {
  const { user, refreshUser } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const res = await familyService.getFamilyGroup();
      setGroup(res.familyGroup);
    } catch (err) {
      toast.error(err.message || 'Could not load family group');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await familyService.createFamilyGroup(`${user.name}'s Family`);
      setGroup(res.familyGroup);
      await refreshUser();
      toast.success('Family group created');
    } catch (err) {
      toast.error(err.message || 'Could not create family group');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const isOwner = group?.owner?._id === user?.id;

  return (
    <div className="mx-auto max-w-3xl">
      <SectionHeader title="Family sharing" subtitle="Share loan records with people you trust, with role-based access." />
      <LedgerDivider />

      {!group ? (
        <EmptyState
          title="You haven't set up a family group yet"
          description="Create one to start inviting family members to view (or help manage) your shared loan records."
          action={
            <Button onClick={handleCreate} loading={creating}>
              Create family group
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          <Card>
            <h3 className="mb-1 font-display text-lg font-semibold text-ledger-navy dark:text-ledger-cream">{group.name}</h3>
            <p className="mb-4 text-sm text-ledger-slate">
              {group.members.length} member{group.members.length === 1 ? '' : 's'} · Owned by {group.owner?.name}
            </p>
            <div className="divide-y divide-ledger-line dark:divide-ledger-lineDark">
              {group.members.map((m) => (
                <MemberRow key={m._id} member={m} isOwner={isOwner || user?.role === 'admin'} currentUserId={user?.id} onUpdated={setGroup} />
              ))}
            </div>
          </Card>

          {(isOwner || user?.role === 'admin') && (
            <Card>
              <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Invite someone new</h3>
              <InviteMemberForm onInvited={setGroup} />
            </Card>
          )}

          <div className="rounded-lg bg-ledger-cream/60 p-4 text-xs text-ledger-slate dark:bg-ledger-dark/40">
            <strong className="text-ledger-navy dark:text-ledger-cream">How roles work:</strong> Admins can add, edit, and
            delete any shared loan record. Members can view shared records but can't make changes.
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilySharing;
