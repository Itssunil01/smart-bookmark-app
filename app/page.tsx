"use client";

import { useEffect } from "react";
import { supabase } from "../lib/Superbase";

export default function Home() {
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 text-center">
        
        {/* Google Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-12 h-12"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 mb-6 text-sm">
          Sign in to manage your bookmarks
        </p>

        <button
          onClick={signIn}
          className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="font-medium">
            Sign in with Google
          </span>
        </button>
      </div>
    </div>
  );
}
