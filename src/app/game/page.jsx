"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Wallet,
  TrendingUp,
  Zap,
  Star,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function GamePage() {
  const [gameState, setGameState] = useState("ready"); // ready, playing, loading, finished
  const [balance, setBalance] = useState(1250.5);
  const [betAmount, setBetAmount] = useState(10);
  const [gameSession, setGameSession] = useState(null);
  const [lastWin, setLastWin] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const gameContainerRef = useRef(null);

  // Mock game results
  const mockGameResult = {
    outcome: {
      prizes: [
        { fruit: "banana", payout_cents: 500 },
        { fruit: "apple", payout_cents: 300 },
      ],
      total_payout_cents: 800,
      events: ["banana_bomb"],
    },
    balance_after_cents: 125050,
  };

  const handleStartGame = () => {
    if (balance < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    setGameState("loading");
    setBalance((prev) => prev - betAmount);

    // Simulate game loading and play
    setTimeout(() => {
      setGameState("playing");

      // Simulate game completion
      setTimeout(() => {
        const result =
          Math.random() > 0.6
            ? mockGameResult
            : {
                ...mockGameResult,
                outcome: { ...mockGameResult.outcome, total_payout_cents: 0 },
              };

        if (result.outcome.total_payout_cents > 0) {
          setLastWin(result.outcome.total_payout_cents / 100);
          setBalance(result.balance_after_cents / 100);
        }

        setGameState("finished");

        // Auto-reset to ready after showing result
        setTimeout(() => {
          setGameState("ready");
          setLastWin(null);
        }, 3000);
      }, 3000);
    }, 1000);
  };

  const resetGame = () => {
    setGameState("ready");
    setLastWin(null);
  };

  // Unity WebGL placeholder
  const UnityGameContainer = () => (
    <div
      ref={gameContainerRef}
      className="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center relative overflow-hidden"
    >
      {/* Game UI Overlay */}
      {gameState === "loading" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 gradient-royal-indigo rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <p className="font-barlow text-lg font-semibold">
              Preparing your game...
            </p>
          </div>
        </div>
      )}

      {gameState === "finished" && lastWin && (
        <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-white" />
            </div>
            <h3 className="font-barlow text-3xl font-bold mb-2">Big Win!</h3>
            <p className="font-inter text-xl">${lastWin.toFixed(2)}</p>
          </div>
        </div>
      )}

      {/* Placeholder Game Content */}
      <div className="text-center text-white">
        {gameState === "ready" && (
          <>
            <h3 className="font-barlow text-4xl font-bold mb-4">
              🍌 Banana Blitz
            </h3>
            <p className="font-inter text-lg opacity-80 mb-6">
              Unity WebGL Game Loading Zone
            </p>
            <p className="font-inter text-sm opacity-60">
              The actual Unity game will be embedded here when ready
            </p>
          </>
        )}

        {gameState === "playing" && (
          <>
            <h3 className="font-barlow text-3xl font-bold mb-4">
              Slicing Fruits! 🔪
            </h3>
            <div className="flex items-center justify-center gap-4 text-2xl">
              🍌 🍎 🍊 🍍 🍉
            </div>
            <p className="font-inter text-lg opacity-80 mt-4">
              Keep slicing for big rewards!
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout title="Game" currentPath="/game">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] lg:h-screen">
        {/* Game Area */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="h-full">
            <UnityGameContainer />
          </div>
        </div>

        {/* Game Controls Sidebar */}
        <div className="w-full lg:w-96 bg-white dark:bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {/* Wallet Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                Balance
              </span>
              <Wallet size={16} className="text-gray-500 dark:text-gray-400" />
            </div>
            <p className="font-barlow text-2xl font-bold text-gray-900 dark:text-white">
              ${balance.toFixed(2)}
            </p>
          </div>

          {/* Bet Controls */}
          <div className="space-y-4">
            <h3 className="font-barlow text-lg font-semibold text-gray-900 dark:text-white">
              Place Your Bet
            </h3>

            <div className="space-y-3">
              <label className="font-inter text-sm text-gray-600 dark:text-gray-400">
                Bet Amount
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  disabled={gameState !== "ready"}
                >
                  -
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) =>
                      setBetAmount(Math.max(1, parseFloat(e.target.value) || 1))
                    }
                    className="w-full bg-gray-100 dark:bg-gray-600 rounded-xl px-4 py-3 font-barlow text-lg font-semibold text-center text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
                    disabled={gameState !== "ready"}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-inter text-sm">
                    $
                  </span>
                </div>
                <button
                  onClick={() => setBetAmount(betAmount + 5)}
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                  disabled={gameState !== "ready"}
                >
                  +
                </button>
              </div>

              {/* Quick Bet Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 25].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`py-2 px-3 rounded-xl font-inter text-sm font-medium transition-colors ${
                      betAmount === amount
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"
                    }`}
                    disabled={gameState !== "ready"}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Game Actions */}
          <div className="space-y-3">
            <button
              onClick={handleStartGame}
              disabled={gameState !== "ready" || balance < betAmount}
              className="w-full gradient-royal-indigo rounded-2xl px-6 py-4 flex items-center justify-center gap-3 text-white font-barlow text-lg font-semibold hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {gameState === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Starting...
                </>
              ) : gameState === "playing" ? (
                <>
                  <Zap size={20} />
                  Playing...
                </>
              ) : (
                <>
                  <Play size={20} />
                  Start Game
                </>
              )}
            </button>

            {gameState !== "ready" && (
              <button
                onClick={resetGame}
                className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-2xl px-6 py-3 flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300 font-barlow font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            )}
          </div>

          {/* Game Settings */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-600 space-y-4">
            <h4 className="font-barlow font-semibold text-gray-900 dark:text-white">
              Game Settings
            </h4>

            <div className="flex items-center justify-between">
              <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                Auto Play
              </span>
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isAutoPlay ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    isAutoPlay ? "translate-x-6" : "translate-x-0.5"
                  }`}
                ></div>
              </button>
            </div>

            <button className="w-full flex items-center justify-center gap-3 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Settings size={18} />
              <span className="font-inter text-sm">Game Options</span>
            </button>
          </div>

          {/* Game Stats */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-600 space-y-3">
            <h4 className="font-barlow font-semibold text-gray-900 dark:text-white">
              Session Stats
            </h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="font-barlow text-lg font-bold text-gray-900 dark:text-white">
                  $0.00
                </p>
                <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                  Session P&L
                </p>
              </div>
              <div>
                <p className="font-barlow text-lg font-bold text-gray-900 dark:text-white">
                  0
                </p>
                <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                  Games Played
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --gradient-royal-indigo: linear-gradient(135deg, #0054B5 0%, #4A46C9 100%);
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
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 84, 181, 0.3);
        }
      `}</style>
    </AppLayout>
  );
}
