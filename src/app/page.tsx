import Home from '@/components/Home';
export const dynamic = 'force-dynamic';

export default async function Page() {
  return <Home recentActivity={[]} stats={{}} />;
}