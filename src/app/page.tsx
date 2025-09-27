import Home from '@/components/Home';
import { getDashboardData } from '@/app/logic';

export default async function Page() {
  const { recentActivity, stats } = await getDashboardData();
  return <Home recentActivity={recentActivity} stats={stats} />;
}