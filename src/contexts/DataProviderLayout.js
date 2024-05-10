import { Outlet } from 'react-router-dom';

import AuthProvider from './AuthProvider';
import SubscriptionProvider from './SubscriptionProvider';
import RedirectsProvider from './RedirectsProvider';

export default function DataProviderLayout() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RedirectsProvider>
          <Outlet />
        </RedirectsProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};