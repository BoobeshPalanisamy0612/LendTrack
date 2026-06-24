import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { familyService } from '../services/familyService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const AcceptInvite = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, refreshUser } = useAuth();
  const [status, setStatus] = useState('pending'); // pending | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/family/accept-invite/${token}` } } });
      return;
    }

    const accept = async () => {
      try {
        await familyService.acceptInvite(token);
        await refreshUser();
        setStatus('success');
        toast.success('You joined the family group');
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'This invite link is invalid or has expired');
      }
    };
    accept();
  }, [token, isAuthenticated, authLoading, navigate, refreshUser]);

  if (authLoading || status === 'pending') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-ledger-cream dark:bg-ledger-dark">
        <Spinner size="lg" />
        <p className="text-sm text-ledger-slate">Joining family group…</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-ledger-cream px-4 text-center dark:bg-ledger-dark">
      {status === 'success' ? (
        <>
          <h1 className="font-display text-2xl font-semibold text-ledger-navy dark:text-ledger-cream">You're in!</h1>
          <p className="text-sm text-ledger-slate">You now have access to shared loan records.</p>
          <Link to="/family">
            <Button className="mt-4">Go to family sharing</Button>
          </Link>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-ledger-navy dark:text-ledger-cream">Invite link issue</h1>
          <p className="max-w-sm text-sm text-ledger-slate">{message}</p>
          <Link to="/dashboard">
            <Button variant="secondary" className="mt-4">Go to dashboard</Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default AcceptInvite;
