import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Filter, Search, Loader2, CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ExaminationModal from '../../components/doctor/ExaminationModal';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/Appointments');
      setAppointments(response.data.items || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleExamine = (app) => {
    // Map data to match ExaminationModal expectations
    const formattedApp = {
      id: app.id,
      patientName: app.patient?.fullName,
      patientId: `BN-${app.patient?.id.toString().padStart(4, '0')}`
    };
    setSelectedApp(formattedApp);
    setIsModalOpen(true);
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patient/${patientId}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'CheckedIn': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const filteredApps = filterStatus === 'All' 
    ? appointments 
    : appointments.filter(a => a.status === filterStatus);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Lịch hẹn của tôi</h2>
          <p className="text-gray-400 font-medium mt-1">Theo dõi và quản lý toàn bộ các lượt khám đã lên lịch.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
             {['All', 'Confirmed', 'CheckedIn', 'Completed'].map(status => (
               <button
                 key={status}
                 onClick={() => setFilterStatus(status)}
                 className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                   filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                 }`}
               >
                 {status === 'All' ? 'Tất cả' : status === 'Confirmed' ? 'Đã xác nhận' : status === 'CheckedIn' ? 'Chờ khám' : 'Hoàn thành'}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredApps.map((app) => (
          <div key={app.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex items-center gap-6 md:w-1/4">
               <div className="w-16 h-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-gray-400 font-black border border-gray-100">
                  <span className="text-[10px] uppercase">{new Date(app.appointmentTime).toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
                  <span className="text-xl text-gray-900">{new Date(app.appointmentTime).getDate()}</span>
               </div>
               <div>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-sm mb-1">
                    <Clock size={16} />
                    {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Thời lượng: 30p</p>
               </div>
            </div>

            <div className="flex-1 flex items-center gap-6 cursor-pointer" onClick={() => handleViewPatient(app.patient?.id)}>
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-600 text-sm overflow-hidden border-4 border-white shadow-sm ring-1 ring-blue-100">
                  {app.patient?.fullName?.charAt(0) || 'P'}
               </div>
               <div>
                  <h4 className="text-lg font-black text-gray-900">{app.patient?.fullName}</h4>
                  <p className="text-xs text-gray-400 font-medium">Lý do: Khám sức khỏe định kỳ</p>
               </div>
            </div>

            <div className="md:w-1/4 flex items-center justify-end gap-6">
               <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                  {app.status}
               </span>
               <button 
                onClick={() => handleExamine(app)}
                className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
               >
                 <Play size={18} fill="currentColor" />
               </button>
            </div>
          </div>
        ))}

        {filteredApps.length === 0 && (
          <div className="py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
             <CalendarIcon size={64} className="text-gray-200" />
             <p className="text-gray-400 font-bold">Không có lịch hẹn nào trong danh sách hiện tại.</p>
          </div>
        )}
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

// SVG PlayIcon replaced by Play from lucide-react in imports

export default DoctorAppointments;
