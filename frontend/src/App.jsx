import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppLayout from './layouts/AppLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AcceptInvite from './pages/AcceptInvite';

import Dashboard from './pages/Dashboard';
import LoanList from './pages/LoanList';
import AddLoan from './pages/AddLoan';
import EditLoan from './pages/EditLoan';
import LoanDetails from './pages/LoanDetails';
import InterestCalculator from './pages/InterestCalculator';
import ReminderCenter from './pages/ReminderCenter';
import FamilySharing from './pages/FamilySharing';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--toast-bg, #fff)',
            color: '#0B1F3A',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px -2px rgba(11, 31, 58, 0.12)',
          },
          success: { iconTheme: { primary: '#2F9E6E', secondary: '#fff' } },
          error: { iconTheme: { primary: '#D9763B', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public auth routes */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        </Route>

        {/* Family invite acceptance - requires auth but not the main app shell */}
        <Route path="/family/accept-invite/:token" element={<AcceptInvite />} />

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/loans" element={<LoanList />} />
          <Route path="/loans/add" element={<AddLoan />} />
          <Route path="/loans/:id" element={<LoanDetails />} />
          <Route path="/loans/:id/edit" element={<EditLoan />} />
          <Route path="/calculator" element={<InterestCalculator />} />
          <Route path="/reminders" element={<ReminderCenter />} />
          <Route path="/family" element={<FamilySharing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
