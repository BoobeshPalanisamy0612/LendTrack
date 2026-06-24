import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { passwordRules } from '../utils/validators';

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ password }) => {
    setSubmitting(true);
    try {
      const data = await authService.resetPassword(resetToken, password);
      localStorage.setItem('lendtrack_token', data.token);
      localStorage.setItem('lendtrack_user', JSON.stringify(data.user));
      updateUser(data.user);
      toast.success('Password reset successful');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Reset link is invalid or has expired');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ledger-navy dark:text-ledger-cream">Choose a new password</h1>
      <p className="mt-1.5 text-sm text-ledger-slate">Make it something you'll remember.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
        <Input
          label="New password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', passwordRules)}
        />
        <Input
          label="Confirm new password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />
        <Button type="submit" loading={submitting} className="w-full">
          Reset password
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ledger-slate">
        <Link to="/login" className="font-medium text-ledger-navy underline dark:text-ledger-cream">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
