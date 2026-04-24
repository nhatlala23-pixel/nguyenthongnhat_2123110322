import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Stethoscope, ChevronRight, CheckCircle2, Loader2, Clock, CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import api, { IMAGE_BASE_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ isOpen, onClose, onComplete, initialDocId, initialSlot, initialDate, price }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated, user: authUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    departmentId: '',
    doctorId: '',
    appointmentTime: '',
    reason: 'Khám tổng quát',
    patientName: '',
    phone: '',
    email: '',
    address: '',
    dob: '',
    gender: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Pre-fill from auth user
      if (isAuthenticated && authUser) {
        setFormData(prev => ({
          ...prev,
          patientName: authUser.fullName || authUser.username || prev.patientName,
          email: authUser.email || prev.email,
          phone: authUser.phoneNumber || prev.phone,
        }));
      }

      if (initialDocId && initialSlot && initialDate) {
        setFormData(prev => ({
          ...prev,
          doctorId: initialDocId,
          appointmentTime: `${initialDate}T${initialSlot.split(' - ')[0]}:00`,
        }));
        setStep(3);
      } else if (initialDocId) {
        setFormData(prev => ({ ...prev, doctorId: initialDocId }));
        setStep(3);
      } else {
        fetchDepartments();
      }
    }
  }, [isOpen, initialDocId, initialSlot, initialDate, isAuthenticated, authUser]);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/Departments');
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments", err);
    }
  };

  const fetchDoctors = async (deptId) => {
    setLoading(true);
    try {
      const res = await api.get('/Doctors');
      // Filter doctors by department if the backend doesn't support it directly
      const filtered = res.data.filter(d => 
        (d.departmentId === parseInt(deptId)) || 
        (d.DepartmentId === parseInt(deptId))
      );
      setDoctors(filtered);
    } catch (err) {
      console.error("Error fetching doctors", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSelect = (id) => {
    setFormData({ ...formData, departmentId: id, doctorId: '' });
    fetchDoctors(id);
    setStep(2);
  };

  const handleDoctorSelect = (id) => {
    setFormData({ ...formData, doctorId: id });
    setStep(3);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thực hiện đặt lịch khám bệnh!");
      navigate('/login');
      onClose();
      return;
    }
    setSubmitting(true);
    try {
      // 1. Tạo lịch hẹn (Backend tự động tạo Invoice kèm theo)
      const res = await api.post('/appointments', {
        doctorId: parseInt(formData.doctorId),
        appointmentTime: formData.appointmentTime,
        reason: formData.reason
      });

      console.log("Appointment Created Response:", res.data);

      // 2. Lưu invoiceId vào state và chuyển bước
      const { invoiceId, InvoiceId } = res.data;
      const actualInvoiceId = invoiceId || InvoiceId;

      if (!actualInvoiceId) {
        console.error("CRITICAL ERROR: No invoiceId received from backend!", res.data);
        alert("Lỗi hệ thống: Không nhận được thông tin hóa đơn. Vui lòng thử lại hoặc liên hệ hỗ trợ.");
        return;
      }

      setFormData(prev => ({ ...prev, invoiceId: actualInvoiceId }));
      setStep(4);
    } catch (err) {
      console.error("Booking error:", err);
      const errorMsg = err.response?.data?.message || "Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại.";
      const detail = err.response?.data?.detail ? `\nChi tiết: ${err.response.data.detail}` : "";
      alert(errorMsg + detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.invoiceId) {
      alert("Không tìm thấy thông tin hóa đơn. Vui lòng thử lại.");
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === 'cash') {
        // Nếu chọn tiền mặt, chỉ cần báo thành công
        setStep(5);
      } else {
        // Nếu chọn VNPay hoặc phương thức điện tử khác, gọi API VNPay
        const res = await api.post(`/payment/create/${formData.invoiceId}`);
        
        if (res.data.paymentUrl) {
          // Chuyển hướng sang trang thanh toán của Momo/VNPay
          window.location.href = res.data.paymentUrl;
        } else {
          throw new Error("Không lấy được link thanh toán");
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      if (err.response) {
        console.table(err.response.data);
      }
      const errorMsg = err.response?.data?.message || "Lỗi kết nối thanh toán. Vui lòng thử lại.";
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Đặt lịch khám bệnh</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Quy trình 5 bước đơn giản</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl text-gray-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 relative">
          <div 
            className="absolute h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        <div className="p-8 min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h4 className="text-lg font-bold text-gray-900">Chọn chuyên khoa</h4>
              <div className="grid grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleDeptSelect(dept.id)}
                    className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-lg hover:shadow-blue-900/5 transition-all text-left group"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{dept.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium line-clamp-1">{dept.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Quay lại</button>
                <h4 className="text-lg font-bold text-gray-900 ml-auto">Chọn bác sĩ</h4>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {doctors.length === 0 ? (
                    <p className="text-center text-gray-400 py-10 font-medium">Hiện chưa có bác sĩ cho chuyên khoa này.</p>
                  ) : (
                    doctors.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => handleDoctorSelect(doc.id)}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left"
                      >
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-black overflow-hidden border-2 border-white shadow-sm">
                          {doc.imageUrl ? (
                            <img 
                              src={doc.imageUrl.startsWith('http') ? doc.imageUrl : `${IMAGE_BASE_URL}${doc.imageUrl}`} 
                              alt={doc.fullName} 
                              className="w-full h-full object-cover" 
                            />
                          ) : doc.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">BS. {doc.fullName}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{doc.specialization}</p>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-gray-300" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-2">
                <button onClick={() => setStep(2)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Quay lại</button>
                <h4 className="text-lg font-bold text-gray-900 ml-auto">Chọn thời gian</h4>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 shrink-0">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Thời gian đã chọn</p>
                    {initialSlot ? (
                      <p className="text-sm font-bold text-gray-900 mt-0.5">
                        {formData.appointmentTime ? new Date(formData.appointmentTime).toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    ) : (
                      <input 
                        type="datetime-local" 
                        className="mt-1 w-full flex-1 bg-white border border-blue-200 rounded-lg p-2 text-sm font-bold text-gray-900 outline-none focus:border-blue-500 shadow-sm transition-all"
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({...formData, appointmentTime: e.target.value})}
                      />
                    )}
                    <p className="text-xs font-medium text-gray-500 mt-1">Miễn phí đặt lịch</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Họ và tên</label>
                    <input type="text" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all" placeholder="Nhập họ và tên..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Số điện thoại</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all" placeholder="Nhập số điện thoại..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Địa chỉ email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all" placeholder="VD: nguyenvan@gmail.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Địa chỉ liên lạc</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all" placeholder="Nhập địa chỉ..." />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lý do khám</label>
                    <input type="text" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-medium transition-all" placeholder="Triệu chứng, lý do khám..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Ngày sinh</label>
                    <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Giới tính</label>
                    <div className="relative">
                      <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full p-3.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold appearance-none transition-all cursor-pointer">
                        <option value="">Select...</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                      <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button
                  disabled={!formData.appointmentTime || submitting}
                  onClick={handleSubmit}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                  XÁC NHẬN ĐẶT LỊCH
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-2">
                <button onClick={() => setStep(3)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Quay lại bước trước</button>
                <h4 className="text-lg font-extrabold text-gray-900 ml-auto">Xác nhận lịch hẹn</h4>
              </div>

              {/* Tóm tắt thông tin lịch khám */}
              <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-xl shadow-blue-200">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Bác sĩ phụ trách</p>
                    <p className="text-sm font-bold">
                      {doctors.find(d => d.id === parseInt(formData.doctorId))?.fullName ? `BS. ${doctors.find(d => d.id === parseInt(formData.doctorId))?.fullName}` : 'Chưa chọn'}
                    </p>
                    <p className="text-[10px] text-blue-100 opacity-80 mt-1">
                      {departments.find(dept => dept.id === parseInt(formData.departmentId))?.name || 'Chuyên khoa'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Thời gian khám</p>
                    <p className="text-sm font-bold">
                      {formData.appointmentTime ? new Date(formData.appointmentTime).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }) : ''}
                    </p>
                    <p className="text-sm font-bold">
                      {formData.appointmentTime ? new Date(formData.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thông tin bệnh nhân */}
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bệnh nhân</p>
                    <p className="text-sm font-bold text-gray-900">{formData.patientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Liên hệ</p>
                    <p className="text-sm font-bold text-gray-900">{formData.phone}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-gray-500">Phí khám bệnh ban đầu</p>
                    <p className="text-sm font-bold text-gray-900">{(price || 450000).toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-900">Tổng cộng (Thanh toán tại quầy)</p>
                    <p className="text-xl font-black text-blue-600">{(price || 450000).toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                </div>
              </div>

              {/* Hướng dẫn thanh toán tại quầy */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shrink-0 shadow-sm">
                    <Banknote size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 mb-1">Hướng dẫn thanh toán</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                      Quý khách vui lòng mang theo CMND/CCCD và có mặt tại quầy tiếp đón **trước 15 phút** so với giờ hẹn để hoàn tất thủ tục và thanh toán phí khám.
                    </p>
                  </div>
                </div>
                
                <button
                  disabled={submitting}
                  onClick={handlePayment}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                  XÁC NHẬN ĐẶT LỊCH NGAY
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in duration-500">
               <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
                  <CheckCircle2 size={48} />
               </div>
               <div className="text-center">
                  <h4 className="text-2xl font-black text-gray-900">Đăng ký thành công!</h4>
                  <p className="text-gray-400 font-medium mt-2">Yêu cầu đặt lịch của bạn đã được gửi.</p>
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mt-1">Vui lòng chờ nhân viên y tế xét duyệt</p>
               </div>
               <div className="p-6 bg-gray-50 rounded-3xl w-full flex items-center gap-4">
                  <Clock className="text-blue-600" size={24} />
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Thời gian dự kiến</p>
                    <p className="text-sm font-black text-gray-900">{new Date(formData.appointmentTime).toLocaleString('vi-VN')}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
