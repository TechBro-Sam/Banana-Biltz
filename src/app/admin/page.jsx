"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Shield,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Database,
  AlertTriangle,
  Activity,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import useUser from "@/utils/useUser";

function StatCard({ icon: Icon, title, value, subtitle, gradient, trend }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center`}
        >
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <span
            className={`text-sm font-inter ${
              trend.startsWith("+")
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-inter text-sm text-gray-500 dark:text-gray-400 mb-1">
          {title}
        </h3>
        <p className="font-barlow text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </p>
        {subtitle && (
          <p className="font-inter text-xs text-gray-400 dark:text-gray-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function UserManagement() {
  const [userSearch, setUserSearch] = useState("");

  // Mock data - would come from real API
  const mockUsers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      balance: 1250.5,
      status: "active",
      role: "user",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      balance: 875.25,
      status: "active",
      role: "user",
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@example.com",
      balance: 0,
      status: "active",
      role: "admin",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
      <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white mb-6">
        User Management
      </h3>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 font-inter text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-600">
              <th className="text-left font-inter text-sm text-gray-500 dark:text-gray-400 py-3">
                User
              </th>
              <th className="text-left font-inter text-sm text-gray-500 dark:text-gray-400 py-3">
                Balance
              </th>
              <th className="text-left font-inter text-sm text-gray-500 dark:text-gray-400 py-3">
                Role
              </th>
              <th className="text-left font-inter text-sm text-gray-500 dark:text-gray-400 py-3">
                Status
              </th>
              <th className="text-left font-inter text-sm text-gray-500 dark:text-gray-400 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 dark:border-gray-700"
              >
                <td className="py-3">
                  <div>
                    <p className="font-inter font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="font-inter text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </td>
                <td className="py-3 font-barlow font-semibold text-gray-900 dark:text-white">
                  ${user.balance.toFixed(2)}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-inter ${
                      user.role === "admin"
                        ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={`flex items-center gap-1 text-xs font-inter ${
                      user.status === "active"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    <CheckCircle size={12} />
                    {user.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Eye
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                      <Ban size={16} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GameConfiguration() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
      <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Game Configuration
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            RTP Target (%)
          </label>
          <input
            type="number"
            min="90"
            max="99"
            defaultValue="96.5"
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 font-inter text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Max Bet Amount ($)
          </label>
          <input
            type="number"
            min="1"
            max="10000"
            defaultValue="100"
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 font-inter text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Banana Boss Frequency (%)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.1"
            defaultValue="5.0"
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 font-inter text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-2 block">
            Banana Bomb Frequency (%)
          </label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.1"
            defaultValue="8.0"
            className="w-full bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 font-inter text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6">
        <button className="gradient-royal-indigo rounded-2xl px-6 py-3 font-barlow font-semibold text-white hover-lift transition-all">
          Update Configuration
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: user, loading } = useUser();

  // Check if user is admin
  if (loading) {
    return (
      <AppLayout title="Admin" currentPath="/admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield size={32} className="text-white" />
            </div>
            <p className="font-inter text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <AppLayout title="Admin" currentPath="/admin">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle
                size={40}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <h1 className="font-barlow text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h1>
            <p className="font-inter text-gray-600 dark:text-gray-400 mb-6">
              You need admin privileges to access this page.
            </p>
            <a
              href="/dashboard"
              className="gradient-royal-indigo rounded-2xl px-6 py-3 font-barlow font-semibold text-white hover-lift transition-all inline-block"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin Dashboard" currentPath="/admin">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-barlow text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard 🛡️
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Monitor platform performance and manage game settings
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value="1,234"
            subtitle="Active players"
            gradient="gradient-royal-indigo"
            trend="+12%"
          />
          <StatCard
            icon={DollarSign}
            title="Platform Revenue"
            value="$45,678"
            subtitle="This month"
            gradient="gradient-purple-indigo"
            trend="+8.5%"
          />
          <StatCard
            icon={TrendingUp}
            title="Games Played"
            value="23,456"
            subtitle="Total rounds"
            gradient="gradient-cyan-blue"
            trend="+15%"
          />
          <StatCard
            icon={Activity}
            title="Active Sessions"
            value="89"
            subtitle="Right now"
            gradient="gradient-gunmetal-midnight"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* User Management */}
          <UserManagement />

          {/* Game Configuration */}
          <GameConfiguration />
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl p-6">
          <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white mb-6">
            System Status
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">
                Database
              </p>
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                Operational
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">
                Game Server
              </p>
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                Running
              </p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">
                Payments
              </p>
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                Active
              </p>
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
