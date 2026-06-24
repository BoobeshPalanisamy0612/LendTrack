import { useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import LedgerDivider from '../components/ui/LedgerDivider';
import { passwordRules } from '../utils/validators';

const avatarColors = ['#2F9E6E', '#D9763B', '#0B1F3A', '#8B95A6', '#B85D29', '#1F7A53'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm({ defaultValues: { name: user?.name } });
  const passwordForm = useForm();

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const onSaveProfile = async ({ name }) => {
    setSavingProfile(true);
    try {
      const res = await authService.updateProfile({ name });
      updateUser(res.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleColorChange = async (color) => {
    try {
      const res = await authService.updateProfile({ avatarColor: color });
      updateUser(res.user);
    } catch (err) {
      toast.error(err.message || 'Could not update avatar color');
    }
  };

  const onChangePassword = async (data) => {
    setSavingPassword(true);
    try {
      await authService.changePassword(data);
      toast.success('Password updated');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.message || 'Could not update password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeader title="Profile" subtitle="Manage your personal information and account security." />
      <LedgerDivider />

      <Card className="mb-6">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-semibold text-white" style={{ backgroundColor: user?.avatarColor }}>
            {initials}
          </div>
          <div>
            <p className="font-medium text-ledger-navy dark:text-ledger-cream">{user?.name}</p>
            <p className="text-sm text-ledger-slate">{user?.email}</p>
            <div className="mt-2 flex gap-1.5">
              {avatarColors.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  className="h-5 w-5 rounded-full ring-offset-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, outline: user?.avatarColor === c ? `2px solid ${c}` : 'none' }}
                  aria-label={`Set avatar color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4" noValidate>
          <Input
            label="Full name"
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name', { required: 'Name is required' })}
          />
          <Input label="Email address" value={user?.email} disabled className="opacity-60" />
          <Button type="submit" loading={savingProfile}>
            Save changes
          </Button>
        </form>
      </Card>

      <Card>
        <h3 className="mb-3 font-display text-base font-semibold text-ledger-navy dark:text-ledger-cream">Change password</h3>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4" noValidate>
          <Input
            label="Current password"
            type="password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword', { required: 'Required' })}
          />
          <Input
            label="New password"
            type="password"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword', passwordRules)}
          />
          <Button type="submit" loading={savingPassword} variant="secondary">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
