import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/views/OnboardingModal';
import { InvestmentDetailModal } from './components/views/InvestmentDetailModal';
import { MobileAppSimulator } from './components/mobile/MobileAppSimulator';
import { AppLauncherModal } from './components/mobile/AppLauncherModal';
import { Smartphone } from 'lucide-react';

// Views
import { DashboardView } from './components/views/DashboardView';
import { BalanceView } from './components/views/BalanceView';
import { BudgetView } from './components/views/BudgetView';
import { MoneyFlowView } from './components/views/MoneyFlowView';
import { GoalSimulatorView } from './components/views/GoalSimulatorView';
import { ExplorerView } from './components/views/ExplorerView';
import { ComparisonView } from './components/views/ComparisonView';
import { PortfolioBuilderView } from './components/views/PortfolioBuilderView';
import { BadYearRehearsalView } from './components/views/BadYearRehearsalView';
import { RecoveryScenariosView } from './components/views/RecoveryScenariosView';
import { TransactionsView } from './components/views/TransactionsView';
import { LearningHubView } from './components/views/LearningHubView';
import { ProfileSettingsView } from './components/views/ProfileSettingsView';

const MainRouter: React.FC = () => {
  const { currentRoute, highContrast, compactMode, deviceViewMode, setDeviceViewMode } = useApp();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView />;
      case 'balance':
        return <BalanceView />;
      case 'budget':
        return <BudgetView />;
      case 'moneyflow':
        return <MoneyFlowView />;
      case 'simulator':
        return <GoalSimulatorView />;
      case 'explorer':
        return <ExplorerView />;
      case 'comparison':
        return <ComparisonView />;
      case 'portfolio':
        return <PortfolioBuilderView />;
      case 'bad_year':
        return <BadYearRehearsalView />;
      case 'recovery':
        return <RecoveryScenariosView />;
      case 'activity':
        return <TransactionsView />;
      case 'learning':
        return <LearningHubView />;
      case 'settings':
        return <ProfileSettingsView />;
      default:
        return <DashboardView />;
    }
  };

  // 1. DEFAULT PRIMARY MODE: THE REAL WORKING MOBILE APP PROTOTYPE
  if (deviceViewMode === 'mobile_frame') {
    return (
      <div className={`min-h-screen bg-[#07080A] text-[#F4F1EA] flex flex-col justify-center items-center ${
        highContrast ? 'contrast-125' : ''
      }`}>
        <MobileAppSimulator>
          {renderCurrentView()}
        </MobileAppSimulator>

        {/* Global Modals */}
        <OnboardingModal />
        <InvestmentDetailModal />
      </div>
    );
  }

  // 2. EXPANDED DESKTOP VIEW (Only shown if user explicitly clicks "Desktop" toggle)
  return (
    <div className={`min-h-screen bg-[#090A0C] text-[#F4F1EA] flex flex-col overflow-x-hidden ${
      highContrast ? 'contrast-125' : ''
    }`}>
      {/* Floating Pill to Switch Back to Mobile App */}
      <div className="fixed top-20 right-6 z-50">
        <button
          onClick={() => setDeviceViewMode('mobile_frame')}
          className="px-3.5 py-1.5 rounded-full bg-[#171A20]/95 hover:bg-[#20242B] border border-[#D5B477]/50 text-[#F4F1EA] text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center space-x-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#D5B477]" />
          <span>Switch to Mobile App</span>
        </button>
      </div>

      {/* Top Navbar */}
      <Navbar />

      {/* Real App Shell: Desktop Left Sidebar + Main Content Workspace */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main App Workspace */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 pb-28 md:pb-12 ${
          compactMode ? 'space-y-4' : 'space-y-6'
        }`}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      <OnboardingModal />
      <InvestmentDetailModal />
      <AppLauncherModal isInsideFrame={false} />

      {/* Mobile 5-Item Bottom Navigation */}
      <BottomNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
};

export default App;
