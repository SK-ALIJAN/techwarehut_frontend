'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLoginMutation } from '@/lib/features/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Compass, Mail, Lock, LogIn, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const fillCredentials = (role: 'admin' | 'user') => {
    if (role === 'admin') {
      setValue('email', 'admin@example.com');
      setValue('password', 'password123');
      toast.success('Admin credentials loaded');
    } else {
      setValue('email', 'user@example.com');
      setValue('password', 'password123');
      toast.success('User credentials loaded');
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ user: result.data.user, token: result.token }));
      toast.success('Login successful!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-md shadow-primary-600/20 group-hover:rotate-12 transition-transform duration-300">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900">Wanderlust</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
            Sign in to check bookings and book your next package
          </p>
        </div>

        {/* Demo Accounts Ribbon */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Interactive Demo Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin')}
              className="bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-primary-200 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fill Admin demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('user')}
              className="bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:border-primary-200 transition-all flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Fill User demo</span>
            </button>
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="pl-10 pr-3.5 py-3 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                {...register('password')}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="pl-10 pr-3.5 py-3 block w-full rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed text-sm shadow-md shadow-primary-600/10 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-primary-600 hover:underline font-bold">
              Sign Up for Free
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
