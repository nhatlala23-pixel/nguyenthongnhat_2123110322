import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Search, Clock, Check, X, Loader2, Filter, User, Stethoscope } from 'lucide-react';
import api from '../../services/api';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [isUpdating, setIsUpdating] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/Appointments');
      // Cấu trúc dữ liệu có thể khác tùy thuộc vào PaginatedList, 
      // Ở đây giả định backend trả về danh sách trong .items hoặc trực tiếp mảng
      const data = response.data.items || response.data;
      setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setIsUpdating(id);
    try {
      await api.put(`/Appointments/${id}`, { status: newStatus });
    } catch (err) {
      alert('Không thể cập nhật trạng thái.');
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Lịch hẹn</h2>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và điều phối lịch khám bệnh.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === status 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {status === 'All' ? 'Tất cả' : status === 'Pending' ? 'Đang chờ' : status === 'Confirmed' ? 'Đã duyệt' : 'Đã hủy'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên bệnh nhân, bác sĩ..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thông tin khám</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bác sĩ phụ trách</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 text-sm italic">Không tìm thấy lịch hẹn nào.</td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{app.patient?.fullName || 'N/A'}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Khám tổng quát</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-700">{new Date(app.appointmentTime).toLocaleDateString('vi-VN')}</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={14} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">BS. {app.doctor?.fullName || 'Chưa gán'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isUpdating === app.id ? (
                        <Loader2 className="animate-spin text-blue-600 inline-block" size={18} />
                      ) : (
                        <div className="flex justify-end gap-2">
                          {app.status === 'Pending' && (
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'Confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" 
                              title="Xác nhận"
                            >
                              <Check size={18} />
                            </button>
                          )}
                          {app.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'Cancelled')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Hủy lịch"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    'Confirmed': 'bg-green-50 text-green-600 border-green-100',
    'Pending': 'bg-orange-50 text-orange-600 border-orange-100',
    'Cancelled': 'bg-red-50 text-red-600 border-red-100',
    'CheckedIn': 'bg-blue-50 text-blue-600 border-blue-100',
    'Completed': 'bg-gray-50 text-gray-600 border-gray-100',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${styles[status] || styles['Pending']}`}>
      {status === 'Confirmed' ? 'Đã duyệt' : status === 'Pending' ? 'Đang chờ' : status === 'Cancelled' ? 'Đã hủy' : status}
    </span>
  );
};

export default AdminAppointments;
