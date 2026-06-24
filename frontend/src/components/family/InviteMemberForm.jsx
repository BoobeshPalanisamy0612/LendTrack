import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { familyService } from '../../services/familyService';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { emailPattern } from '../../utils/validators';

const roleOptions = [
  { value: 'member', label: 'Member (view only)' },
  { value: 'admin', label: 'Admin (can edit & delete)' },
];

const InviteMemberForm = ({ onInvited }) => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'member' } });

  const onSubmit = async ({ email, role }) => {
    setSubmitting(true);
    try {
      const res = await familyService.inviteMember(email, role);
      toast.success(`Invite sent to ${email}`);
      onInvited(res.familyGroup);
      reset({ email: '', role: 'member' });
    } catch (err) {
      toast.error(err.message || 'Could not send invite');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:flex-row sm:items-end" noValidate>
      <div className="flex-1">
        <Input
          label="Invite by email"
          type="email"
          placeholder="family@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: emailPattern })}
        />
      </div>
      <div className="w-full sm:w-56">
        <Select label="Role" options={roleOptions} {...register('role')} />
      </div>
      <Button type="submit" loading={submitting}>
        Send invite
      </Button>
    </form>
  );
};

export default InviteMemberForm;
