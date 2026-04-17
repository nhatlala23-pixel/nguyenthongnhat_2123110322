import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Thứ 2', value: 400 },
    { name: 'Thứ 3', value: 300 },
    { name: 'Thứ 4', value: 500 },
    { name: 'Thứ 5', value: 450 },
    { name: 'Thứ 6', value: 600 },
    { name: 'Thứ 7', value: 550 },
    { name: 'CN', value: 350 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/Dashboard/admin');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Chào buổi sáng, Bác sĩ An</h2>
        <p className="text-gray-500 text-sm mt-1">Dưới đây là tóm tắt hoạt động bệnh viện hôm nay, {new Date().toLocaleDateString('vi-VN')}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" size={24} />} 
          label="Tổng bác sĩ" 
          value={stats?.totalDoctors || 0} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          icon={<UserPlus className="text-purple-600" size={24} />} 
          label="Bệnh nhân nội trú" 
          value={stats?.totalPatients || 0} 
          trend="+4%" 
          trendUp={true} 
        />
        <StatCard 
          icon={<Calendar className="text-orange-600" size={24} />} 
          label="Lịch hẹn hôm nay" 
          value={stats?.todayAppointments || 0} 
          trend="-2%" 
          trendUp={false} 
        />
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-100 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-medium uppercase tracking-wider">Hiệu suất vận hành</p>
            <h3 className="text-3xl font-bold mt-2">{stats?.operationEfficiency || 0}%</h3>
          </div>
          <div className="mt-4 w-full h-1 bg-blue-500 rounded-full overflow-hidden relative z-10">
            <div className="bg-white h-full transition-all duration-1000" style={{ width: `${stats?.operationEfficiency || 0}%` }}></div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-blue-500/20 group-hover:scale-110 transition-all duration-500">
            <TrendingUp size={120} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-gray-900">Lưu lượng Bệnh nhân</h3>
              <p className="text-xs text-gray-400">So sánh hàng tuần giữa các khoa</p>
            </div>
            <select className="bg-gray-50 border-none text-xs font-semibold text-gray-500 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-500" size={18} />
            <h3 className="font-bold text-gray-900">Ca khẩn cấp ()</h3>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            
          </div>
          <button className="mt-auto pt-6 text-center text-blue-600 text-xs font-bold hover:underline">
            Xem tất cả thông báo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-bold text-gray-900">Hoạt động gần đây</h3>
          <div className="flex gap-4">
            <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"><Activity size={18} /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bệnh nhân</th>
                <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bác sĩ phụ trách</th>
                <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Khoa</th>
                <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
                <th className="pb-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentActivities.map((activity, index) => (
                <tr key={index} className="group hover:bg-gray-50/50 transition-all">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        {activity.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{activity.patientName}</p>
                        <p className="text-[11px] text-gray-400">ID: {activity.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm font-medium text-gray-600">BS. {activity.doctorName}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      {activity.department}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-500">{activity.time}</td>
                  <td className="py-4 text-right">
                    <StatusBadge status={activity.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center pt-4 border-t border-gray-50">
          <button className="text-blue-600 text-xs font-bold hover:underline uppercase tracking-widest px-8">
            Xem toàn bộ lịch sử hoạt động
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-all duration-300">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </span>
    </div>
    <div className="mt-6">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

const EmergencyCard = ({ name, room, desc, doctor, color }) => (
  <div className={`p-4 rounded-xl border-l-4 ${color === 'red' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'}`}>
    <div className="flex justify-between items-start mb-1">
      <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${color === 'red' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
        {room}
      </span>
    </div>
    <p className="text-[11px] text-gray-600 line-clamp-2">{desc}</p>
    <div className="flex items-center gap-2 mt-3">
      <div className="w-5 h-5 rounded-full bg-gray-200"></div>
      <p className="text-[10px] text-gray-400 font-medium">Giao cho BS. {doctor}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    'Confirmed': 'bg-green-50 text-green-600 border-green-100',
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Cancelled': 'bg-red-50 text-red-600 border-red-100',
    'CheckedIn': 'bg-blue-50 text-blue-600 border-blue-100',
    'Completed': 'bg-gray-50 text-gray-600 border-gray-100',
  };
  return (
    <span className={`px-3 py-1 rounded-md text-[10px] font-bold border ${styles[status] || styles['Pending']}`}>
      {status === 'Confirmed' ? 'Đã xác nhận' : status === 'Pending' ? 'Đang chờ' : status === 'Cancelled' ? 'Đã hủy' : status}
    </span>
  );
};

export default AdminDashboard;
