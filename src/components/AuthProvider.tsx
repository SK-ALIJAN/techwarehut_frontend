'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { useGetMeQuery } from '@/lib/features/auth/authApiSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const { data, isLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data?.data?.user && token) {
      dispatch(setCredentials({ user: data.data.user, token }));
    }
  }, [data, token, dispatch]);

  return <>{children}</>;
}
