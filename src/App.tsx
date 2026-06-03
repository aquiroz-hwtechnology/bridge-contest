import { useState, useEffect } from 'react';
import { HomePage } from '@/pages/HomePage';
import { VotingPage } from '@/pages/VotingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AdminPage } from '@/pages/AdminPage';
import { useStore } from '@/store/useStore';

type Route = 'home' | 'vote' | 'dashboard' | 'admin';

function App() {
  const [route, setRoute] = useState<Route>('home');
  const [projectId, setProjectId] = useState<string | undefined>();
  const { loading, init } = useStore();

  // Initialize Firebase connection on mount
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
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

  // Loading screen while Firebase connects
  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center text-white">
          <img
            src="/bridge-contest/images/unipaz-identidad.svg"
            alt="UNIPAZ"
            className="h-20 mx-auto mb-6 brightness-0 invert"
          />
          <div className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-lg">Conectando...</span>
          </div>
        </div>
      </div>
    );
  }

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
