import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import { Search, Bell, User } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col pl-72">
        <header className="h-20 bg-white border-b border-gray-50 flex items-center px-8 sticky top-0 z-10">
          <div className="flex justify-between items-center w-full">
            <div className="relative w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-transparent bg-gray-50 rounded-full focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                placeholder="Tìm kiếm hồ sơ, bác sĩ..."
              />
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-gray-100 mx-2"></div>

              <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none">BS. Nguyễn Văn An</p>
                  <p className="text-[11px] text-gray-400 font-medium">Trưởng khoa Nội</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all">
                  <img 
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1470&auto=format&fit=crop" 
                    alt="avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
