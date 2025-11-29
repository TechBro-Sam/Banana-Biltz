import useAuth from "@/utils/useAuth";

function MainComponent() {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center gradient-gunmetal-midnight p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 gradient-royal-indigo rounded-3xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-white rounded-2xl"></div>
          </div>
          <h1 className="font-barlow text-3xl font-bold text-black dark:text-white mb-2">
            Sign Out
          </h1>
          <p className="font-inter text-gray-600 dark:text-gray-400">
            Are you sure you want to sign out?
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full gradient-royal-indigo rounded-3xl px-4 py-3 font-barlow text-lg font-semibold text-white transition-all hover-lift"
        >
          Sign Out
        </button>
      </div>

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
