"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

export default function LandingPage() {
  const { data: user, loading } = useUser();
  const [showGamePreview, setShowGamePreview] = useState(false);

  useEffect(() => {
    // Auto-navigate authenticated users
    if (!loading && user) {
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gradient-gunmetal-midnight">
        <div className="text-center">
          <div className="w-16 h-16 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-10 h-10 bg-white rounded-2xl"></div>
          </div>
          <p className="font-inter text-white text-lg">
            Loading Banana Blitz...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen gradient-gunmetal-midnight">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 gradient-royal-indigo rounded-3xl flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-2xl"></div>
          </div>
          <h1 className="font-barlow text-2xl font-bold text-white">
            Banana Blitz
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/account/signin"
            className="font-inter text-white hover:text-gray-300 transition-colors px-4 py-2"
          >
            Sign In
          </a>
          <a
            href="/account/signup"
            className="gradient-royal-indigo rounded-3xl px-6 py-2 font-barlow font-semibold text-white hover-lift transition-all"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-barlow text-6xl font-bold text-white mb-6">
            Slice Your Way to
            <span className="gradient-text"> Big Wins</span>
          </h2>
          <p className="font-inter text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the thrill of fruit slicing like never before. Every
            slice could be your ticket to massive rewards in the most exciting
            gambling game online.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/account/signup"
              className="gradient-royal-indigo rounded-3xl px-8 py-4 font-barlow text-lg font-semibold text-white hover-lift transition-all"
            >
              Start Playing Now
            </a>
            <button
              onClick={() => setShowGamePreview(true)}
              className="border border-white/30 rounded-3xl px-8 py-4 font-barlow text-lg font-semibold text-white hover:bg-white/10 transition-all"
            >
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h3 className="font-barlow text-4xl font-bold text-white text-center mb-16">
            Why Players Choose Banana Blitz
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 rounded-3xl hover-lift">
              <div className="w-16 h-16 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-2xl"></div>
              </div>
              <h4 className="font-barlow text-xl font-semibold text-white mb-3">
                Provably Fair
              </h4>
              <p className="font-inter text-gray-300">
                Every game round is cryptographically verifiable. Complete
                transparency in all outcomes.
              </p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-3xl hover-lift">
              <div className="w-16 h-16 gradient-purple-indigo rounded-3xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-2xl"></div>
              </div>
              <h4 className="font-barlow text-xl font-semibold text-white mb-3">
                Instant Payouts
              </h4>
              <p className="font-inter text-gray-300">
                Win and get paid instantly. No waiting periods or complicated
                withdrawal processes.
              </p>
            </div>
            <div className="text-center p-8 bg-white/10 rounded-3xl hover-lift">
              <div className="w-16 h-16 gradient-cyan-blue rounded-3xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-2xl"></div>
              </div>
              <h4 className="font-barlow text-xl font-semibold text-white mb-3">
                Big Multipliers
              </h4>
              <p className="font-inter text-gray-300">
                Hit the Banana Boss or trigger Banana Bombs for massive 20x+
                multiplier wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="font-barlow text-4xl font-bold text-white mb-6">
            Ready to Start Winning?
          </h3>
          <p className="font-inter text-lg text-gray-300 mb-8">
            Join thousands of players already earning with Banana Blitz. Sign up
            now and get your welcome bonus!
          </p>
          <a
            href="/account/signup"
            className="gradient-royal-indigo rounded-3xl px-12 py-4 font-barlow text-xl font-semibold text-white hover-lift transition-all inline-block"
          >
            Join Now - It's Free!
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-white/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-royal-indigo rounded-3xl flex items-center justify-center">
              <div className="w-5 h-5 bg-white rounded-2xl"></div>
            </div>
            <span className="font-barlow font-semibold text-white">
              Banana Blitz
            </span>
          </div>
          <p className="font-inter text-sm text-gray-400 text-center">
            © 2024 Banana Blitz. Play responsibly. Must be 18+ to play.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/terms"
              className="font-inter text-sm text-gray-400 hover:text-white"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="font-inter text-sm text-gray-400 hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/support"
              className="font-inter text-sm text-gray-400 hover:text-white"
            >
              Support
            </a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --gradient-royal-indigo: linear-gradient(135deg, #0054B5 0%, #4A46C9 100%);
          --gradient-purple-indigo: linear-gradient(135deg, #6253D8 0%, #2E2B73 100%);
          --gradient-cyan-blue: linear-gradient(135deg, #0085CE 0%, #004E93 100%);
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
        
        .gradient-purple-indigo {
          background: var(--gradient-purple-indigo);
        }
        
        .gradient-cyan-blue {
          background: var(--gradient-cyan-blue);
        }
        
        .gradient-gunmetal-midnight {
          background: var(--gradient-gunmetal-midnight);
        }
        
        .gradient-text {
          background: var(--gradient-royal-indigo);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 84, 181, 0.3);
        }
      `}</style>
    </div>
  );
}
