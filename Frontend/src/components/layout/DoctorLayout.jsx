import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DoctorSidebar from '../doctor/DoctorSidebar';
import { Search, Bell, AlertTriangle } from 'lucide-react';

const DoctorLayout = () => {
  const { user, role } = useAuth();

  if (!user || role !== 'Doctor') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DoctorSidebar />
      
      <main className="pl-72 min-h-screen">
        {/* Top Navbar */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="relative w-96 group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bệnh nhân, hồ sơ..." 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="bg-red-500 text-white px-6 py-2.5 rounded-full text-xs font-black tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all active:scale-95 flex items-center gap-2">
              <AlertTriangle size={14} />
              KHẨN CẤP
            </button>

            <div className="h-8 w-[1px] bg-gray-100"></div>

            <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-4 border-l border-gray-100 pl-6">
              <div className="text-right">
                <p className="text-sm font-black text-gray-900 leading-none">BS. {user?.fullName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">Khoa Nội Tổng Quát</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-600 shadow-sm overflow-hidden border-2 border-white">
                 {/* Placeholder for doctor image */}
                 {user?.fullName?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DoctorLayout;
