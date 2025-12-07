// components/LoadingState.jsx

function LoadingState({ authChecked }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 px-4">
      <div className="text-center">
        <div className="inline-block w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-semibold text-sm sm:text-base">
          {!authChecked ? 'Authenticating...' : 'Loading dashboard...'}
        </p>
      </div>
    </div>
  );
}

export default LoadingState;