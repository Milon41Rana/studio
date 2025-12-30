'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ADMIN_EMAIL = 'ranamilon41@gmail.com';

export default function withAdminAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const WithAdminAuth = (props: P) => {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
      // If user data has loaded and there's no user or the user is not the admin, redirect.
      if (!isUserLoading && (!user || user.email !== ADMIN_EMAIL)) {
        router.replace('/');
      }
    }, [user, isUserLoading, router]);

    // While loading, or if redirection is about to happen, show a loading state.
    if (isUserLoading || !user || user.email !== ADMIN_EMAIL) {
      return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      );
    }

    // If the user is the admin, render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  WithAdminAuth.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAdminAuth;
}
