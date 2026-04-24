import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, Stethoscope, User, Lock, Mail, Activity, Image as ImageIcon, Camera, Award, CircleDollarSign, MapPin } from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../../services/api';

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    specialization: '',
    departmentId: '',
    position: '',
    introduction: '',
    biography: '',
    consultationPrice: '',
    clinicAddress: '',
    image: null
  });

  // Base URL cho ảnh (cùng domain với API nhưng bỏ /api)
  const imageBaseUrl = IMAGE_BASE_URL;

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/Doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/Departments');
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchDoctors(), fetchDepartments()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

   const handleEdit = (doc) => {
    setEditingDoctor(doc);
    setFormData({
      username: '******', // Không sửa username/password ở đây
      password: '******',
      fullName: doc.fullName,
      specialization: doc.specialization,
      departmentId: doc.departmentId || '',
      position: doc.position || '',
      introduction: doc.introduction || '',
      biography: doc.biography || '',
      consultationPrice: doc.consultationPrice || '',
      clinicAddress: doc.clinicAddress || '',
      image: null
    });
    setImagePreview(doc.imageUrl ? (doc.imageUrl.startsWith('http') ? doc.imageUrl : `${imageBaseUrl}${doc.imageUrl}`) : null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
     try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('specialization', formData.specialization);
      if (formData.departmentId) data.append('departmentId', formData.departmentId);
      if (formData.position) data.append('position', formData.position);
      if (formData.introduction) data.append('introduction', formData.introduction);
      if (formData.biography) data.append('biography', formData.biography);
      if (formData.consultationPrice) data.append('consultationPrice', formData.consultationPrice);
      if (formData.clinicAddress) data.append('clinicAddress', formData.clinicAddress);
      if (formData.image) data.append('image', formData.image);

      if (editingDoctor) {
        await api.put(`/Doctors/${editingDoctor.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        data.append('username', formData.username);
        data.append('password', formData.password);
        await api.post('/Doctors', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowModal(false);
      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error("Full Error Response:", err.response?.data);
      const serverMessage = err.response?.data?.message || err.response?.data?.title || 'Có lỗi xảy ra khi thêm bác sĩ.';
      const details = err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(', ') : '';
      setError(details ? `${serverMessage}: ${details}` : serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

    const resetForm = () => {
    setFormData({ 
      username: '', 
      password: '', 
      fullName: '', 
      specialization: '', 
      departmentId: '', 
      position: '',
      introduction: '',
      biography: '',
      consultationPrice: '',
      clinicAddress: '',
      image: null 
    });
    setEditingDoctor(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        await api.delete(`/Doctors/${id}`);
        fetchDoctors();
      } catch (err) {
        alert('Không thể xóa bác sĩ này.');
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
          <p className="text-sm text-gray-500 mt-1">Danh sách đội ngũ chuyên gia trong hệ thống.</p>
        </div>
        <button 
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm Bác sĩ mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Tìm kiếm bác sĩ..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent rounded-xl text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Họ và Tên</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Chuyên môn</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Khoa</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ngày tham gia</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {doctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 overflow-hidden shadow-sm flex items-center justify-center">
                        {doc.imageUrl ? (
                          <img 
                            src={doc.imageUrl.startsWith('http') ? doc.imageUrl : `${imageBaseUrl}${doc.imageUrl}`} 
                            alt={doc.fullName} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="font-bold text-blue-600 text-sm">{doc.fullName?.charAt(0)}</span>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{doc.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 font-medium">{doc.specialization}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      {doc.department?.name || 'Phòng khám'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date().toLocaleDateString('vi-VN')}
                  </td>
                   <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(doc)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      ><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Thêm Bác sĩ */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => !isSubmitting && setShowModal(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Stethoscope size={24} />
                </div>
                 <div>
                  <h3 className="text-xl font-bold text-gray-900">{editingDoctor ? 'Cập nhật thông tin Bác sĩ' : 'Thêm Bác sĩ mới'}</h3>
                  <p className="text-sm text-gray-400 font-medium">
                    {editingDoctor ? `Đang chỉnh sửa hồ sơ: ${editingDoctor.fullName}` : 'Tài khoản đăng nhập sẽ được tạo tự động.'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[75vh]">
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border-l-4 border-red-500">{error}</div>}
              
              {/* Image Upload Area */}
              <div className="flex flex-col items-center mb-8">
                 <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-300">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="mx-auto text-gray-300 mb-2" size={32} />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">Tải ảnh đại diện</p>
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg border-4 border-white cursor-pointer hover:bg-blue-700 transition-all active:scale-90">
                      <Camera size={18} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                 </div>
                 <p className="text-[10px] text-gray-400 font-medium mt-4">Nên sử dụng ảnh vuông, kích thước tối thiểu 400x400px</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Họ và Tên chuyên gia</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><User size={18} /></span>
                    <input name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: BS. Nguyễn Văn An" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center pr-1">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Khoa / Phòng ban</label>
                    {departments.length === 0 && (
                      <Link to="/admin/departments" className="text-[10px] font-bold text-blue-600 hover:underline">
                        + Thêm khoa mới
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Activity size={18} /></span>
                    <select 
                      name="departmentId" 
                      required 
                      value={formData.departmentId} 
                      onChange={handleInputChange} 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold cursor-pointer appearance-none"
                    >
                      {departments.length > 0 ? (
                        <>
                          <option value="">-- Chọn khoa công tác --</option>
                          {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </>
                      ) : (
                        <option value="">Chưa có khoa trong hệ thống</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Chức danh / Chuyên môn</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Activity size={18} /></span>
                    <input name="specialization" required value={formData.specialization} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: Thạc sĩ, Bác sĩ Nội trú" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Vị trí / Học hàm (e.g. PGS, TS)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Award size={18} /></span>
                    <input name="position" value={formData.position} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: PGS. TS" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Giá khám (VNĐ)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><CircleDollarSign size={18} /></span>
                    <input type="number" name="consultationPrice" value={formData.consultationPrice} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: 450000" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Địa chỉ phòng khám</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><MapPin size={18} /></span>
                    <input name="clinicAddress" value={formData.clinicAddress} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="VD: Số 123, Phường 4, TP. Hồ Chí Minh" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mô tả ngắn (Giới thiệu)</label>
                  <textarea name="introduction" value={formData.introduction} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium" rows="2" placeholder="VD: Một bác sĩ ưu tú với hơn 20 năm kinh nghiệm..."></textarea>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Tiểu sử chi tiết (Hỗ trợ HTML)</label>
                  <textarea name="biography" value={formData.biography} onChange={handleInputChange} className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium" rows="4" placeholder="VD: <b>Quá trình công tác:</b>..."></textarea>
                </div>

                 {!editingDoctor && (
                  <>
                    <div className="md:col-span-2 pt-4">
                       <div className="h-[1px] bg-gray-100 w-full mb-6"></div>
                       <p className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Thiết lập tài khoản đăng nhập</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Tên đăng nhập (Email)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Mail size={18} /></span>
                        <input name="username" required value={formData.username} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="doctor.an@hospital.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1">Mật khẩu ban đầu</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400"><Lock size={18} /></span>
                        <input type="password" name="password" required value={formData.password} onChange={handleInputChange} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-bold" placeholder="••••••••" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all transition-all active:scale-95"
                >Hủy bỏ</button>
                 <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {editingDoctor ? 'Lưu thay đổi' : 'Lưu hồ sơ chuyên gia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctors;
