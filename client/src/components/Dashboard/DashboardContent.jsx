import WelcomeBanner from "./WelcomeBanner";
import MetricsGrid from "./MetricsGrid";
import ChartsSection from "./ChartsSection";
import RecentTests from "./RecentTests";
import CriticalBugs from "./CriticalBugs";

const DashboardContent = () => {
  return (
    <>
      <WelcomeBanner />
      <MetricsGrid />
      <ChartsSection />
      <RecentTests />
      <CriticalBugs />
    </>
  );
};

export default DashboardContent;
