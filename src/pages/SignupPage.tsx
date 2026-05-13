import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/authApi";
import type { INewUser } from "../types/auth.types";

// Extend the API type with a client-only field used for validation
interface SignupFormValues extends INewUser {
  passwordAgain: string;
}

export function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>();

  // watch('password') is used inside the validate function for the cross-field check.
  const password = watch("password");

  const mutation = useMutation({
    mutationFn: (data: INewUser) => signup(data),
    onSuccess: () => navigate("/entries"),
    onError: () => reset(),
  });

  function onSubmit({ passwordAgain: _pa, ...data }: SignupFormValues) {
    mutation.mutate(data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8 space-y-5">
        <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              autoComplete="name"
              className="w-full"
            />
            {errors.name && (
              <p className="text-xs text-danger mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
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
              autoComplete="new-password"
              className="w-full"
            />
            {errors.password && (
              <p className="text-xs text-danger mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              {...register("passwordAgain", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type="password"
              autoComplete="new-password"
              className="w-full"
            />
            {errors.passwordAgain && (
              <p className="text-xs text-danger mt-1">
                {errors.passwordAgain.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-xs text-danger">
              Signup failed. Please try again.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="w-full py-2 text-sm bg-primary-500 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
