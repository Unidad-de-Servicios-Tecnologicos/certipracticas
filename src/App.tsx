import { useState, useEffect } from 'react';
import { GeneratorPage } from '@/pages/GeneratorPage';
import { LandingPage } from '@/pages/LandingPage';
import { AppShell } from '@/components/layout/AppShell';
import { useTheme } from '@/hooks/useTheme';

export function App() {
  useTheme();
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (route === '#app') {
    return (
      <AppShell>
        <GeneratorPage />
      </AppShell>
    );
  }

  return <LandingPage />;
}
