import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUnlockAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearError());
  }, [email, password, dispatch]);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/member-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md card transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
            <FaUserShield className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portal Access</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to manage your gym activities</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 flex items-start">
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full btn-primary flex justify-center items-center py-2.5 text-sm font-semibold tracking-wide"
          >
            <FaUnlockAlt className="mr-2" />
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
          <p>Admin Login: admin@gmail.com / 123456</p>
          <p className="mt-1">Member Login: Any other credentials</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
