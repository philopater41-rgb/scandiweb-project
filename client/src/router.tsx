import { Products, ErrorScreen, HomeLayout, ProductDetail } from './pages';
import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <ErrorScreen />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: '/:category',
        element: <Products />,
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
