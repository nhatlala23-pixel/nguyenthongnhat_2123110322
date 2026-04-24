import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Check, Loader2, Save, ChevronLeft, ChevronRight, Stethoscope, AlertCircle } from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../../services/api';

const AdminSchedules = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentSchedules, setCurrentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const timeSlots = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00",
    "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"
  ];

  const imageBaseUrl = IMAGE_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/Doctors');
        setDoctors(response.data);
        if (response.data.length > 0) setSelectedDoctor(response.data[0]);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSchedules();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchSchedules = async () => {
    try {
      const response = await api.get(`/Schedules/doctor/${selectedDoctor.id}?date=${selectedDate}`);
      setCurrentSchedules(response.data.map(s => s.timeSlot));
    } catch (err) {
      console.error("Error fetching schedules", err);
    }
  };

  const toggleSlot = (slot) => {
    setCurrentSchedules(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = async () => {
    if (!selectedDoctor) return;
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/Schedules/bulk', {
        doctorId: selectedDoctor.id,
        date: selectedDate,
        timeSlots: currentSchedules
      });
      setMessage({ type: 'success', text: 'Đã lưu kế hoạch khám bệnh thành công!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi lưu kế hoạch.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[calc(100vh-160px)] animate-in fade-in duration-500">
      {/* Sidebar: Doctor Selection */}
      <div className="w-80 border-r border-gray-100 bg-gray-50/30 flex flex-col">
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <Stethoscope className="text-blue-600" size={20} />
            Chọn Bác sĩ
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-1">Lập lịch cho từng chuyên gia.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${
                selectedDoctor?.id === doc.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                : 'bg-white hover:bg-white hover:shadow-md text-gray-600 border border-transparent hover:border-gray-100'
              }`}
            >
               <div className="w-10 h-10 rounded-full bg-white/20 border border-white/10 overflow-hidden flex-shrink-0">
                  {doc.imageUrl ? (
                    <img src={doc.imageUrl.startsWith('http') ? doc.imageUrl : `${imageBaseUrl}${doc.imageUrl}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold">{doc.fullName?.charAt(0)}</div>
                  )}
               </div>
               <div className="text-left min-w-0">
                  <p className="text-sm font-bold truncate">{doc.fullName}</p>
                  <p className={`text-[10px] uppercase font-black tracking-widest ${selectedDoctor?.id === doc.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    {doc.department?.name || 'Phòng khám'}
                  </p>
               </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Schedule Grid */}
      <div className="flex-1 flex flex-col p-10">
        {!selectedDoctor ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
             <Stethoscope size={64} className="opacity-20" />
             <p className="font-bold">Vui lòng chọn bác sĩ để bắt đầu lập lịch.</p>
          </div>
        ) : (
          <>
            {/* Header: Date Selection */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div>
                  <h2 className="text-2xl font-black text-gray-900">Thiết lập ca khám</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Calendar size={14} />
                    <span>Hệ thống áp dụng cho ngày cụ thể đã chọn bên dưới.</span>
                  </div>
               </div>

               <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Calendar size={18} /></div>
                  <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-11 pr-6 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-black text-gray-900 cursor-pointer shadow-sm group-hover:shadow-md"
                  />
               </div>
            </div>

            {/* Time Slot Grid */}
            <div className="flex-1">
               <div className="mb-8 p-6 bg-blue-50/50 rounded-3xl border border-blue-100/50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Danh sách khung giờ làm việc</h4>
                    <p className="text-xs text-gray-500 font-medium">Nhấn vào khung giờ để bật hoặc tắt ca khám của bác sĩ.</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {timeSlots.map(slot => {
                    const isActive = currentSchedules.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 ${
                          isActive
                          ? 'bg-white border-blue-600 shadow-xl shadow-blue-900/5'
                          : 'bg-gray-50/50 border-transparent hover:border-gray-200 text-gray-400'
                        }`}
                      >
                         <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isActive ? 'bg-blue-600 text-white scale-100' : 'bg-gray-200 text-transparent scale-0'
                         }`}>
                            <Check size={14} strokeWidth={4} />
                         </div>
                         <div className={`p-2.5 rounded-xl w-fit mb-4 transition-all ${
                            isActive ? 'bg-blue-50 text-blue-100' : 'bg-white text-gray-300'
                         }`}>
                            <Clock size={20} />
                         </div>
                         <p className={`text-sm font-black transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                           {slot}
                         </p>
                         <p className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-50">
                           {isActive ? 'Đang mở' : 'Nghỉ'}
                         </p>
                      </button>
                    );
                  })}
               </div>
            </div>

            {/* Status & Footer Actions */}
            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  {message.text && (
                    <div className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm font-bold animate-in slide-in-from-left-4 ${
                      message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                      {message.text}
                    </div>
                  )}
               </div>

               <div className="flex gap-4">
                  <button 
                    onClick={fetchSchedules}
                    className="px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all active:scale-95"
                  >
                    Hủy thay đổi
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-2xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Lưu kế hoạch khám
                  </button>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminSchedules;
