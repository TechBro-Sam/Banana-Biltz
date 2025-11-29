"use client";

import { useState, useEffect } from "react";
import {
  Gamepad2,
  Wallet,
  TrendingUp,
  Clock,
  Plus,
  ChevronRight,
  Star,
  Target,
  Trophy,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import useUser from "@/utils/useUser";

// Mock data - will be replaced with real API calls
const mockStats = {
  balance: 1250.5,
  totalWins: 47,
  totalGames: 156,
  bestWin: 450.0,
  winRate: 30.1,
};

const mockRecentGames = [
  {
    id: 1,
    type: "win",
    amount: 125.5,
    fruit: "banana_boss",
    time: "2 minutes ago",
    multiplier: "5x",
  },
  {
    id: 2,
    type: "loss",
    amount: -25.0,
    fruit: "cherry",
    time: "5 minutes ago",
    multiplier: null,
  },
  {
    id: 3,
    type: "win",
    amount: 75.25,
    fruit: "banana_bomb",
    time: "12 minutes ago",
    multiplier: "3x",
  },
];

function StatCard({ icon: Icon, title, value, subtitle, gradient }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 hover-lift cursor-pointer">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="font-inter text-sm text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="font-barlow text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="font-inter text-xs text-gray-400 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function WalletCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden hover-lift cursor-pointer">
      <div className="gradient-royal-indigo p-6 relative">
        <div className="flex items-start justify-between text-white mb-4">
          <div>
            <p className="font-inter text-sm opacity-80">Total Balance</p>
            <p className="font-barlow text-3xl font-bold">
              ${mockStats.balance.toFixed(2)}
            </p>
          </div>
          <Wallet size={24} className="opacity-80" />
        </div>
        <div className="flex items-center gap-4 text-white">
          <button className="flex items-center gap-2 bg-white/20 rounded-2xl px-4 py-2 hover:bg-white/30 transition-colors">
            <Plus size={16} />
            <span className="font-inter text-sm font-medium">Deposit</span>
          </button>
          <a
            href="/wallet"
            className="font-inter text-sm underline opacity-80 hover:opacity-100"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      icon: Gamepad2,
      label: "Play Now",
      subtitle: "Start a new game",
      href: "/game",
      gradient: "gradient-royal-indigo",
    },
    {
      icon: Target,
      label: "Shop",
      subtitle: "Buy power-ups",
      href: "/shop",
      gradient: "gradient-purple-indigo",
    },
    {
      icon: Trophy,
      label: "Leaderboard",
      subtitle: "See top players",
      href: "/leaderboard",
      gradient: "gradient-cyan-blue",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white">
        Quick Actions
      </h3>
      <div className="grid gap-4">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="bg-white dark:bg-gray-800 rounded-3xl p-4 flex items-center gap-4 hover-lift transition-all"
          >
            <div
              className={`w-12 h-12 ${action.gradient} rounded-2xl flex items-center justify-center`}
            >
              <action.icon size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-barlow text-lg font-semibold text-gray-900 dark:text-white">
                {action.label}
              </p>
              <p className="font-inter text-sm text-gray-500 dark:text-gray-400">
                {action.subtitle}
              </p>
            </div>
            <ChevronRight
              size={20}
              className="text-gray-400 dark:text-gray-500"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white">
          Recent Games
        </h3>
        <a
          href="/wallet?tab=history"
          className="font-inter text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="space-y-3">
        {mockRecentGames.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                game.type === "win"
                  ? "bg-green-100 dark:bg-green-900"
                  : "bg-red-100 dark:bg-red-900"
              }`}
            >
              {game.type === "win" ? (
                <TrendingUp
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              ) : (
                <TrendingUp
                  size={16}
                  className="text-red-600 dark:text-red-400 rotate-180"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-inter text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {game.fruit.replace("_", " ")}
                </p>
                {game.multiplier && (
                  <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full font-inter">
                    {game.multiplier}
                  </span>
                )}
              </div>
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                {game.time}
              </p>
            </div>
            <p
              className={`font-barlow text-lg font-bold ${
                game.type === "win"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {game.type === "win" ? "+" : ""}$
              {Math.abs(game.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: user } = useUser();

  return (
    <AppLayout title="Dashboard" currentPath="/dashboard">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-barlow text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || "Player"}! 👋
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Ready to slice some fruit and win big today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Trophy}
            title="Total Wins"
            value={mockStats.totalWins}
            subtitle={`${mockStats.winRate}% win rate`}
            gradient="gradient-royal-indigo"
          />
          <StatCard
            icon={Gamepad2}
            title="Games Played"
            value={mockStats.totalGames}
            subtitle="This month"
            gradient="gradient-purple-indigo"
          />
          <StatCard
            icon={Star}
            title="Best Win"
            value={`$${mockStats.bestWin.toFixed(2)}`}
            subtitle="Personal record"
            gradient="gradient-cyan-blue"
          />
          <StatCard
            icon={TrendingUp}
            title="Win Rate"
            value={`${mockStats.winRate}%`}
            subtitle="Above average!"
            gradient="gradient-gunmetal-midnight"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Card */}
            <WalletCard />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <QuickActions />

            {/* Promotional Card */}
            <div className="gradient-purple-indigo rounded-3xl p-6 text-white">
              <h4 className="font-barlow text-xl font-bold mb-3">
                🎯 Daily Challenge
              </h4>
              <p className="font-inter text-sm opacity-90 mb-4">
                Slice 50 fruits today and earn a 2x multiplier bonus on your
                next game!
              </p>
              <div className="bg-white/20 rounded-2xl p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-inter text-sm">Progress</span>
                  <span className="font-inter text-sm">23/50</span>
                </div>
                <div className="bg-white/20 rounded-full h-2 mt-2">
                  <div className="bg-white rounded-full h-2 w-[46%]"></div>
                </div>
              </div>
              <a
                href="/game"
                className="bg-white/20 hover:bg-white/30 rounded-2xl px-4 py-2 font-inter text-sm font-medium transition-colors inline-block"
              >
                Play Now
              </a>
            </div>
          </div>
        </div>
      </div>

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
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </AppLayout>
  );
}
