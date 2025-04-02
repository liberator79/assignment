"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormValues } from "@/lib/validation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/login";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const response = await loginAction(formData);

    if (response.error) {
      setMessage(response.error);
    } else {
      const token = response.token ?? "";
      localStorage.setItem("token", token);
      setMessage("Login successful! Redirecting...");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen  items-center justify-center text-black bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-black">Welcome back!</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-lg w-96">
        {message && (
          <p className="text-red-500 mb-4 p-2 bg-red-50 rounded">{message}</p>
        )}

        <div className="mb-4">
          <input
            id="email"
            placeholder="Email"
            type="email"
            {...register("email")}
            className="w-full px-3 py-4 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            id="password"
            placeholder="Password"
            type="password"
            {...register("password")}
            className="w-full px-3 py-4 border rounded focus:outline-none focus:ring focus:ring-blue-200"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center items-center w-full cursor-pointer bg-blue-700 text-white py-4 px-4 rounded hover:bg-blue-800 disabled:bg-blue-800 transition disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-7 h-7 border-3 border-black border-t-white rounded-full animate-spin"></div>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}
