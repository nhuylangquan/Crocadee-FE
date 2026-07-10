import {
  createLazyFileRoute,
  Outlet,
  useRouterState,
} from '@tanstack/react-router';
import { MiniGameCarousel } from '../components/coderush/MiniGameCarousel';

export const Route = createLazyFileRoute('/coderush')({
  component: CoderushRoute,
});

function CoderushRoute() {
  const { location } = useRouterState();
  const isOnChildRoute = location.pathname !== '/coderush';

  // When a child route is active (e.g. /coderush/guess_output/<seed>),
  // render only the child through Outlet, not the carousel.
  // Use min-h-0 flex-1 to fill remaining space after the navbar in __root
  if (isOnChildRoute) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-bg-default text-neutral-900">
        <Outlet />
      </div>
    );
  }

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg-default text-neutral-900">
      <section className="mx-auto flex min-h-0 w-full max-w-275 flex-1 flex-col px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="shrink-0">
          <h1 className="text-[clamp(2rem,4.8vh,3rem)] leading-none font-extrabold text-neutral-900">
            CodeRush
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-5 text-neutral-700 sm:text-base sm:leading-6">
            Sharpen your skills with bite-sized mini-games. Earn XP, collect
            badges, and climb the leaderboard.
          </p>
        </div>

        <MiniGameCarousel />
      </section>
    </main>
  );
}
