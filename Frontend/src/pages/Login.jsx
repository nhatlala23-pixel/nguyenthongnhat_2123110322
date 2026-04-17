import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      const from = location.state?.from?.pathname || '/';
      
      // Automatic redirection based on role
      if (result.role === 'Admin') navigate('/admin/dashboard');
      else if (result.role === 'Doctor') navigate('/doctor/dashboard');
      else if (result.role === 'Patient') navigate('/patient/home');
      else navigate(from);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F6] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/5 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-6">
              <LogIn size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Mừng bạn quay lại!</h1>
            <p className="text-gray-400 text-sm mt-2">Vui lòng đăng nhập vào hệ thống quản trị</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[11px] font-bold rounded-r-lg animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Tên đăng nhập hoặc Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-sm font-medium h-12"
                    placeholder="Email hoặc tên đăng nhập của bạn"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Mật khẩu</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-sm font-medium h-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-200 text-blue-600 focus:ring-blue-500" />
                <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-600">Ghi nhớ tôi</span>
              </label>
              <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Quên mật khẩu?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] h-14"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <span>Đăng nhập ngay</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-gray-400">
            Hệ thống quản trị bảo mật bởi Clinical Sanctuary.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
