import { useState } from "react";
import {
  Home,
  Gamepad2,
  ShoppingBag,
  Wallet,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import useUser from "@/utils/useUser";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard", active: true },
  { icon: Gamepad2, label: "Game", path: "/game" },
  { icon: ShoppingBag, label: "Shop", path: "/shop" },
  { icon: Wallet, label: "Wallet", path: "/wallet" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const adminNavItems = [{ icon: Shield, label: "Admin", path: "/admin" }];

function NavLink({ icon: Icon, label, path, active, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    }
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  };

  return (
    <a
      href={path}
      onClick={handleClick}
      className={`flex items-center gap-4 cursor-pointer p-3 rounded-2xl transition-all ${
        active
          ? "text-blue-600 bg-blue-50 relative"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      {active && (
        <div className="absolute -left-6 w-1 h-8 bg-blue-600 rounded-r-3xl"></div>
      )}
      <Icon size={24} />
      <span className="font-barlow text-base font-medium">{label}</span>
    </a>
  );
}

function UserMenu({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full"
      >
        <div className="w-10 h-10 gradient-royal-indigo rounded-full flex items-center justify-center">
          <User size={20} className="text-white" />
        </div>
        <div className="flex-1 text-left">
          <p className="font-inter text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || "Player"}
          </p>
          <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 p-2">
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="font-inter text-sm font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentPath = "/dashboard",
}) {
  const { data: user } = useUser();
  const isAdmin = user?.role === "admin";

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/account/logout";
    }
  };

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        lg:flex lg:flex-col min-h-screen border-r border-gray-200 dark:border-gray-700
      `}
      >
        <div className="lg:hidden flex justify-end px-6 pt-6">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="px-6 pt-6 lg:pt-12 flex-1 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 gradient-royal-indigo rounded-3xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-2xl"></div>
            </div>
            <span className="font-barlow text-xl font-bold text-gray-900 dark:text-white">
              Banana Blitz
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                {...item}
                active={currentPath === item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}

            {isAdmin && (
              <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-600">
                <p className="font-inter text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-3">
                  Admin
                </p>
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    {...item}
                    active={currentPath === item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>
            )}
          </nav>

          {/* User Menu */}
          <div className="mt-auto pb-6">
            <UserMenu user={user} onSignOut={handleSignOut} />
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppLayout({ children, title, currentPath }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-10 h-10 bg-white rounded-2xl"></div>
          </div>
          <p className="font-inter text-gray-600 dark:text-gray-400 text-lg">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to sign in
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        currentPath={currentPath}
      />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu size={24} className="text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="font-barlow text-lg font-semibold text-gray-900 dark:text-white">
              {title || "Banana Blitz"}
            </h1>
            <div className="w-10"></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
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
      `}</style>
    </div>
  );
}
