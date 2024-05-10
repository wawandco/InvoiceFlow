import { Outlet } from 'react-router-dom';

import CompanyProvider from './CompanyProvider';

export default function CompanyProviderLayout() {
  return (
    <CompanyProvider>
      <Outlet />
    </CompanyProvider>
  );
};