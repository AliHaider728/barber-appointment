// components/ErrorState.jsx

import { AlertCircle } from 'lucide-react';

function ErrorState({ error, navigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full">
        <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorState;