import { lazy, Suspense, useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useTheme } from '@/hooks/useTheme';

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const GeneratorPage = lazy(() =>
  import('@/pages/GeneratorPageV2').then((m) => ({ default: m.GeneratorPageV2 }))
);

function PageLoader() {
  return (
    <div className="flex h-full min-h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

export function App() {
  useTheme();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      {route.startsWith('#app') ? <GeneratorPage /> : <LandingPage />}
    </Suspense>
  );
}
