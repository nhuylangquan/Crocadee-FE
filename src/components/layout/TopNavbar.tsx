import { useState, useRef, useEffect } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { Button } from '../../components/button';
import { useTheme } from '../../lib/theme';

import codebiteLogoUrl from '../../assets/logo/Codebite logo.svg';
import expBarIconUrl from '../../assets/icons/navbar-exp-bar.svg';
import notificationIconUrl from '../../assets/icons/navbar-notification.svg';
import profileIconUrl from '../../assets/icons/navbar-profile.svg';
import themeIconUrl from '../../assets/icons/navbar-theme.svg';
import darkModeIconUrl from '../../assets/icons/navbar-darkmode.svg';
import profileModeIconUrl from '../../assets/icons/navbar-profileMode.svg';
import logoutIconUrl from '../../assets/icons/navbar-logout.svg';

type NavbarItem = 'home' | 'practice-lab' | 'challenge' | 'coderush';

interface TopNavbarProps {
  activeItem?: NavbarItem;
  isLoggedIn?: boolean;
  username?: string;
}

const navItems: {
  id: NavbarItem;
  label: string;
  href: string;
  disabled?: boolean;
}[] = [
  { id: 'home', label: 'Home', href: '/home' },
  { id: 'practice-lab', label: 'Practice Lab', href: '/practice-lab' },
  { id: 'challenge', label: 'Challenge', href: '#', disabled: true },
  { id: 'coderush', label: 'CodeRush', href: '/coderush' },
];

/* 1. SUB-COMPONENT: NAV LINKS */
const NavLinks = ({ activeItem, isLoggedIn }: TopNavbarProps) => (
  <nav className="flex items-center gap-1" aria-label="Main navigation">
    {navItems.map((item) => {
      const isActive = item.id === activeItem;
      const targetHref = isLoggedIn ? item.href : '/login';

      return (
        <a
          key={item.id}
          href={targetHref}
          aria-disabled={isLoggedIn && item.disabled ? 'true' : undefined}
          className={`rounded-lg px-4 py-2 text-base leading-[1.6] transition ${
            isActive
              ? 'bg-primary-700/20 font-medium text-primary-900'
              : 'font-normal text-neutral-700 hover:bg-primary-700/10'
          } ${isLoggedIn && item.disabled ? 'cursor-default opacity-70' : ''}`}
          onClick={(e) => {
            if (isLoggedIn && item.disabled) e.preventDefault();
          }}
        >
          {item.label}
        </a>
      );
    })}
  </nav>
);

/* SUB-COMPONENT: USER PROFILE MENU (AUTHENTICATED) */
const UserProfileMenu = ({ username }: { username?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout logic
  const handleLogout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authUser');

    setIsOpen(false);
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      await router.invalidate();
      void navigate({ to: '/' });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-1.5 transition hover:bg-primary-700/5"
      >
        <div className="flex flex-col items-center">
          <span className="text-base font-bold leading-3.5 tracking-[0.0088em] text-neutral-900">
            {username ?? 'Username'}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase leading-4 tracking-[0.05em] text-primary-900">
              LVL 15
            </span>
            <img src={expBarIconUrl} alt="EXP" className="h-1.5 w-16" />
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary-900/30 bg-primary-900/20">
          <img
            src={profileIconUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 top-full  w-48 overflow-hidden rounded-md border border-neutral-200 bg-shade-white shadow-lg z-50">
          <Button
            variant="menu"
            onClick={() => {
              setIsOpen(false);
              void navigate({ to: '/profile' });
            }}
            className="flex items-center gap-8 border-b border-neutral-200 "
          >
            <img src={profileModeIconUrl} alt="Profile" className="h-5 w-5" />
            <span>Profile</span>
          </Button>

          <Button
            variant="menu-danger"
            onClick={() => void handleLogout()}
            className="flex items-center gap-8"
          >
            <img src={logoutIconUrl} alt="Logout" className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      )}
    </div>
  );
};

/* SUB-COMPONENT: AUTH BUTTONS (UNAUTHENTICATED) */
const AuthButtons = () => (
  <div className="flex items-center gap-3 pl-2">
    <Button href="/login" variant="white" className="py-2.5 h-11">
      Log In
    </Button>
    <Button href="/signup" variant="primary" className="py-2.5 h-11">
      Sign Up
    </Button>
  </div>
);

/* MAIN COMPONENT: TOP NAVBAR */
export function TopNavbar({
  activeItem,
  isLoggedIn = false,
  username,
}: TopNavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-14 items-center justify-between bg-primary-100 px-6 dark:bg-[#1e1a4a]">
      <div className="flex items-center gap-8">
        <a href="/" className="flex items-center justify-center">
          <img
            src={codebiteLogoUrl}
            alt="CodeBite logo"
            className="h-12.5 w-12.5 object-contain"
          />
          <span className="font-sans text-2xl font-bold leading-7 tracking-[-0.02em] text-primary-700">
            CodeBite
          </span>
        </a>
        <NavLinks activeItem={activeItem} isLoggedIn={isLoggedIn} />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
          }
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2 text-neutral-700 transition hover:bg-primary-700/10 dark:text-neutral-300"
        >
          <img
            src={theme === 'light' ? themeIconUrl : darkModeIconUrl}
            alt="Theme"
            className="h-6 w-6"
          />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2 text-neutral-700 transition hover:bg-primary-700/10"
        >
          <img
            src={notificationIconUrl}
            alt="Notifications"
            className="h-5 w-4"
          />
        </button>

        {isLoggedIn ? <UserProfileMenu username={username} /> : <AuthButtons />}
      </div>
    </header>
  );
}
