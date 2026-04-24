import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Filter, Loader2, FileText, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ExaminationModal from '../../components/doctor/ExaminationModal';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/Appointments');
      // For demo/report purposes, we'll filter by date if the backend doesn't support it directly
      const allApps = response.data.items || [];
      setAppointments(allApps);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/Appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      console.error("Error updating status", err);
      alert("Không thể cập nhật trạng thái lịch hẹn.");
    }
  };

  const handleExamine = (app) => {
    const formattedApp = {
      id: app.id,
      patientName: app.patient?.fullName,
      patientId: `BN-${app.patient?.id.toString().padStart(4, '0')}`
    };
    setSelectedApp(formattedApp);
    setIsModalOpen(true);
  };

  const filteredApps = appointments.filter(app => {
    const appDate = new Date(app.appointmentTime).toISOString().split('T')[0];
    return appDate === selectedDate;
  });

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-widest">QUẢN LÝ BỆNH NHÂN KHÁM BỆNH</h2>
        <p className="text-gray-400 font-medium mt-2 italic">Danh sách bệnh nhân đăng ký khám theo ngày</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Date Filter Header */}
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center gap-6 bg-gray-50/30">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Chọn ngày khám</label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-blue-600">
                <CalendarIcon size={18} />
              </span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-11 pr-6 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-blue-500 transition-all outline-none font-bold text-sm shadow-sm"
              />
            </div>
          </div>
          
          <div className="md:ml-auto flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tổng số bệnh nhân</p>
                <p className="text-2xl font-black text-blue-600">{filteredApps.length}</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                <Filter size={20} />
             </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">STT</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">Thời gian</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">Họ và tên</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">Địa chỉ</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">Số điện thoại</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest border-r border-gray-800">Giới tính</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApps.map((app, index) => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="px-6 py-5 text-sm font-bold text-gray-500 border-r border-gray-50">{index + 1}</td>
                  <td className="px-6 py-5 border-r border-gray-50">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-sm">
                      <Clock size={14} />
                      {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 border-r border-gray-50">
                    <span className="text-sm font-black text-gray-900 uppercase">{app.patient?.fullName || "N/A"}</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-gray-500 border-r border-gray-50">
                    {app.patient?.address || "Cần Thơ"}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-700 border-r border-gray-50">
                    {app.patient?.phoneNumber || "09xxxxxxx"}
                  </td>
                  <td className="px-6 py-5 border-r border-gray-50">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      app.patient?.gender === 'Nam' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                    }`}>
                      {app.patient?.gender || "Nam"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'Confirmed')}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-amber-600 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Check size={12} />
                        Xác nhận
                      </button>
                      <button 
                        onClick={() => handleExamine(app)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase hover:bg-orange-600 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <FileText size={12} />
                        Tạo đơn thuốc
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app.id, 'Cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase hover:bg-red-700 transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <X size={12} />
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-300">
                      <CalendarIcon size={64} className="opacity-20" />
                      <p className="font-bold text-lg">Không có lịch hẹn nào trong ngày này.</p>
                      <button 
                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                        className="text-blue-600 font-bold text-sm hover:underline"
                      >
                        Quay lại hôm nay
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApp && (
        <ExaminationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          appointment={selectedApp}
          onComplete={fetchAppointments}
        />
      )}
    </div>
  );
};

export default DoctorAppointments;
