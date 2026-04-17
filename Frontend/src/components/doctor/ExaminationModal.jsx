import React, { useState } from 'react';
import { X, Plus, Trash2, Loader2, Pill, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const ExaminationModal = ({ isOpen, onClose, appointment, onComplete }) => {
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptions, setPrescriptions] = useState([
    { medicationName: '', dosage: '', duration: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addMedication = () => {
    setPrescriptions([...prescriptions, { medicationName: '', dosage: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updateMedication = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const data = {
        appointmentId: appointment.id,
        symptoms,
        diagnosis,
        prescriptions: prescriptions.filter(p => p.medicationName)
      };

      await api.post('/MedicalRecords', data);
      onComplete();
      onClose();
    } catch (err) {
      setError(err.response?.data || "Đã xảy ra lỗi khi lưu kết quả khám.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-none">Khám bệnh & Kê đơn</h3>
              <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-widest">
                Bệnh nhân: {appointment.patientName} • ID: {appointment.patientId}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white hover:shadow-md text-gray-400 hover:text-gray-900 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-600 flex items-center gap-3">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Section 1: Clinical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Triệu chứng lâm sàng</label>
              <textarea 
                required
                rows="4"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Nhập các triệu chứng quan sát được..."
                className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
              ></textarea>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Chẩn đoán cuối cùng</label>
              <textarea 
                required
                rows="4"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Nhập chẩn đoán sau khi thăm khám..."
                className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium"
              ></textarea>
            </div>
          </div>

          {/* Section 2: Prescription Builder */}
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                 <Pill className="text-blue-600" size={20} />
                 <h4 className="text-lg font-black text-gray-900 tracking-tight">Kê đơn thuốc</h4>
              </div>
              <button 
                type="button" 
                onClick={addMedication}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-100 transition-all"
              >
                <Plus size={16} />
                THÊM THUỐC
              </button>
            </div>

            <div className="space-y-4">
              {prescriptions.map((p, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 p-6 bg-gray-50/50 border border-gray-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all group relative">
                   <div className="flex-1 space-y-2">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Tên thuốc</label>
                     <input 
                       placeholder="VD: Paracetamol 500mg"
                       value={p.medicationName}
                       onChange={(e) => updateMedication(idx, 'medicationName', e.target.value)}
                       className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:border-blue-500 outline-none text-sm font-bold"
                     />
                   </div>
                   <div className="md:w-1/4 space-y-2">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Liều dùng</label>
                     <input 
                       placeholder="Sáng: 1, Chiều: 1"
                       value={p.dosage}
                       onChange={(e) => updateMedication(idx, 'dosage', e.target.value)}
                       className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:border-blue-500 outline-none text-sm font-bold"
                     />
                   </div>
                   <div className="md:w-1/4 space-y-2">
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-1">Thời gian</label>
                     <input 
                       placeholder="Uống trong 5 ngày"
                       value={p.duration}
                       onChange={(e) => updateMedication(idx, 'duration', e.target.value)}
                       className="w-full px-5 py-3 bg-white border border-gray-100 rounded-xl focus:border-blue-500 outline-none text-sm font-bold"
                     />
                   </div>
                   {prescriptions.length > 1 && (
                     <button 
                       type="button" 
                       onClick={() => removeMedication(idx)}
                       className="absolute -right-3 -top-3 p-2 bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                     >
                       <Trash2 size={14} />
                     </button>
                   )}
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex justify-end items-center gap-4">
           <button 
            type="button"
            onClick={onClose}
            className="px-8 py-4 text-gray-400 font-bold hover:text-gray-600 transition-all"
           >
             Hủy bỏ
           </button>
           <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl flex items-center justify-center gap-2 font-black shadow-xl shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] h-14 min-w-[200px]"
           >
             {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Đang lưu hồ sơ...</span>
                </>
             ) : (
                <>
                  <CheckCircle size={20} />
                  <span>Hoàn thành khám bệnh</span>
                </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExaminationModal;
