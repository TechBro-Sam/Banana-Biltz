"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShoppingBag,
  Zap,
  Star,
  Target,
  Bomb,
  Crown,
  Plus,
  Wallet,
  Check,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

// Icon mapping for shop items
const getItemIcon = (itemKey) => {
  const iconMap = {
    banana_boss: Crown,
    banana_bomb: Bomb,
    banana_blitz: Zap,
    fruit_multiplier: Star,
    extra_slices: Target,
  };
  return iconMap[itemKey] || ShoppingBag;
};

// Color mapping for shop items
const getItemGradient = (itemKey) => {
  const gradientMap = {
    banana_boss: "gradient-gunmetal-midnight",
    banana_bomb: "gradient-royal-indigo",
    banana_blitz: "gradient-purple-indigo",
    fruit_multiplier: "gradient-cyan-blue",
    extra_slices: "gradient-royal-indigo",
  };
  return gradientMap[itemKey] || "gradient-royal-indigo";
};

function ShopItem({ item, onPurchase, isLoading }) {
  const Icon = getItemIcon(item.key);
  const gradient = getItemGradient(item.key);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 hover-lift cursor-pointer">
      <div className="text-center mb-6">
        <div
          className={`w-20 h-20 ${gradient} rounded-3xl flex items-center justify-center mx-auto mb-4`}
        >
          <Icon size={32} className="text-white" />
        </div>
        <h3 className="font-barlow text-xl font-bold text-gray-900 dark:text-white mb-2">
          {item.name}
        </h3>
        <p className="font-inter text-sm text-gray-600 dark:text-gray-400 mb-4">
          {item.description}
        </p>
        <div className="text-center mb-6">
          <span className="font-barlow text-3xl font-bold text-blue-600 dark:text-blue-400">
            ${item.price.toFixed(2)}
          </span>
        </div>
      </div>

      <button
        onClick={() => onPurchase(item)}
        disabled={isLoading}
        className={`w-full ${gradient} rounded-2xl px-6 py-3 flex items-center justify-center gap-3 text-white font-barlow font-semibold hover-lift transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Purchasing...
          </>
        ) : (
          <>
            <ShoppingBag size={18} />
            Purchase
          </>
        )}
      </button>
    </div>
  );
}

function WalletInfo() {
  const { data: balance, isLoading } = useQuery({
    queryKey: ["wallet", "balance"],
    queryFn: async () => {
      const response = await fetch("/api/wallet/balance");
      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden hover-lift">
      <div className="gradient-royal-indigo p-6">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="font-inter text-sm opacity-80">Available Balance</p>
            <p className="font-barlow text-3xl font-bold">
              ${balance?.balance?.toFixed(2) || "0.00"}
            </p>
          </div>
          <Wallet size={32} className="opacity-80" />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <a
            href="/wallet"
            className="bg-white/20 hover:bg-white/30 rounded-2xl px-4 py-2 font-inter text-sm font-medium transition-colors"
          >
            Manage Wallet
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const queryClient = useQueryClient();
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);

  // Fetch shop items
  const { data: shopData, isLoading: itemsLoading } = useQuery({
    queryKey: ["shop", "items"],
    queryFn: async () => {
      const response = await fetch("/api/shop/items");
      if (!response.ok) {
        throw new Error("Failed to fetch shop items");
      }
      return response.json();
    },
  });

  // Purchase mutation
  const purchaseMutation = useMutation({
    mutationFn: async ({ item_key }) => {
      const response = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_key }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Purchase failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Refresh wallet balance
      queryClient.invalidateQueries(["wallet", "balance"]);

      // Show success message
      setPurchaseSuccess(data.message);
      setTimeout(() => setPurchaseSuccess(null), 5000);
    },
    onError: (error) => {
      alert(`Purchase failed: ${error.message}`);
    },
  });

  const handlePurchase = (item) => {
    if (
      confirm(
        `Are you sure you want to purchase ${item.name} for $${item.price.toFixed(2)}?`,
      )
    ) {
      purchaseMutation.mutate({ item_key: item.key });
    }
  };

  return (
    <AppLayout title="Shop" currentPath="/shop">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-barlow text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Power-up Shop 🛒
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Purchase special abilities and boosts to enhance your gameplay
          </p>
        </div>

        {/* Success Message */}
        {purchaseSuccess && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>
            <p className="font-inter text-green-800 dark:text-green-200 font-medium">
              {purchaseSuccess}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Wallet Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <WalletInfo />

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                <h3 className="font-barlow text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Pro Tip
                </h3>
                <p className="font-inter text-sm text-blue-800 dark:text-blue-200">
                  Power-ups are consumed when used in-game. Stock up for better
                  winning chances!
                </p>
              </div>
            </div>
          </div>

          {/* Shop Items */}
          <div className="lg:col-span-3">
            {itemsLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 animate-pulse"
                  >
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-3xl mx-auto mb-4"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded mb-6"></div>
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-600 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            ) : shopData?.items?.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {shopData.items.map((item) => (
                  <ShopItem
                    key={item.id}
                    item={item}
                    onPurchase={handlePurchase}
                    isLoading={purchaseMutation.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag
                    size={40}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <h3 className="font-barlow text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Items Available
                </h3>
                <p className="font-inter text-gray-600 dark:text-gray-400">
                  Check back later for new power-ups and items!
                </p>
              </div>
            )}
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
