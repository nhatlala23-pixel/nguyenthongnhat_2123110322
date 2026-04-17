import React, { useState, useEffect } from 'react';
import { Search, User, Filter, MoreHorizontal, FileText, Activity, Loader2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DoctorPatients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewPatient = (id) => {
    navigate(`/doctor/patient/${id}`);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/Patients');
        setPatients(response.data);
      } catch (err) {
        console.error("Error fetching patients", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Danh sách Bệnh nhân</h2>
          <p className="text-gray-400 font-medium mt-1">Quản lý định danh và lịch sử khám của bệnh nhân phối hợp.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm tên bệnh nhân..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold"
            />
          </div>
          
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-3 h-12 bg-gray-50 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
               <Filter size={18} />
               Bộ lọc
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bệnh nhân</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ID/Mã số</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Giới tính</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Số điện thoại</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-all group cursor-pointer" onClick={() => handleViewPatient(p.id)}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black shadow-sm border border-blue-100/50 group-hover:scale-110 transition-transform">
                        {p.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-black text-gray-900 leading-none">{p.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <span className="text-xs font-bold text-gray-400">BN-{p.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      p.gender === 'Nam' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
                    }`}>
                      {p.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-gray-600">
                    {p.phoneNumber}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleViewPatient(p.id); }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-100 hover:bg-blue-700"
                       >
                         <FileText size={14} />
                         XEM BỆNH ÁN
                       </button>
                       <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
                         <MoreHorizontal size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <User size={48} className="opacity-20" />
                      <p className="font-bold">Không tìm thấy bệnh nhân nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorPatients;
