import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import useClickOutside from '../../hooks/useClickOutside';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false));

  const initials = user?.name
    ?.split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ledger-line bg-ledger-cream/90 px-4 backdrop-blur dark:border-ledger-lineDark dark:bg-ledger-dark/90 sm:px-6">
      <button onClick={onMenuClick} className="rounded-md p-2 text-ledger-navy dark:text-ledger-cream lg:hidden" aria-label="Open menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </button>

      <div className="hidden text-sm text-ledger-slate sm:block">
        Welcome back, <span className="font-medium text-ledger-navy dark:text-ledger-cream">{user?.name?.split(' ')[0]}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-ledger-navy hover:bg-white dark:text-ledger-cream dark:hover:bg-ledger-darkSurface"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <Link to="/notifications" className="relative rounded-lg p-2 text-ledger-navy hover:bg-white dark:text-ledger-cream dark:hover:bg-ledger-darkSurface" aria-label="Notifications">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ledger-amber text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: user?.avatarColor || '#2F9E6E' }}
            aria-label="Account menu"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-ledger-line bg-white py-1 shadow-cardHover dark:border-ledger-lineDark dark:bg-ledger-darkSurface">
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-ledger-navy hover:bg-ledger-cream dark:text-ledger-cream dark:hover:bg-ledger-dark">
                Profile
              </Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-ledger-navy hover:bg-ledger-cream dark:text-ledger-cream dark:hover:bg-ledger-dark">
                Settings
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-ledger-cream dark:hover:bg-ledger-dark"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
