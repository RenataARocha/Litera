import Home from '@/components/Home';

export const dynamic = 'force-dynamic';

export default async function Page() {
  return (
    <Home
      recentActivity={[]}
      stats={{
        totalBooks: 0,
        readingNow: 0,
        finishedBooks: 0,
        totalPagesRead: 0,
      }}
    />
  );
}