import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Settings, 
  LogOut, 
  Library,
  Clock
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Library, label: 'Quản lý Khoa', path: '/admin/departments' },
    { icon: Stethoscope, label: 'Quản lý Bác sĩ', path: '/admin/doctors' },
    { icon: Calendar, label: 'Lịch làm việc', path: '/admin/schedules' },
    { icon: Users, label: 'Quản lý Bệnh nhân', path: '/admin/patients' },
    { icon: Clock, label: 'Lịch hẹn bệnh nhân', path: '/admin/appointments' },
    // { icon: Settings, label: 'Cấu hình', path: '/admin/settings' },
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
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Management</p>
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
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-gray-50">
        <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Admin System</p>
            <p className="text-[10px] text-gray-400 font-medium">Quản trị viên</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
