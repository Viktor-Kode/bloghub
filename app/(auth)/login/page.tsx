"use client";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import {
  useAuthState,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signInWithEmailAndPassword, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle,  googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [user, authLoading] = useAuthState(auth);

  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const result = await signInWithEmailAndPassword(email, password);
    if (result && result.user) router.push("/dashboard");
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result && result.user) router.push("/dashboard");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transform transition-transform duration-200 hover:scale-[1.01]">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
        </header>

        <form className="space-y-4" onSubmit={handleEmailLogin}>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              required
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="*******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
            disabled={loading || authLoading}
          >
            Login
          </button>

          {(error || googleError) && (
            <p className="text-sm text-red-600">
              {error?.message || googleError?.message}
            </p>
          )}
        </form>

        <div className="mt-6 flex items-center">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="px-3 text-sm text-gray-500">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition"
            onClick={handleGoogleLogin}
            disabled={googleLoading || authLoading}
          >
           <span className="w-5 h-5 flex items-center justify-center">
              <svg
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  d="M533.5 278.4c0-17.6-1.6-35-4.7-51.7H272v97.9h146.9c-6.3 34.2-25 63.2-53.4 82.7v68.6h86.2c50.6-46.6 80.8-115.4 80.8-197.5z"
                  fill="#4285F4"
                />
                <path
                  d="M272 544.3c72.6 0 133.6-23.9 178.2-64.8l-86.2-68.6c-24 16.1-54.6 25.6-92 25.6-70.7 0-130.6-47.6-152-111.4H33.6v69.9C78.1 485.8 167.7 544.3 272 544.3z"
                  fill="#34A853"
                />
                <path
                  d="M120 326.1c-10.8-32.2-10.8-66.8 0-99l-86.4-69.9C7.6 202.5 0 236.5 0 272s7.6 69.5 33.6 114.9l86.4-69.8z"
                  fill="#FBBC05"
                />
                <path
                  d="M272 107.7c39.5 0 75 13.6 103 40.2l77.2-77.2C409.7 24.9 345.1 0 272 0 167.7 0 78.1 58.5 33.6 146.6l86.4 69.9C141.4 155.3 201.3 107.7 272 107.7z"
                  fill="#EA4335"
                />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </div>
          <div className=" text-gray-500 text-center">
<p>
  {"Do not have an account? "}
  <Link className="text-blue-800" href="/signUp">Signup</Link>
</p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </section>
  );
}