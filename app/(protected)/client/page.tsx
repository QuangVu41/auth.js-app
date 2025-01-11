'use client';

import UserInfo from '@/components/user/UserInfo';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const ClientPage = () => {
  const user = useCurrentUser();

  return <UserInfo user={user} label='📱Client component' />;
};

export default ClientPage;
