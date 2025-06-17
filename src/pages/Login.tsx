import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'frontdesk' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'frontdesk') {
      navigate('/frontdesk');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-blue-100"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
            <Dumbbell className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 ml-3">FitFlix</h1>
        </div>

        {!role ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
              Select Your Role
            </h2>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('admin')}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
            >
              Central Admin
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(14, 165, 233, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('frontdesk')}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              Front Desk
            </motion.button>
          </div>
        ) : (
          <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
              {role === 'admin' ? 'Central Admin Login' : 'Front Desk Login'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Back to Role Selection
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
              >
                Login
              </motion.button>
            </div>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;