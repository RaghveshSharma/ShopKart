import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/customers/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user or unauthorized", err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="relative rounded-[2rem] p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden bg-[#FDF9F1] border border-[#2A5A4A]/10 shadow-sm">
          {/* Botanical abstract shapes */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#E3B8B2] rounded-full mix-blend-multiply opacity-40 blur-2xl animate-blob"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#2A5A4A] rounded-full mix-blend-multiply opacity-10 blur-2xl animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 md:w-1/2 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-[#2A5A4A]/10 text-[#2A5A4A] text-xs font-bold uppercase tracking-widest mb-2">
              Welcome Back
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif text-[#1B3B30] leading-tight">
              Shop Beautifully.<br/>
              <span className="text-gradient">Live Effortlessly.</span>
            </h1>
            <p className="text-lg text-[#3f4740] font-medium max-w-md">
              Curated styles and quality you love, ready for {user.fullName.split(' ')[0]}.
            </p>
            <div className="pt-4">
              <button onClick={() => navigate('/products')} className="btn-primary">
                Shop Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative z-10 md:w-1/2 flex justify-center">
            <div className="relative h-64 w-64 md:h-80 md:w-80 rounded-[2rem] bg-gradient-to-tr from-[#2A5A4A] to-[#E3B8B2] p-1.5 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="h-full w-full rounded-[1.8rem] bg-[#FDF9F1] flex flex-col items-center justify-center overflow-hidden">
                <div className="text-7xl font-serif font-bold text-[#2A5A4A] mb-4">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-[#3f4740] font-medium text-lg">{user.fullName}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="glass-card p-10">
          <h3 className="text-3xl font-serif text-[#1B3B30] mb-8 border-b border-[#2A5A4A]/10 pb-4">
            Your Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FDF9F1] p-6 rounded-2xl border border-[#2A5A4A]/10 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#2A5A4A]/10 flex items-center justify-center mb-4 text-[#2A5A4A]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#3f4740] uppercase tracking-widest">Full Name</p>
              <p className="mt-2 text-xl font-serif text-[#1B3B30]">{user.fullName}</p>
            </div>
            
            <div className="bg-[#FDF9F1] p-6 rounded-2xl border border-[#2A5A4A]/10 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#E3B8B2]/30 flex items-center justify-center mb-4 text-[#2A5A4A]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#3f4740] uppercase tracking-widest">Email Address</p>
              <p className="mt-2 text-lg font-serif text-[#1B3B30] truncate" title={user.email}>{user.email}</p>
            </div>
            
            <div className="bg-[#FDF9F1] p-6 rounded-2xl border border-[#2A5A4A]/10 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-[#2A5A4A]/10 flex items-center justify-center mb-4 text-[#2A5A4A]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#3f4740] uppercase tracking-widest">Phone Number</p>
              <p className="mt-2 text-xl font-serif text-[#1B3B30]">{user.phone || "Not provided"}</p>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div onClick={() => navigate('/products')} className="glass-card p-8 cursor-pointer group flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-serif text-[#1B3B30] group-hover:text-[#2A5A4A] transition-colors">Start Shopping</h4>
              <p className="text-[#3f4740] mt-2">Explore our latest products</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FDF9F1] border border-[#2A5A4A]/20 flex items-center justify-center text-[#2A5A4A] group-hover:bg-[#2A5A4A] group-hover:text-[#FDF9F1] transition-all shadow-sm">
              &rarr;
            </div>
          </div>
          <div onClick={() => navigate('/orders')} className="glass-card p-8 cursor-pointer group flex items-center justify-between">
            <div>
              <h4 className="text-2xl font-serif text-[#1B3B30] group-hover:text-[#2A5A4A] transition-colors">My Orders</h4>
              <p className="text-[#3f4740] mt-2">Track your recent purchases</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FDF9F1] border border-[#2A5A4A]/20 flex items-center justify-center text-[#2A5A4A] group-hover:bg-[#2A5A4A] group-hover:text-[#FDF9F1] transition-all shadow-sm">
              &rarr;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
