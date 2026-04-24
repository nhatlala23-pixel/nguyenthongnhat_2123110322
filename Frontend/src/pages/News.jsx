import React from 'react';
import Navbar from '../components/layout/Navbar';
import { Calendar, User, ArrowRight, Tag, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const News = () => {
  const newsList = [
    {
      id: 1,
      title: "Cách duy trì sức khỏe tim mạch trong mùa hè nắng nóng",
      excerpt: "Nhiệt độ cao có thể gây áp lực lên hệ tim mạch. Hãy cùng chuyên gia tìm hiểu cách bảo vệ trái tim của bạn...",
      category: "Sức khỏe",
      author: "BS. Nguyễn Văn A",
      date: "2024-04-20",
      readTime: "5 phút",
      image: "https://images.unsplash.com/photo-1505751172107-573225a9627e?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Tầm quan trọng của việc kiểm tra sức khỏe định kỳ",
      excerpt: "Phòng bệnh hơn chữa bệnh. Việc tầm soát định kỳ giúp phát hiện sớm các nguy cơ tiềm ẩn và điều trị kịp thời...",
      category: "Y học",
      author: "BS. Trần Thị B",
      date: "2024-04-18",
      readTime: "8 phút",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Chế độ dinh dưỡng vàng cho người cao tuổi",
      excerpt: "Dinh dưỡng đóng vai trò then chốt trong việc duy trì sức bền và minh mẫn cho người lớn tuổi. Những thực phẩm nào nên ưu tiên?",
      category: "Dinh dưỡng",
      author: "Chuyên gia Dinh dưỡng C",
      date: "2024-04-15",
      readTime: "6 phút",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Công nghệ AI trong chẩn đoán hình ảnh y khoa",
      excerpt: "Trí tuệ nhân tạo đang thay đổi bộ mặt của ngành y tế, đặc biệt là trong việc phân tích phim X-quang và MRI...",
      category: "Công nghệ",
      author: "Kỹ sư D",
      date: "2024-04-12",
      readTime: "10 phút",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: 5,
      title: "Lợi ích của việc tập Yoga mỗi sáng",
      excerpt: "Chỉ với 15-20 phút Yoga buổi sáng, bạn sẽ cảm thấy tràn đầy năng lượng và giảm bớt căng thẳng trong công việc...",
      category: "Lối sống",
      author: "HLV E",
      date: "2024-04-10",
      readTime: "4 phút",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1420&auto=format&fit=crop"
    },
    {
      id: 6,
      title: "Làm thế nào để cải thiện giấc ngủ sâu?",
      excerpt: "Giấc ngủ là thời gian để cơ thể tái tạo. Nếu bạn thường xuyên trằn trọc, hãy thử áp dụng những phương pháp sau...",
      category: "Sức khỏe",
      author: "BS. F",
      date: "2024-04-05",
      readTime: "7 phút",
      image: "https://images.unsplash.com/photo-1511295742364-911914ada66c?q=80&w=1384&auto=format&fit=crop"
    }
  ];

  const featuredNews = newsList[0];
  const otherNews = newsList.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-20 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
              <Tag size={14} />
              Cập nhật mới nhất
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-8">
              Tin tức & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Kiến thức y khoa</span>
            </h1>
            <p className="text-gray-500 text-lg font-medium max-w-2xl">
              Cập nhật những thông tin mới nhất về y tế, sức khỏe và các kiến thức khoa học hữu ích từ đội ngũ chuyên gia của Clinical Sanctuary.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        
        {/* Featured Post */}
        <div className="mb-20">
          <Link to={`/news/${featuredNews.id}`} className="group relative block bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="h-[400px] lg:h-auto overflow-hidden">
                <img 
                  src={featuredNews.image} 
                  alt={featuredNews.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-8 lg:p-16 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                    {featuredNews.category}
                  </span>
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-bold">
                    <Calendar size={14} />
                    {featuredNews.date}
                  </div>
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 group-hover:text-blue-600 transition-colors">
                  {featuredNews.title}
                </h2>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed text-lg">
                  {featuredNews.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                      {featuredNews.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{featuredNews.author}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{featuredNews.readTime} đọc</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {["Tất cả", "Sức khỏe", "Y học", "Dinh dưỡng", "Công nghệ", "Lối sống"].map((cat, idx) => (
            <button 
              key={idx}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${idx === 0 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200 hover:text-blue-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {otherNews.map((item) => (
            <Link key={item.id} to={`/news/${item.id}`} className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col">
              <div className="relative h-60 overflow-hidden bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Calendar size={12} />
                  {item.date}
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <Clock size={12} />
                  {item.readTime}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium mb-6 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                        {item.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-gray-700">{item.author}</span>
                   </div>
                   <div className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     Xem thêm <ChevronRight size={14} />
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Mock */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            1
          </button>
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            2
          </button>
          <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            3
          </button>
          <div className="w-12 h-12 flex items-center justify-center text-gray-300">...</div>
          <button className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </main>

      {/* Footer Newsletter Section */}
      <section className="bg-blue-600 py-20 mt-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-black mb-6">Đăng ký nhận bản tin sức khỏe</h2>
            <p className="text-blue-100 mb-10 text-lg font-medium">Đừng bỏ lỡ những thông tin quan trọng về sức khỏe và các chương trình ưu đãi mới nhất từ chúng tôi.</p>
            <div className="max-w-md mx-auto flex gap-4">
              <input 
                type="email" 
                placeholder="Email của bạn..." 
                className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-blue-200 outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl">
                ĐĂNG KÝ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
