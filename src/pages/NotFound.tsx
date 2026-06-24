import React from 'react';
    import { Link } from 'react-router-dom';
    import { Home } from 'lucide-react';

    export default function NotFound() {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
          <div className="text-center">
            <h1 className="text-9xl font-bold text-slate-200">404</h1>
            <div className="mt-[-2rem]">
              <h2 className="text-3xl font-bold text-slate-900">Page Not Found</h2>
              <p className="text-slate-500 mt-4 max-w-md mx-auto">
                The page you are looking for doesn't exist or has been moved.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                <Home size={20} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }