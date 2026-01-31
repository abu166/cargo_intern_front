import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { TopBar } from './components/TopBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { NewShipment } from './components/NewShipment';
import { ActiveShipments } from './components/ActiveShipments';
import { Transit } from './components/Transit';
import { Arrival } from './components/Arrival';
import { Reports } from './components/Reports';
import { WMS } from './components/WMS';
import { Settings } from './components/Settings';
import { CorporateClients } from './components/CorporateClients';
import { CorporateDashboard } from './components/CorporateDashboard';
import { IndividualDashboard } from './components/IndividualDashboard';
import { ReceiverDashboard } from './components/ReceiverDashboard';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('new-shipment');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  if (!isAuthenticated) {
    return <Login />;
  }

  // Different dashboards for different roles
  if (user?.role === 'corporate') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TopBar 
          theme={theme} 
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        />
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
          <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-8">
              <CorporateDashboard />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (user?.role === 'individual') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TopBar 
          theme={theme} 
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        />
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
          <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-8">
              <IndividualDashboard />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (user?.role === 'receiver') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <TopBar 
          theme={theme} 
          onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        />
        <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
          <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-8">
              <ReceiverDashboard />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'new-shipment':
        return <NewShipment />;
      case 'active-shipments':
        return <ActiveShipments />;
      case 'transit':
        return <Transit />;
      case 'arrival':
        return <Arrival />;
      case 'reports':
        return <Reports />;
      case 'wms':
        return <WMS />;
      case 'settings':
        return <Settings />;
      case 'corporate':
        return <CorporateClients />;
      default:
        return <NewShipment />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <TopBar 
        theme={theme} 
        onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
      />
      
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        {leftSidebarOpen && (
          <LeftSidebar 
            currentPage={currentPage} 
            onNavigate={setCurrentPage}
            theme={theme}
          />
        )}
        
        <main className={`flex-1 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="p-8">
            {renderPage()}
          </div>
        </main>
        
        {rightSidebarOpen && (
          <RightSidebar currentPage={currentPage} theme={theme} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}