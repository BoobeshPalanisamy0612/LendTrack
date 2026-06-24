import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { emailPattern, passwordRules } from '../utils/validators';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name, email, password }) => {
    setSubmitting(true);
    try {
      await registerUser({ name, email, password });
      toast.success('Account created — welcome to LendTrack');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ledger-navy dark:text-ledger-cream">Create your account</h1>
      <p className="mt-1.5 text-sm text-ledger-slate">Start your ledger in under a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Jordan Smith"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required', maxLength: { value: 60, message: 'Name is too long' } })}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email is required', pattern: emailPattern })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register('password', passwordRules)}
        />
        <Input
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === watch('password') || 'Passwords do not match',
          })}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ledger-slate">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ledger-navy underline dark:text-ledger-cream">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
