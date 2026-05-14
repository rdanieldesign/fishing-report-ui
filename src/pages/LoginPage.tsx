import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";
import type { ICredentials } from "../types/auth.types";
import { Button } from "../components/shared/Button";

export function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ICredentials>();

  // On success, authApi.login() persists the token via authStore before resolving
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => navigate("/entries"),
    onError: () => reset({ email: getValues("email"), password: "" }),
  });

  function onSubmit(data: ICredentials) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8 space-y-5">
        <h1>Sign In</h1>

        {/* handleSubmit validates then calls onSubmit; no separate disabled check needed */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              autoComplete="email"
              className="w-full"
            />
            {errors.email && (
              <p className="text-xs text-danger mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              autoComplete="current-password"
              className="w-full"
            />
            {errors.password && (
              <p className="text-xs text-danger mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">
              Invalid credentials. Please try again.
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          No account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
