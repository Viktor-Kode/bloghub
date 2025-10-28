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

  const [signInWithEmailAndPassword, userCred, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
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
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </div>
          <div className=" text-gray-500 text-center">
          <p>Don't have an account? <Link className="text-blue-800" href={'/signUp'}>Signup</Link></p>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </section>
  );
}