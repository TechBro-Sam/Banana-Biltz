"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Target,
  Trophy,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const TRANSACTION_TYPES = {
  deposit: {
    label: "Deposit",
    icon: ArrowDownLeft,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  withdraw: {
    label: "Withdrawal",
    icon: ArrowUpRight,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900",
  },
  bet: {
    label: "Bet",
    icon: Target,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900",
  },
  win: {
    label: "Win",
    icon: Trophy,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900",
  },
  adjustment: {
    label: "Purchase",
    icon: DollarSign,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900",
  },
};

function WalletBalance() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: async () => {
      const response = await fetch("/api/wallet/balance");
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
        </div>
        <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded mb-6"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden hover-lift">
      <div className="gradient-royal-indigo p-8">
        <div className="flex items-center justify-between text-white mb-6">
          <div>
            <p className="font-inter text-sm opacity-80">Current Balance</p>
            <p className="font-barlow text-5xl font-bold">
              ${balance?.balance?.toFixed(2) || "0.00"}
            </p>
            <p className="font-inter text-xs opacity-60 mt-1">
              {balance?.currency || "USD"}
            </p>
          </div>
          <Wallet size={48} className="opacity-80" />
        </div>

        <div className="flex gap-4">
          <button
            className="flex-1 bg-white/20 hover:bg-white/30 rounded-2xl px-6 py-3 font-barlow font-semibold text-white transition-colors flex items-center justify-center gap-2"
            onClick={() => alert("Deposit functionality coming soon!")}
          >
            <Plus size={18} />
            Deposit
          </button>
          <button
            className="flex-1 border-2 border-white/30 hover:border-white/50 rounded-2xl px-6 py-3 font-barlow font-semibold text-white transition-colors flex items-center justify-center gap-2"
            onClick={() => alert("Withdrawal functionality coming soon!")}
          >
            <ArrowUpRight size={18} />
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

function TransactionItem({ transaction }) {
  const typeConfig =
    TRANSACTION_TYPES[transaction.type] || TRANSACTION_TYPES.adjustment;
  const Icon = typeConfig.icon;
  const isPositive = transaction.amount >= 0;
  const amount = Math.abs(transaction.amount);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div
        className={`w-12 h-12 ${typeConfig.bgColor} rounded-2xl flex items-center justify-center`}
      >
        <Icon size={20} className={typeConfig.color} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">
            {typeConfig.label}
          </p>
          {transaction.metadata?.game_round && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full font-inter">
              Game
            </span>
          )}
          {transaction.metadata?.purchase_type === "shop_item" && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full font-inter">
              Shop
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Clock size={12} />
          <span className="font-inter">
            {new Date(transaction.created_at).toLocaleString()}
          </span>
          {transaction.reference && (
            <span className="font-mono opacity-60">
              #{transaction.reference.slice(0, 8)}...
            </span>
          )}
        </div>
      </div>

      <div className="text-right">
        <p
          className={`font-barlow text-lg font-bold ${
            isPositive
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? "+" : "-"}${amount.toFixed(2)}
        </p>
        <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
          Balance: ${transaction.balance_after.toFixed(2)}
        </p>
      </div>
    </div>
  );
}

function TransactionFilters({ selectedType, onTypeChange }) {
  const types = [
    { value: "", label: "All Transactions" },
    { value: "deposit", label: "Deposits" },
    { value: "withdraw", label: "Withdrawals" },
    { value: "bet", label: "Bets" },
    { value: "win", label: "Wins" },
    { value: "adjustment", label: "Purchases" },
  ];

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-500 dark:text-gray-400" />
        <span className="font-inter text-sm text-gray-700 dark:text-gray-300">
          Filter:
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.value}
            onClick={() => onTypeChange(type.value)}
            className={`px-3 py-1 rounded-2xl font-inter text-sm transition-colors ${
              selectedType === type.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WalletPage() {
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: [
      "wallet",
      "transactions",
      { type: selectedType, page: currentPage },
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (selectedType) {
        params.append("type", selectedType);
      }

      const response = await fetch(`/api/wallet/transactions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    },
  });

  return (
    <AppLayout title="Wallet" currentPath="/wallet">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-barlow text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Wallet 💳
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Manage your balance and view transaction history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Balance Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <WalletBalance />

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
                <h3 className="font-barlow text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                      Total Deposits
                    </span>
                    <span className="font-barlow font-semibold text-gray-900 dark:text-white">
                      $100.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                      Total Winnings
                    </span>
                    <span className="font-barlow font-semibold text-green-600 dark:text-green-400">
                      $0.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-inter text-sm text-gray-600 dark:text-gray-400">
                      Total Spent
                    </span>
                    <span className="font-barlow font-semibold text-red-600 dark:text-red-400">
                      $0.00
                    </span>
                  </div>
                </div>
              </div>

              {/* Export */}
              <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl px-6 py-3 flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300 font-barlow font-semibold transition-colors">
                <Download size={18} />
                Export History
              </button>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white">
                  Transaction History
                </h2>
                <span className="font-inter text-sm text-gray-500 dark:text-gray-400">
                  {transactionsData?.pagination?.total || 0} transactions
                </span>
              </div>

              <TransactionFilters
                selectedType={selectedType}
                onTypeChange={setSelectedType}
              />

              {transactionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-2xl"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2 w-24"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-1 w-16"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : transactionsData?.transactions?.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {transactionsData.transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {transactionsData?.pagination?.total_pages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={!transactionsData.pagination.has_previous}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="font-inter text-sm text-gray-500 dark:text-gray-400">
                        Page {transactionsData.pagination.page} of{" "}
                        {transactionsData.pagination.total_pages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => p + 1)}
                        disabled={!transactionsData.pagination.has_next}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-inter text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Wallet
                      size={40}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Transactions Yet
                  </h3>
                  <p className="font-inter text-gray-600 dark:text-gray-400 mb-6">
                    Start playing games or make a deposit to see your
                    transaction history here.
                  </p>
                  <a
                    href="/game"
                    className="gradient-royal-indigo rounded-2xl px-6 py-3 font-barlow font-semibold text-white hover-lift transition-all inline-block"
                  >
                    Start Playing
                  </a>
                </div>
              )}
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
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </AppLayout>
  );
}
