import React from 'react';
import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LogOut, 
  User, 
  Bell, 
  Home as HomeIcon, 
  Calendar, 
  FileText,
  Search
} from 'lucide-react';

const PatientLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  if (!user || role !== 'Patient') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-50">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link to="/patient/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all">
              <span className="text-xl font-black">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Clinical</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sanctuary</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-bold text-gray-900 flex items-center gap-2 hover:text-blue-600 transition-colors">
              <HomeIcon size={16} />
              Trang chủ
            </Link>
            <Link to="#" className="text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Calendar size={16} />
              Lịch hẹn
            </Link>
            <Link to="#" className="text-sm font-bold text-gray-400 flex items-center gap-2 hover:text-blue-600 transition-colors">
              <FileText size={16} />
              Hồ sơ của tôi
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden lg:flex relative group">
             <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <Search size={18} />
             </span>
             <input 
               type="text" 
               placeholder="Tìm kiếm bệnh án..." 
               className="w-64 pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-xs font-bold"
             />
          </div>

          <div className="h-8 w-[1px] bg-gray-100"></div>

          {/* Notification */}
          <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4 border-l border-gray-100 pl-6 group relative">
            <div className="text-right">
              <p className="text-sm font-black text-gray-900 leading-none">{user?.fullName}</p>
              <p className="text-[10px] text-orange-500 font-bold uppercase mt-1 tracking-wider">Bệnh nhân</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-blue-600 shadow-sm border-2 border-white overflow-hidden group-hover:border-blue-200 transition-all">
               {user?.fullName?.charAt(0)}
            </div>

            {/* Simple Hover Logout Button */}
            <button 
              onClick={handleLogout}
              className="ml-2 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="p-10 max-w-7xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientLayout;
