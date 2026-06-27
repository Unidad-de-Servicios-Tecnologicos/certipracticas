import { useState, useEffect } from 'react';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { GeneratorPageV2 } from '@/pages/GeneratorPageV2';
import { LandingPage } from '@/pages/LandingPage';
import { AppShell } from '@/components/layout/AppShell';
import { useTheme } from '@/hooks/useTheme';

const UX_V2 = import.meta.env.VITE_UX_V2 === 'true';

export function App() {
  useTheme();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#app') {
    if (UX_V2) {
      return <GeneratorPageV2 />;
    }
    return (
      <AppShell>
        <GeneratorPage />
      </AppShell>
    );
  }

  return <LandingPage />;
}
