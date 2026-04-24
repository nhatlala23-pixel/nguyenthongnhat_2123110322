import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Stethoscope, 
  ChevronRight, 
  Loader2, 
  Heart, 
  Share2, 
  Star,
  ShieldCheck,
  Activity,
  Award,
  CircleDollarSign,
  GraduationCap
} from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../services/api';
import Navbar from '../components/layout/Navbar';
import BookingModal from '../components/patient/BookingModal';

const DoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const timeSlots = [
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00",
    "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00", "20:00 - 21:00"
  ];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(`/Doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        console.error("Error fetching doctor", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get(`/Schedules/doctor/${id}?date=${selectedDate}`);
        setAvailableSlots(response.data.map(s => s.timeSlot));
      } catch (err) {
        console.error("Error fetching schedules", err);
      }
    };
    if (doctor) fetchSchedules();
  }, [id, selectedDate, doctor]);

  const handleBooking = (slot) => {
    setSelectedSlot(slot);
    setBookingOpen(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );

  if (!doctor) return <div className="text-center py-20 font-bold">Không tìm thấy thông tin bác sĩ.</div>;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-gray-50/50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <ChevronRight size={12} />
            <span className="text-gray-900">{doctor.fullName}</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Doctor Info & Biography */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Doctor Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group shrink-0">
                <div className="w-48 h-48 rounded-[2.5rem] bg-blue-50 overflow-hidden border-4 border-white shadow-2xl shadow-blue-900/10 transition-transform group-hover:scale-[1.02] duration-500">
                  <img 
                    src={doctor.imageUrl ? (doctor.imageUrl.startsWith('http') ? doctor.imageUrl : `${IMAGE_BASE_URL}${doctor.imageUrl}`) : "https://images.unsplash.com/photo-1559839734-2b71f153678e?auto=format&fit=crop&w=400"} 
                    alt={doctor.fullName} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all border border-gray-100">
                  <Heart size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-4 pt-4">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit border border-blue-100">
                  <ShieldCheck size={14} />
                  Chuyên gia ưu tú
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                  {doctor.position || 'Bác sĩ'} {doctor.fullName}
                </h1>
                <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-2xl">
                  {doctor.introduction || `Chuyên khoa ${doctor.specialization} tại ${doctor.department?.name || 'phòng khám'}. Với nhiều năm kinh nghiệm và sự tận tâm trong công việc.`}
                </p>
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="text-sm font-bold text-gray-900">4.9</span>
                    <span className="text-xs font-bold text-gray-400 ml-1">(120 đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Activity size={18} />
                    <span className="text-sm font-bold">{doctor.specialization}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            <div className="space-y-8 pt-12 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tiểu sử & Kinh nghiệm</h2>
              </div>
              
              <div className="prose prose-blue max-w-none">
                {doctor.biography ? (
                  <div className="text-gray-600 leading-relaxed space-y-4" dangerouslySetInnerHTML={{ __html: doctor.biography }}></div>
                ) : (
                  <p className="text-gray-500 italic font-medium">Bác sĩ chưa cập nhật thông tin tiểu sử chi tiết.</p>
                )}
              </div>

              {/* Awards/Education Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <GraduationCap size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase">Đào tạo</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-gray-600 flex gap-2">
                      <ChevronRight size={14} className="text-blue-600 mt-1 shrink-0" />
                      Tốt nghiệp Đại học Y Hà Nội
                    </li>
                    <li className="text-sm font-medium text-gray-600 flex gap-2">
                      <ChevronRight size={14} className="text-blue-600 mt-1 shrink-0" />
                      Thạc sĩ chuyên ngành {doctor.specialization}
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <Stethoscope size={20} />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase">Công tác</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-gray-600 flex gap-2">
                      <ChevronRight size={14} className="text-blue-600 mt-1 shrink-0" />
                      Bệnh viện Đa khoa Quốc tế
                    </li>
                    <li className="text-sm font-medium text-gray-600 flex gap-2">
                      <ChevronRight size={14} className="text-blue-600 mt-1 shrink-0" />
                      Giảng viên thỉnh giảng tại Học viện Y Dược
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scheduling & Pricing */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Scheduling Card */}
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-blue-900/5 p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={20} />
                  Lịch khám bệnh
                </h3>

                {/* Date Selector */}
                <div className="relative mb-8">
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-4 pr-10 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-sm appearance-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(i => {
                      const d = new Date();
                      d.setDate(d.getDate() + i);
                      const iso = d.toISOString().split('T')[0];
                      const label = i === 0 ? 'Hôm nay' : d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' });
                      return <option key={iso} value={iso}>{label} - {iso}</option>;
                    })}
                  </select>
                  <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                </div>

                {/* Time Slots */}
                <div className="space-y-4">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Chọn khung giờ khám</p>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map(slot => {
                        const isAvailable = availableSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            disabled={!isAvailable}
                            onClick={() => handleBooking(slot)}
                            className={`group relative py-3.5 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                              isAvailable
                              ? 'bg-white border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-white shadow-md active:scale-95 cursor-pointer'
                              : 'bg-gray-50/50 border-transparent text-gray-300 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className={isAvailable ? (isAvailable ? "text-yellow-500 group-hover:text-white" : "text-gray-300") : "text-gray-300"} />
                              <span className="text-xs font-bold">{slot}</span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                              {isAvailable ? 'Chọn khám' : 'Nghỉ'}
                            </span>
                          </button>
                        );
                      })}
                   </div>
                   <p className="text-[10px] text-gray-400 font-medium text-center mt-4">
                     Chọn và đặt lịch (Miễn phí đặt qua web)
                   </p>
                </div>
              </div>

              {/* Clinic Info Card */}
              <div className="bg-gray-50/50 rounded-[2.5rem] border border-gray-100 p-8 space-y-6">
                 <div>
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Địa chỉ khám</h4>
                    <div className="flex gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">Phòng khám Hospital Sanctuary</p>
                          <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                            {doctor.clinicAddress || 'Số 123, Đường Y Học, Phường 4, TP. Hồ Chí Minh'}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Giá khám tham khảo</h4>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-green-600">
                          <CircleDollarSign size={20} />
                          <span className="text-lg font-bold">{doctor.consultationPrice ? doctor.consultationPrice.toLocaleString('vi-VN') : '450.000'} VNĐ</span>
                       </div>
                       <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Xem chi tiết</button>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Chia sẻ thông tin
                 </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BookingModal 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        onComplete={() => {}}
        initialDocId={doctor.id}
        initialSlot={selectedSlot}
        initialDate={selectedDate}
        price={doctor.consultationPrice}
      />
    </div>
  );
};

export default DoctorDetail;
