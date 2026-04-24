import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Activity, 
  ArrowRight, 
  Plus, 
  Bell,
  Stethoscope,
  ChevronRight,
  Loader2
} from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import BookingModal from '../../components/patient/BookingModal';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <h4 className="text-2xl font-black text-gray-900 mt-1">{value}</h4>
  </div>
);

const PatientHome = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await api.get('/appointments');
      const data = response.data.items || response.data;
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching patient data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const upcomingApp = appointments.filter(a => a.status !== 'Completed' && a.status !== 'Cancelled')[0];
  const historyCount = appointments.filter(a => a.status === 'Completed').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Greeting */}
      <div className="relative overflow-hidden bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-900/20">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              Chào mừng quay lại,<br />
              <span className="opacity-90">{user?.fullName || 'Bệnh nhân'}</span>
            </h1>
            <p className="text-blue-100 font-medium text-lg max-w-md">
              Hôm nay là một ngày tuyệt vời để chăm sóc sức khỏe của bạn. Bạn có {upcomingApp ? '1 lịch hẹn sắp tới.' : 'không có lịch hẹn nào.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
               <button 
                onClick={() => setIsBookingOpen(true)}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg active:scale-95"
               >
                 <Plus size={20} />
                 ĐẶT LỊCH KHÁM NGAY
               </button>
               <button className="bg-blue-500/30 text-white border border-white/10 backdrop-blur-md px-8 py-4 rounded-2xl font-black hover:bg-blue-500/50 transition-all">
                 XEM HỒ SƠ CỦA TÔI
               </button>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 h-72 bg-white/10 rounded-full border border-white/5 relative">
             <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center">
                <Activity size={80} className="text-blue-100 animate-pulse" />
             </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          icon={Calendar} 
          label="Lịch hẹn sắp tới" 
          value={appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending').length} 
          color="bg-orange-50 text-orange-600"
        />
        <StatCard 
          icon={FileText} 
          label="Hồ sơ bệnh lý" 
          value={historyCount} 
          color="bg-blue-50 text-blue-600"
        />
        <StatCard 
          icon={Stethoscope} 
          label="Bác sĩ đã khám" 
          value={new Set(appointments.map(a => a.doctorId)).size} 
          color="bg-purple-50 text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Appointments List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center px-2">
             <h3 className="text-2xl font-black text-gray-900 tracking-tight">Lịch hẹn của bạn</h3>
             <button className="text-sm font-bold text-blue-600 hover:underline">Xem tất cả</button>
          </div>
          
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="bg-white p-16 rounded-[3rem] border border-gray-100 text-center space-y-4 shadow-sm">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                    <Calendar size={32} />
                 </div>
                 <p className="text-gray-400 font-medium">Bạn chưa có lịch hẹn nào được ghi nhận.</p>
              </div>
            ) : (
              appointments.map((app) => (
                <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all flex items-center gap-6 group">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Calendar size={28} />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                           app.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                           app.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                           app.status === 'CheckedIn' ? 'bg-blue-50 text-blue-600' :
                           'bg-gray-50 text-gray-400'
                         }`}>
                           {app.status === 'Confirmed' ? 'Đã duyệt' : app.status === 'Pending' ? 'Chờ xét duyệt' : app.status}
                         </span>
                      </div>
                      <h4 className="text-lg font-black text-gray-900">Khám tổng quát với BS. {app.doctor?.fullName || 'N/A'}</h4>
                      <p className="text-sm font-medium text-gray-400 flex items-center gap-2 mt-1">
                         <Clock size={14} className="text-blue-600" />
                         {new Date(app.appointmentTime).toLocaleString('vi-VN')}
                      </p>
                   </div>
                   <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 font-black overflow-hidden border-2 border-white shadow-sm">
                        {app.doctor?.imageUrl ? (
                          <img 
                            src={app.doctor.imageUrl.startsWith('http') ? app.doctor.imageUrl : `${IMAGE_BASE_URL}${app.doctor.imageUrl}`} 
                            alt={app.doctor.fullName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          app.doctor?.fullName?.charAt(0) || 'D'
                        )}
                   </div>
                   <button className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all">
                      <ChevronRight size={20} />
                   </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           {/* Notifications/News Widget */}
           <div className="bg-gray-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-bold">Thông báo</h4>
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                    <Bell size={16} />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2 group cursor-pointer">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Hôm nay</p>
                    <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Kết quả xét nghiệm máu của bạn đã có.</p>
                  </div>
                  <div className="space-y-2 group cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2 ngày trước</p>
                    <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Nhắc nhở: Tái khám định kỳ vào tháng tới.</p>
                  </div>
                </div>
                
                <button className="w-full mt-10 py-4 bg-white/10 rounded-2xl text-[10px] font-black tracking-[0.2em] hover:bg-white/20 transition-all">
                   TẤT CẢ THÔNG BÁO
                </button>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
           </div>

           {/* Health Tips Card */}
           <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 text-blue-900 shadow-sm">
              <Activity className="text-blue-600 mb-6" size={32} />
              <h4 className="text-xl font-black leading-tight">Mẹo sức khỏe hàng tuần</h4>
              <p className="text-blue-800/70 font-medium text-sm mt-3 leading-relaxed">
                Uống đủ 2 lít nước mỗi ngày và duy trì thói quen đi bộ 30 phút sẽ giúp cải thiện hệ tim mạch đáng kể.
              </p>
              <button className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:gap-4 transition-all">
                 Tìm hiểu thêm <ArrowRight size={16} />
              </button>
           </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onComplete={fetchData}
      />
    </div>
  );
};

export default PatientHome;
