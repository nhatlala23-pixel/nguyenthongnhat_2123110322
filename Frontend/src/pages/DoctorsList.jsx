import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, Star, Calendar, ArrowRight, Heart } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api, { IMAGE_BASE_URL } from '../services/api';

const DoctorsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const imageBaseUrl = IMAGE_BASE_URL;

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (!initialSearch) return true;
    const term = initialSearch.toLowerCase();
    const nameMatch = doc.fullName?.toLowerCase().includes(term);
    const specMatch = doc.specialization?.toLowerCase().includes(term);
    const deptMatch = doc.department?.name?.toLowerCase().includes(term);
    return nameMatch || specMatch || deptMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-blue-600 text-white pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-6">Tìm kiếm Bác sĩ & Chuyên gia</h1>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ bác sĩ ưu tú, giàu kinh nghiệm luôn sẵn sàng đồng hành cùng sức khỏe của bạn.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-xl flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 pl-4">
              <Search className="text-blue-600" size={20} />
              <input 
                type="text" 
                placeholder="Tìm tên bác sĩ, chuyên khoa..." 
                className="bg-transparent border-none outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-700 transition-all">
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-6 py-16">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">
              {initialSearch ? `Kết quả tìm kiếm cho "${initialSearch}"` : 'Tất cả Bác sĩ'}
            </h2>
            <p className="text-gray-500 mt-2">Tìm thấy {filteredDoctors.length} bác sĩ</p>
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-gray-400 font-bold animate-pulse">Đang tải danh sách bác sĩ...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">Không tìm thấy bác sĩ nào phù hợp với yêu cầu của bạn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
                <Link to={`/doctor/${doc.id}`} className="relative h-64 overflow-hidden bg-gray-100 block">
                  <img 
                    src={doc.imageUrl ? (doc.imageUrl.startsWith('http') ? doc.imageUrl : `${imageBaseUrl}${doc.imageUrl}`) : "https://images.unsplash.com/photo-1559839734-2b71f153678e?q=80&w=1470&auto=format&fit=crop"} 
                    alt={doc.fullName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                    {doc.department?.name || "Chuyên gia"}
                  </div>
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:bg-white hover:text-red-500 transition-all">
                    <Heart size={16} />
                  </button>
                </Link>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Link to={`/doctor/${doc.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase">{doc.fullName}</h3>
                      </Link>
                      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">{doc.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
                      <Star size={12} fill="currentColor" />
                      <span className="text-[11px] font-black">4.9</span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-50 w-full mb-4"></div>

                  <Link to={`/doctor/${doc.id}`} className="w-full bg-blue-50 text-blue-600 rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group/btn">
                    <Calendar size={16} />
                    <span>Đặt lịch ngay</span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
