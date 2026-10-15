import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { OnboardingModal } from './components/views/OnboardingModal';
import { SignInModal } from './components/auth/SignInModal';
import { InvestmentDetailModal } from './components/views/InvestmentDetailModal';
import { AppLauncherModal } from './components/mobile/AppLauncherModal';

// Views
import { LandingView } from './components/views/LandingView';
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
  const { currentRoute, highContrast, compactMode } = useApp();

  const renderCurrentView = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingView />;
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

  // 1. LANDING PAGE VIEW: Edge-to-edge cinematic landing screen
  if (currentRoute === 'landing') {
    return (
      <div className={`min-h-screen bg-[#050607] text-[#F5F3EF] flex flex-col overflow-x-hidden ${
        highContrast ? 'contrast-125' : ''
      }`}>
        <LandingView />

        {/* Global Modals for Landing Page */}
        <OnboardingModal />
        <SignInModal />
      </div>
    );
  }

  // 2. AUTHENTICATED / ACTIVE APPLICATION SHELL (GENUINE FULL-SCREEN RESPONSIVE LAYOUT)
  return (
    <div className={`min-h-screen bg-[#050607] text-[#F5F3EF] flex flex-col overflow-x-hidden ${
      highContrast ? 'contrast-125' : ''
    }`}>
      {/* Top Navbar: On mobile, hide on dashboard because FuturaCardHero provides the top mobile header */}
      <div className={currentRoute === 'dashboard' ? 'hidden md:block' : 'block'}>
        <Navbar />
      </div>

      {/* Real App Shell: Desktop Left Sidebar + Main Content Workspace (Full Width on Desktop) */}
      <div className="flex-1 flex w-full">
        {/* Desktop Left Sidebar */}
        <div className="hidden md:block shrink-0">
          <Sidebar />
        </div>

        {/* Main App Workspace */}
        <main className={`flex-1 px-0 sm:px-4 lg:px-6 xl:px-8 py-0 sm:py-4 lg:py-6 min-w-0 pb-24 md:pb-12 w-full ${
          compactMode ? 'space-y-4' : 'space-y-6'
        }`}>
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals */}
      <OnboardingModal />
      <SignInModal />
      <InvestmentDetailModal />
      <AppLauncherModal isInsideFrame={false} />

      {/* Mobile 5-Item Floating Translucent Bottom Navigation */}
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
