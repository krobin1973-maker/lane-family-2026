import { RouteObject } from 'react-router';
import { lazy } from 'react';
import HomePage from './pages/index';
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

const SignUpPage = lazy(() => import('./pages/sign-up'));
const ItineraryPage = lazy(() => import('./pages/itinerary'));
const OrganizerPage = lazy(() => import('./pages/organizer'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/itinerary',
    element: <ItineraryPage />,
  },
  {
    path: '/organizer',
    element: <OrganizerPage />,
  },
  {
    id: 'airo-not-found',
    path: '*',
    element: <NotFoundPage />,
  },
];

export type Path = '/' | '/sign-up' | '/itinerary' | '/organizer';
export type Params = Record<string, string | undefined>;
