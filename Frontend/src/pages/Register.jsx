import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/Auth/register', {
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        role: 'Patient'
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data || 'Đã xảy ra lỗi trong quá trình đăng ký.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FDF8F6] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2rem] p-12 text-center shadow-2xl shadow-blue-900/5 space-y-6 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Đăng ký thành công!</h1>
          <p className="text-gray-400 font-medium">Bạn đã tạo tài khoản thành công. Đang chuyển hướng về trang Đăng nhập...</p>
          <div className="flex justify-center border-t border-gray-50 pt-6">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F6] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/5 border border-white/50 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-6">
              <UserPlus size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Bắt đầu hành trình nhé!</h1>
            <p className="text-gray-400 text-sm mt-2">Tạo tài khoản bệnh nhân để sử dụng dịch vụ</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-[11px] font-bold rounded-r-lg animate-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Họ và Tên</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-sm font-medium h-12"
                  placeholder="VD: Nguyễn Văn Anh"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Tên đăng nhập</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-sm font-medium h-12"
                  placeholder="VD: anhnguyen2023"
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none text-sm font-medium h-12"
                  placeholder="Nhập lại mật khẩu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-blue-600 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] h-14"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <span>Đăng ký tham gia</span>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="text-xs font-medium text-gray-400">
                Bạn đã có tài khoản?{' '}
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Đăng nhập tại đây
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
