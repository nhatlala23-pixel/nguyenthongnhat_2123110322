import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, ArrowRight, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Base URL cho ảnh
  const imageBaseUrl = IMAGE_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/Doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-gray-400 font-bold animate-pulse">Đang tải danh sách chuyên gia...</p>
    </div>
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
            <ShieldCheck size={14} />
            Đội ngũ chuyên gia uy tín
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
            Đội ngũ bác sĩ ưu tú
          </h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            Những chuyên gia giàu kinh nghiệm luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành trình chăm sóc sức khỏe.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
               <p className="text-gray-400 font-bold italic">Chưa có dữ liệu bác sĩ. Hãy thêm bác sĩ ở trang Admin!</p>
            </div>
          ) : (
            doctors.map((doc) => (
              <div key={doc.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-3">
                {/* Image Area */}
                <Link to={`/doctor/${doc.id}`} className="relative h-80 overflow-hidden bg-gray-100 block">
                  <img 
                    src={doc.imageUrl ? (doc.imageUrl.startsWith('http') ? doc.imageUrl : `${imageBaseUrl}${doc.imageUrl}`) : "https://images.unsplash.com/photo-1559839734-2b71f153678e?q=80&w=1470&auto=format&fit=crop"} 
                    alt={doc.fullName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest shadow-lg border border-white/50">
                    Chuyên gia uy tín
                  </div>

                  {/* Favorite Icon */}
                  <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all border border-white/30">
                    <Heart size={20} />
                  </button>
                </Link>

                {/* Info Area */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link to={`/doctor/${doc.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{doc.fullName}</h3>
                      </Link>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2">{doc.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-lg">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold">4.9</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-50 w-full mb-6"></div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Kinh nghiệm</p>
                      <p className="text-sm font-bold text-gray-800">10+ năm</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Khoa</p>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">{doc.department?.name || "Chung"}</p>
                    </div>
                  </div>

                  <Link to={`/doctor/${doc.id}`} className="w-full bg-blue-600 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-bold text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all group/btn active:scale-[0.98]">
                    <Calendar size={18} />
                    <span>Xem thông tin & Đặt lịch</span>
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Link */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm font-medium">
            Bạn muốn tìm kiếm bác sĩ thuộc chuyên khoa khác? {' '}
            <Link to="/doctors" className="text-blue-600 font-bold hover:underline underline-offset-4">
              Xem toàn bộ danh sách bác sĩ
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
