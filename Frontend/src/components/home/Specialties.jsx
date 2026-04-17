import React, { useState, useEffect } from 'react';
import { Heart, Brain, Baby, Activity, Eye, Shield, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../../services/api';

const iconMap = {
  'Tim mạch': <Heart size={28} />,
  'Thần kinh': <Brain size={28} />,
  'Nhi khoa': <Baby size={28} />,
  'Chấn thương': <Activity size={28} />,
  'Nhãn khoa': <Eye size={28} />,
  'Da liễu': <Shield size={28} />,
};

const Specialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await api.get('/Departments');
        setSpecialties(response.data);
      } catch (err) {
        console.error("Error fetching specialties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  if (loading) return null; // Tránh hiện loading 2 lần với Doctors

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">
              Chuyên khoa nổi bật
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              Tiếp cận dịch vụ y tế chuyên sâu với đội ngũ chuyên gia hàng đầu. 
              Chúng tôi cung cấp giải pháp chăm sóc sức khỏe toàn diện cho từng cá nhân.
            </p>
          </div>
          <a href="#" className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest hover:underline group">
            Xem tất cả chuyên khoa
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-400 italic">
              Chưa có dữ liệu chuyên khoa.
            </div>
          ) : (
            specialties.map((item, index) => (
              <div 
                key={index} 
                className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500 bg-blue-50 text-blue-600">
                  {iconMap[item.name] || <Activity size={28} />}
                </div>

                {/* Text */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {item.description || "Chúng tôi cung cấp dịch vụ chăm sóc chuyên sâu và tận tâm cho chuyên khoa này."}
                </p>

                {/* Bottom Decoration */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">
                  Tìm hiểu thêm
                  <ChevronRight size={14} />
                </div>

                {/* Absolute Decoration */}
                <div className="absolute -right-4 -bottom-4 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform rotate-12 scale-150">
                   {iconMap[item.name] || <Activity size={28} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const ChevronRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Specialties;
