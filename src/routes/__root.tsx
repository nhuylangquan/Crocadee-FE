import {
  createRootRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { useState } from 'react';
import { TopNavbar } from '../components/layout/TopNavbar';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const noNavbarRoutes = [
    '/login',
    '/signup',
    '/practice-lab/try-it',
    '/forgot-password',
    '/reset-password',
  ];
  const shouldShowNavbar = !noNavbarRoutes.includes(pathname);

  const [authUserString] = useState<string | null>(
    () => localStorage.getItem('authUser') ?? sessionStorage.getItem('authUser')
  );

  let isLoggedIn = false;
  let username = '';

  if (authUserString) {
    try {
      const authUser = JSON.parse(authUserString) as { username: string };
      isLoggedIn = true;
      username = authUser.username;
    } catch (error) {
      console.error('Lỗi parse authUser:', error);
    }
  }

  return (
    <div className="flex h-dvh flex-col bg-bg-default text-neutral-900">
      {shouldShowNavbar && (
        <TopNavbar
          activeItem={
            pathname.replace('/', '') as
              | 'home'
              | 'practice-lab'
              | 'challenge'
              | 'coderush'
          }
          isLoggedIn={isLoggedIn}
          username={username}
        />
      )}

      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
