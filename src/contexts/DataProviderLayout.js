import { Outlet } from 'react-router-dom';

import AuthProvider from './AuthProvider';
import SubscriptionProvider from './SubscriptionProvider';

export default function DataProviderLayout() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Outlet />
      </SubscriptionProvider>
    </AuthProvider>
  );
};