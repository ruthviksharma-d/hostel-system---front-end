import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, User, Mail, Lock, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { register as registerApi } from '../services/authService';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setLoading(true);
    try {
      await registerApi({ name, email, password, role: 'TENANT' });
      setRegistered(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full mb-6">
            <Clock size={36} className="text-amber-600" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-3">Registration Submitted</h1>
          <p className="text-slate-600 mb-2">Your account has been created and is <strong>awaiting approval</strong> from the hostel maintenance team.</p>
          <p className="text-slate-500 text-sm mb-8">You'll be able to log in once a maintenance staff member approves your account.</p>
          <Link
            to="/login"
            className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl mb-4 shadow-lg">
            <Wrench size={32} className="text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">Join HostelFix</h1>
          <p className="text-slate-500 mt-2">Create a tenant account to report maintenance issues</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          {/* Approval notice */}
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            Your account will need to be approved by the hostel team before you can log in.
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-slate-900/20 mt-4 disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? 'Submitting...' : 'Request Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
