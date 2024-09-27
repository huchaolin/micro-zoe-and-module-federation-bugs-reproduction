import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from '@/routerUtils';

import { createRoot } from 'react-dom/client';
import routeConfig from './routeConfig';

const router = createBrowserRouter(routeConfig, { basename: '/remote-lib'});
  
function renderRoot() {
 
  const container = document.getElementById('remote-lib-demo');
  const root = createRoot(container);
  root.render(<RouterProvider router={router} />);
}

renderRoot();




