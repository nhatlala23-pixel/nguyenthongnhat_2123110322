import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Download, Plus, Clock, FileBarChart, Loader2, ArrowLeft, 
  Calendar, Stethoscope, ChevronRight, Activity, MessageSquare, MoreHorizontal
} from 'lucide-react';
import api from '../../services/api';
import ExaminationModal from '../../components/doctor/ExaminationModal';

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/MedicalRecords/patient/${id}`);
      setData(response.data);
    } catch (err) {
      console.error("Error fetching history", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;
  if (!data) return <div className="p-10 text-center text-gray-400 font-bold">Không tìm thấy hồ sơ bệnh nhân.</div>;

  const { patient, history, upcoming } = data;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
           <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:shadow-md transition-all">
             <ArrowLeft size={20} />
           </button>
           <div>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Hồ Sơ Bệnh Án</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 font-medium">Bệnh nhân:</span>
                <span className="text-blue-600 font-black">{patient.fullName}</span>
                <span className="mx-2 text-gray-200">|</span>
                <span className="text-gray-400 font-medium">ID: {patient.pId}</span>
              </div>
           </div>
        </div>

        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-500 font-black text-xs hover:shadow-md transition-all shadow-sm">
             <Download size={16} />
             XUẤT PDF
           </button>
           <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
             <Plus size={18} />
             CHỈ ĐỊNH MỚI
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Records Table */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                 <div className="flex items-center gap-3">
                    <Clock className="text-blue-600" size={24} />
                    <h3 className="text-2xl font-black text-gray-900">Lịch sử khám bệnh</h3>
                 </div>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all shadow-sm">Tất cả khoa</button>
                    <button className="px-4 py-2 bg-white border border-gray-100 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all shadow-sm">Năm 2024</button>
                 </div>
              </div>

              <div className="flex-1">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-gray-50/50">
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ngày khám</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bác sĩ phụ trách</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Chẩn đoán</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Đơn thuốc</th>
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Trạng thái</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                       {history.map((h) => (
                          <tr key={h.id} className="hover:bg-gray-50/30 transition-all group">
                             <td className="px-10 py-6">
                                <p className="text-sm font-black text-gray-900 leading-none">{new Date(h.recordDate).toLocaleDateString('vi-VN')}</p>
                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                  {new Date(h.recordDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </td>
                             <td className="px-6 py-6">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-[10px] ring-4 ring-white shadow-sm overflow-hidden border border-blue-200/50">
                                      {h.doctorName.split(' ').pop().charAt(0)}
                                   </div>
                                   <p className="text-sm font-bold text-gray-700">BS. {h.doctorName}</p>
                                </div>
                             </td>
                             <td className="px-6 py-6">
                                <p className="text-sm font-bold text-gray-600 max-w-[150px] truncate">{h.diagnosis}</p>
                             </td>
                             <td className="px-6 py-6 font-bold text-xs text-blue-600 group-hover:underline cursor-pointer flex items-center gap-2">
                                <FileText size={16} />
                                CS-RX-{h.id + 300}
                             </td>
                             <td className="px-10 py-6 text-right">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                   h.status === 'Hoàn thành' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                   {h.status}
                                </span>
                             </td>
                          </tr>
                       ))}
                       {history.length === 0 && (
                          <tr><td colSpan="5" className="p-20 text-center text-gray-400 font-bold">Chưa có lịch sử khám bệnh.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>

              <div className="p-10 border-t border-gray-50 flex items-center justify-between">
                 <p className="text-xs text-gray-400 font-medium">Hiển thị {history.length} trong tổng số {history.length} hồ sơ</p>
                 <div className="flex gap-2">
                    {[1, 2, 3].map(p => (
                      <button key={p} className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${p === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
                        {p}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-600 text-white rounded-[2rem] py-6 flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
           >
             <Stethoscope size={24} />
             BẮT ĐẦU PHIÊN KHÁM MỚI
           </button>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           {/* Upcoming Appointments Widget */}
           <div className="bg-blue-50/50 p-8 rounded-[3rem] border border-blue-100/50 flex flex-col space-y-8">
              <div className="flex items-center gap-3 px-2">
                 <Calendar className="text-blue-600" size={24} />
                 <h4 className="text-xl font-black text-gray-900">Lịch hẹn sắp tới</h4>
              </div>

              <div className="space-y-6">
                 {upcoming.map((app) => (
                    <div key={app.id} className="bg-white p-8 rounded-3xl border border-blue-100/50 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative">
                       <button className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-600 transition-all"><MoreHorizontal size={20} /></button>
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Hôm nay, {new Date(app.appointmentTime).getDate()}/{new Date(app.appointmentTime).getMonth() + 1}</p>
                       <h5 className="text-lg font-black text-gray-900 leading-tight mb-4">{app.service}</h5>
                       <div className="space-y-3">
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                             <Clock size={16} />
                             {new Date(app.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - 09:15
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-bold">
                             <Activity size={16} />
                             {app.room}
                          </div>
                       </div>
                       <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-black text-blue-600 text-[9px] border-2 border-white shadow-sm ring-1 ring-blue-50">
                            {app.doctorName.split(' ').pop().charAt(0)}
                          </div>
                          <p className="text-xs font-bold text-gray-900">BS. {app.doctorName}</p>
                       </div>
                    </div>
                 ))}
                 
                 <button className="w-full py-4 border-2 border-dashed border-blue-200 rounded-3xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-white hover:border-blue-500 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Đặt lịch hẹn mới
                 </button>
              </div>
           </div>

           {/* Clinical Notes Widget */}
           <div className="bg-blue-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-blue-200">
              <div className="flex items-center gap-3 mb-6">
                 <MessageSquare size={20} />
                 <h4 className="text-lg font-bold">Ghi chú lâm sàng</h4>
              </div>
              <p className="text-xs leading-relaxed text-blue-50/80 mb-8 italic">
                Bệnh nhân cần theo dõi chỉ số huyết áp thường xuyên vào buổi sáng. Hạn chế sử dụng thực phẩm chứa nhiều Natri.
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest text-white hover:underline flex items-center gap-2">
                 Thêm ghi chú mới <ChevronRight size={14} />
              </button>
           </div>
        </div>
      </div>

      {/* Examination Modal (Simplified for now, will link real appointments) */}
      {selectedAppointment && (
        <ExaminationModal 
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedAppointment(null); }}
          appointment={selectedAppointment}
          onComplete={fetchHistory}
        />
      )}
    </div>
  );
};

export default PatientHistory;
