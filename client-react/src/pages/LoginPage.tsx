import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import type { ICredentials } from '../types/auth.types';

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ICredentials>();

  // On success, authApi.login() persists the token via authStore before resolving
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate('/entries'),
    onError: () => reset(),
  });

  function onSubmit(data: ICredentials) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8 space-y-5">
        <h1 className="text-xl font-semibold text-gray-900">Sign In</h1>

        {/* handleSubmit validates then calls onSubmit; no separate disabled check needed */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              autoComplete="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password', { required: 'Password is required' })}
              type="password"
              autoComplete="current-password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-xs text-red-600">Invalid credentials. Please try again.</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="w-full py-2 text-sm bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          No account?{' '}
          <Link to="/signup" className="text-blue-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
