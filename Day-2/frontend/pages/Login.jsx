import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Temporary bypass check for development
    if (email && password) {
      alert(`Logging in as: ${email}`);
      if (onLoginSuccess) onLoginSuccess(); 
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl mb-2">🤖</div>
          <h2 className="text-2xl font-bold text-white tracking-tight">AI Reviewer Login</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to start auditing your code templates</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="developer@example.com"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <a href="#register" className="text-blue-400 hover:underline font-medium">
            Register here
          </a>
        </div>

      </div>
    </div>
  );
}