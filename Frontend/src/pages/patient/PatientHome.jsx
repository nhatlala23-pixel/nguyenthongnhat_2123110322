import React from 'react';
import Home from '../Home';

const PatientHome = () => {
  return (
    <div>
      <Home />
      <div className="container mx-auto p-8 bg-blue-50 rounded-2xl mt-8">
        <h2 className="text-xl font-bold text-blue-800">Cổng thông tin Bệnh nhân</h2>
        <p className="text-blue-600">Chào mừng bạn quay lại. Bạn có thể xem lịch hẹn và hồ sơ của mình tại đây.</p>
      </div>
    </div>
  );
};

export default PatientHome;
