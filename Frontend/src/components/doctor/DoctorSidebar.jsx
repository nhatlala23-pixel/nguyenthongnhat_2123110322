import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Stethoscope,
  Briefcase,
  FileBarChart,
  Activity,
  Plus
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DoctorSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/doctor/dashboard' },
    { icon: Users, label: 'Bệnh nhân', path: '/doctor/patients' },
    { icon: Calendar, label: 'Lịch hẹn', path: '/doctor/appointments' },
    // { icon: Activity, label: 'Khoa lâm sàng', path: '/doctor/clinical' },
    // { icon: Briefcase, label: 'Nhân sự', path: '/doctor/staff' },
    // { icon: FileBarChart, label: 'Báo cáo', path: '/doctor/reports' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-white h-screen border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Stethoscope className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">PixelCare</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Clinical Sanctuary</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-black'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10">
           <button className="w-full bg-blue-50 text-blue-600 p-4 rounded-2xl flex items-center justify-center gap-2 font-black text-xs hover:bg-blue-100 transition-all group">
             <div className="bg-blue-600 text-white rounded-lg p-1 group-hover:scale-110 transition-transform">
               <Plus size={14} strokeWidth={3} />
             </div>
             BẮT ĐẦU KHÁM MỚI
           </button>
        </div>
      </div>

      <div className="mt-auto p-8 border-t border-gray-50">
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-600 transition-all font-bold text-sm">
            <Settings size={20} />
            <span>Cài đặt</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-600 transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar;
