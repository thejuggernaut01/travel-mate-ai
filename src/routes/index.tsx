import Home from '@/pages/app/home';
import { createBrowserRouter } from 'react-router-dom';

import React, { Suspense } from 'react';
import PageSuspense from '@/components/custom/page-suspense';
import Recommendation from '@/pages/app/recommendation';
import Chat from '@/pages/app/chat';

const TravelPlanner = React.lazy(() => import('@/pages/app/travel-planner'));

const router = createBrowserRouter([
  {
    path: '',
    element: <Home />,
  },
  {
    path: 'travel-planner',
    element: (
      <Suspense fallback={<PageSuspense />}>
        <TravelPlanner />
      </Suspense>
    ),
  },
  {
    path: 'recommendation/:id',
    element: (
      <Suspense fallback={<PageSuspense />}>
        <Recommendation />
      </Suspense>
    ),
  },
  {
    path: 'chat',
    element: (
      <Suspense fallback={<PageSuspense />}>
        <Chat />
      </Suspense>
    ),
  },
]);

export default router;
