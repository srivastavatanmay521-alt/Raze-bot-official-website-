import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useEffect } from 'react';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Tos } from './pages/Tos';
import { Admin } from './pages/Admin';
import { Partners } from './pages/Partners';

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 relative z-10">
      <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-6">404</h1>
      <h2 className="text-3xl font-bold mb-4 text-foreground">Signal Lost</h2>
      <p className="text-lg text-muted-foreground max-w-md">The sector you're looking for doesn't exist or has been wiped from the database.</p>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground font-sans relative">
          <div className="noise-overlay" />
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/tos" component={Tos} />
                <Route path="/partners" component={Partners} />
                <Route path="/admin" component={Admin} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        </div>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
