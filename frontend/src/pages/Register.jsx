import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/customers/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 relative pt-24">
      <div className="max-w-md w-full mx-auto bg-[#FDF9F1] rounded-[2rem] shadow-sm border border-[#2A5A4A]/10 p-10 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E3B8B2] rounded-bl-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2A5A4A] rounded-tr-full blur-3xl opacity-10"></div>
        
        <div className="relative z-10">
          <h2 className="text-center text-4xl font-serif font-black text-[#1B3B30] tracking-tight">
            Create <span className="italic">Account</span>
          </h2>
          <p className="mt-3 text-center text-sm text-[#3f4740] font-medium">
            Join ShopKart today and start shopping!
          </p>
        </div>
        
        {error && (
          <div className="relative z-10 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        <form className="relative z-10 mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-[#3f4740] uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="appearance-none block w-full px-5 py-3.5 bg-white border border-[#2A5A4A]/10 rounded-xl text-[#1B3B30] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A5A4A] focus:border-transparent shadow-sm transition-all"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#3f4740] uppercase tracking-wider mb-2 ml-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-5 py-3.5 bg-white border border-[#2A5A4A]/10 rounded-xl text-[#1B3B30] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A5A4A] focus:border-transparent shadow-sm transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-[#3f4740] uppercase tracking-wider mb-2 ml-1">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="appearance-none block w-full px-5 py-3.5 bg-white border border-[#2A5A4A]/10 rounded-xl text-[#1B3B30] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A5A4A] focus:border-transparent shadow-sm transition-all"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#3f4740] uppercase tracking-wider mb-2 ml-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-5 py-3.5 bg-white border border-[#2A5A4A]/10 rounded-xl text-[#1B3B30] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A5A4A] focus:border-transparent shadow-sm transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3.5 px-4 font-bold rounded-xl text-[#FDF9F1] ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2A5A4A] hover:bg-[#1B3B30] shadow-md hover:shadow-lg'} transition-all duration-300`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
        
        <p className="relative z-10 text-center text-sm text-[#3f4740] mt-8 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#2A5A4A] hover:text-[#1B3B30] transition-colors underline decoration-2 underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
