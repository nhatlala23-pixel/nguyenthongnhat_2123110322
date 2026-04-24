import React from 'react';
import { Search, Bell, User, Phone } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, role } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-20">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-all">
            <span className="text-xl font-black">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Clinical</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Sanctuary</p>
          </div>
        </Link>

        {/* Links */}
        <ul className="hidden lg:flex items-center gap-8">
          <li>
            <NavLink to="/" className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              Trang chủ
            </NavLink>
          </li>
          <li><a href="#" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">Dịch vụ</a></li>
          <li><NavLink to="/doctors" className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Bác sĩ</NavLink></li>
          <li><NavLink to="/news" className={({isActive}) => `text-sm font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Tin tức</NavLink></li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="hidden md:flex relative group">
            <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 group-focus-within:text-blue-600 hover:text-blue-600">
              <Search size={16} />
            </button>
            <input 
              type="text" 
              placeholder="Tìm kiếm bác sĩ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all outline-none w-48 focus:w-64"
            />
          </form>

          <button className="hidden sm:flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm">
            <Phone size={14} />
            Khẩn cấp
          </button>

          <div className="h-6 w-[1px] bg-gray-200"></div>

          {isAuthenticated ? (
            <Link 
              to={role === 'Admin' ? '/admin/dashboard' : role === 'Doctor' ? '/doctor/dashboard' : '/patient/home'}
              className="flex items-center gap-3 p-1 pr-3 bg-gray-50 rounded-full hover:bg-blue-50 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:shadow-blue-200">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-gray-700">{user?.username}</span>
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-[13px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <User size={16} />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
