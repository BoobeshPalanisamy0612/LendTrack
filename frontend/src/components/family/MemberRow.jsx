import { useState } from 'react';
import toast from 'react-hot-toast';
import { familyService } from '../../services/familyService';
import ConfirmDialog from '../ui/ConfirmDialog';

const MemberRow = ({ member, isOwner, currentUserId, onUpdated }) => {
  const [updating, setUpdating] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const name = member.user?.name || member.email;
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isSelf = member.user?._id === currentUserId;

  const toggleRole = async () => {
    setUpdating(true);
    try {
      const newRole = member.role === 'admin' ? 'member' : 'admin';
      const res = await familyService.updateMemberRole(member._id, newRole);
      onUpdated(res.familyGroup);
      toast.success(`${name} is now ${newRole}`);
    } catch (err) {
      toast.error(err.message || 'Could not update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await familyService.removeMember(member._id);
      onUpdated(res.familyGroup);
      toast.success(`${name} removed from family group`);
    } catch (err) {
      toast.error(err.message || 'Could not remove member');
    } finally {
      setRemoveOpen(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ledger-navy/10 text-sm font-semibold text-ledger-navy dark:bg-ledger-cream/10 dark:text-ledger-cream">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-ledger-navy dark:text-ledger-cream">{name}</p>
          <p className="text-xs text-ledger-slate">
            {member.email} · {member.status === 'pending' ? 'Invite pending' : 'Joined'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`badge ${member.role === 'admin' ? 'badge-success' : 'badge-neutral'}`}>{member.role}</span>
        {isOwner && !isSelf && (
          <>
            <button onClick={toggleRole} disabled={updating} className="text-xs font-medium text-ledger-navy hover:underline dark:text-ledger-cream disabled:opacity-50">
              Make {member.role === 'admin' ? 'member' : 'admin'}
            </button>
            <button onClick={() => setRemoveOpen(true)} className="text-xs font-medium text-red-600 hover:underline">
              Remove
            </button>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        title="Remove this member?"
        description={`${name} will lose access to shared loan records.`}
      />
    </div>
  );
};

export default MemberRow;
