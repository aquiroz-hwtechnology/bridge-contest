import { useState, useEffect } from 'react';
import { HomePage } from '@/pages/HomePage';
import { VotingPage } from '@/pages/VotingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';

type Route = 'home' | 'vote' | 'dashboard' | 'admin';

function App() {
  const [route, setRoute] = useState<Route>('home');
  const [projectId, setProjectId] = useState<string | undefined>();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      if (hash.startsWith('/vote/')) {
        setProjectId(hash.replace('/vote/', ''));
        setRoute('vote');
      } else if (hash === '/vote' || hash === '/vote/') {
        setProjectId(undefined);
        setRoute('vote');
      } else if (hash === '/dashboard') {
        setRoute('dashboard');
      } else if (hash === '/admin') {
        setRoute('admin');
      } else {
        setRoute('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = `/${path}`;
  };

  switch (route) {
    case 'vote':
      return <VotingPage projectId={projectId} />;
    case 'dashboard':
      return <DashboardPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <HomePage onNavigate={navigate} />;
  }
}

export default App;
