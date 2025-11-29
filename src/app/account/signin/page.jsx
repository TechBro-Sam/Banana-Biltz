import { useState } from "react";
import useAuth from "@/utils/useAuth";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        OAuthSignin:
          "Couldn't start sign-in. Please try again or use a different method.",
        OAuthCallback: "Sign-in failed after redirecting. Please try again.",
        OAuthCreateAccount:
          "Couldn't create an account with this sign-in method. Try another option.",
        EmailCreateAccount:
          "This email can't be used to create an account. It may already exist.",
        Callback: "Something went wrong during sign-in. Please try again.",
        OAuthAccountNotLinked:
          "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin:
          "Incorrect email or password. Try again or reset your password.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
        Verification: "Your sign-in link has expired. Request a new one.",
      };

      setError(
        errorMessages[err.message] || "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center gradient-gunmetal-midnight p-4">
      <form
        noValidate
        onSubmit={onSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-2xl"></div>
          </div>
          <h1 className="font-barlow text-3xl font-bold text-black dark:text-white mb-2">
            Welcome to Banana Blitz
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Sign in to start playing
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="border border-gray-200 dark:border-gray-600 rounded-3xl px-4 py-3 bg-white dark:bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent font-inter text-lg outline-none text-black dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-inter text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="border border-gray-200 dark:border-gray-600 rounded-3xl px-4 py-3 bg-white dark:bg-gray-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input
                required
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent font-inter text-lg outline-none text-black dark:text-white"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-4 text-sm font-inter text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-royal-indigo rounded-3xl px-4 py-3 font-barlow text-lg font-semibold text-white transition-all hover-lift disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-center font-inter text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a
              href={`/account/signup${
                typeof window !== "undefined" ? window.location.search : ""
              }`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </form>

      <style jsx global>{`
        :root {
          --gradient-royal-indigo: linear-gradient(135deg, #0054B5 0%, #4A46C9 100%);
          --gradient-gunmetal-midnight: linear-gradient(135deg, #222222 0%, #000000 100%);
        }
        
        .font-barlow {
          font-family: 'Barlow', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .gradient-royal-indigo {
          background: var(--gradient-royal-indigo);
        }
        
        .gradient-gunmetal-midnight {
          background: var(--gradient-gunmetal-midnight);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}

export default MainComponent;
