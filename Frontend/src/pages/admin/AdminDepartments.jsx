import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, Library, BookOpen, Clock } from 'lucide-react';
import api from '../../services/api';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/Departments');
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (editingDept) {
        await api.put(`/Departments/${editingDept.id}`, { ...formData, id: editingDept.id });
      } else {
        await api.post('/Departments', formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '' });
      setEditingDept(null);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoa này? Việc xóa khoa có thể ảnh hưởng đến các bác sĩ đang công tác.')) {
      try {
        await api.delete(`/Departments/${id}`);
        fetchDepartments();
      } catch (err) {
        alert('Không thể xóa khoa này. Có thể có bác sĩ đang thuộc khoa này.');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Khoa / Phòng ban</h2>
          <p className="text-sm text-gray-500 mt-1">Thiết lập cơ cấu tổ chức chuyên môn của bệnh viện.</p>
        </div>
        <button 
          onClick={() => { setEditingDept(null); setFormData({name:'', description:''}); setShowModal(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm Khoa mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-blue-600/5 transition-colors"></div>
            
            <div className="relative">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Library size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{dept.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-6 leading-relaxed">
                {dept.description || "Chưa có mô tả cho chuyên khoa này."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-gray-400">
                   <Clock size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Hoạt động</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(dept)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(dept.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
            <Library size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold">Chưa có khoa nào được tạo. Hãy bắt đầu thêm ngay!</p>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa Khoa */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Library size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{editingDept ? 'Cập nhật Khoa' : 'Thêm Khoa mới'}</h3>
                  <p className="text-sm text-gray-400 font-medium">Thông tin phòng ban chuyên môn.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border-l-4 border-red-500">{error}</div>}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Tên Khoa / Phòng ban</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><BookOpen size={18} /></span>
                    <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: Khoa Nội tổng quát" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mô tả nhiệm vụ</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium h-32 resize-none" placeholder="Nhập mô tả về chức năng, nhiệm vụ của khoa..." />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all active:scale-95"
                >Hủy bỏ</button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {editingDept ? 'Cập nhật ngay' : 'Thêm vào hệ thống'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
