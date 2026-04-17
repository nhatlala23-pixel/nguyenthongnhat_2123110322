import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Play,
  FileText,
  Loader2,
  TrendingUp
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, subtext, trend, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex flex-col justify-between min-h-[180px]">
    <div className="flex justify-between items-start">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={28} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-4xl font-black text-gray-900 mt-1">{value}</h4>
        <p className="text-xs text-gray-400 font-medium">{subtext}</p>
      </div>
    </div>
  </div>
);

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appRes] = await Promise.all([
          api.get('/DoctorDashboard/stats'),
          api.get('/DoctorDashboard/recent-appointments')
        ]);
        setStats(statsRes.data);
        setAppointments(appRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Greeting Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-gray-900 leading-tight">
          Chào buổi sáng, <span className="text-blue-600">Bác sĩ {user?.fullName?.split(' ').pop()}.</span>
        </h1>
        <p className="text-gray-400 font-medium text-lg">
          Hôm nay bạn có {stats?.appointmentsToday} cuộc hẹn đã lên lịch và {stats?.priorityCases} ca cần ưu tiên.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          icon={Users}
          label="Tổng bệnh nhân"
          value={stats?.totalPatients.toLocaleString()}
          subtext="Tăng trưởng so với tháng trước"
          trend="+12%"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={Calendar}
          label="Lịch hôm nay"
          value={stats?.appointmentsToday}
          subtext={`${stats?.completedToday} đã hoàn thành`}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard 
          icon={AlertCircle}
          label="Ca ưu tiên"
          value={stats?.priorityCases || "0"}
          subtext="Cần kiểm tra ngay"
          color="bg-blue-600 text-white"
        />
      </div>

      {/* Main Grid: Appointments & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Appointments Table */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-gray-50 flex justify-between items-center">
             <h3 className="text-2xl font-black text-gray-900">Lịch khám sắp tới</h3>
             <div className="flex gap-2">
                {['Tất cả', 'Đang chờ', 'Đã xong'].map(tab => (
                  <button key={tab} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'Tất cả' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                    {tab}
                  </button>
                ))}
             </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bệnh nhân</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Thời gian</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lý do khám</th>
                  <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Trạng thái</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((app) => (
                  <tr key={app.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 text-sm overflow-hidden border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                          {app.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{app.patientName}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{app.patientId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                        <Clock size={16} />
                        {app.time}
                        <span className="text-[10px] text-gray-300 font-medium ml-1">30p</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-gray-600 max-w-[150px] truncate">{app.reason}</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        app.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' :
                        app.status === 'CheckedIn' ? 'bg-orange-50 text-orange-600' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {app.status === 'Confirmed' ? 'Đã xác nhận' : 'Đang chờ'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                            <Play size={14} fill="currentColor" />
                            KHÁM NGAY
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-20 text-center text-gray-400 font-medium">
                      Hiện tại bạn chưa có lịch hẹn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-10 bg-gray-50/50 border-t border-gray-100 text-center">
             <button className="text-blue-600 font-black text-sm hover:underline tracking-tighter">
               Xem toàn bộ lịch trình ngày hôm nay ({stats?.appointmentsToday})
             </button>
          </div>
        </div>

        {/* Sidebar Widgets: Trends & Notes */}
        <div className="lg:col-span-4 space-y-10">
          {/* Quick Notes Widget */}
          <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl shadow-blue-900/10 text-white">
             <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-bold">Ghi chú nhanh</h4>
                <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                   <Plus size={20} />
                </button>
             </div>
             
             <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">08:00 AM</p>
                   <p className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors">Họp giao ban định kỳ khoa Nội.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">02:30 PM</p>
                   <p className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors">Ký duyệt danh mục thuốc tháng 10.</p>
                </div>
             </div>

             <button className="w-full mt-10 py-4 border-2 border-dashed border-white/10 rounded-2xl text-xs font-black tracking-widest hover:border-blue-500/50 hover:text-blue-400 transition-all flex items-center justify-center gap-2">
                <Plus size={16} />
                THÊM GHI CHÚ MỚI
             </button>
          </div>

          {/* Patient Trends Widget (Static for now) */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
             <h4 className="text-lg font-black text-gray-900 mb-2">Xu hướng bệnh nhân</h4>
             <p className="text-xs text-gray-400 font-medium mb-8">Thống kê lưu lượng trong tuần</p>
             
             <div className="flex items-end justify-between h-48 gap-4 px-4 overflow-hidden pt-4">
                {[0.4, 0.6, 0.3, 0.9, 0.7, 0.5, 0.4].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-50 rounded-full relative group cursor-pointer hover:bg-blue-50 transition-all">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-100 rounded-full group-hover:bg-blue-600 transition-all duration-500"
                      style={{ height: `${h * 100}%` }}
                    ></div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-6 px-4">
               {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                 <span key={d} className="text-[10px] font-black text-gray-300 uppercase">{d}</span>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
