import DashboardHeader from '@/components/dashboard/DashboardHeader';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import RepoQuickAccess from '@/components/dashboard/RepoQuickAccess';
import DiscoverRecommendations from '@/components/dashboard/DiscoverRecommendations';

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-background web3-gradient">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="w-full overflow-hidden">
            <WelcomeBanner />
          </div>
          
          {/* Main Dashboard Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 w-full overflow-hidden">
            {/* Left Column - Activity Feed */}
            <div className="xl:col-span-2 min-w-0 overflow-hidden">
              <ActivityFeed />
            </div>
            
            {/* Right Column - Quick Access & Recommendations */}
            <div className="space-y-6 lg:space-y-8 min-w-0 overflow-hidden">
              <RepoQuickAccess />
              <DiscoverRecommendations />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;