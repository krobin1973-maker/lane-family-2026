import { RouteObject } from 'react-router';
import { lazy } from 'react';
import HomePage from './pages/index';
import ProdNotFoundPage from './pages/_404';

const NotFoundPage = ProdNotFoundPage;

const SignUpPage = lazy(() => import('./pages/sign-up'));
const ItineraryPage = lazy(() => import('./pages/itinerary'));

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
    id: 'airo-not-found',
    path: '*',
    element: <NotFoundPage />,
  },
];

export type Path = '/' | '/sign-up' | '/itinerary';
export type Params = Record<string, string | undefined>;
