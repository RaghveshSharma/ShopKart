import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../services/wishlist.service";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter((item) => item._id !== productId));
    } catch (err) {
      alert("Failed to remove product from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#2A5A4A]/20 border-t-[#2A5A4A] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#3f4740] font-medium text-lg">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
          <h2 className="text-2xl font-serif font-bold text-[#1B3B30] mb-3">Something went wrong.</h2>
          <p className="text-[#3f4740] mb-8">{error}</p>
          <button 
            onClick={fetchWishlist}
            className="btn-primary inline-block"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
        <div className="glass-card p-16 text-center max-w-lg w-full relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#E3B8B2]/10 rounded-full blur-3xl -z-10"></div>
          <div className="w-24 h-24 bg-[#FDF9F1] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#2A5A4A]/10">
            <svg className="w-10 h-10 text-[#E3B8B2]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#1B3B30] mb-3">Your wishlist is empty</h2>
          <p className="text-[#3f4740] mb-8 font-medium">Save products you love and find them here later.</p>
          <Link 
            to="/products"
            className="btn-primary inline-flex"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 pt-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center relative py-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-[#E3B8B2]/10 blur-3xl -z-10 rounded-full"></div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-[#1B3B30] tracking-tight mb-2">
            My <span className="text-gradient">Wishlist</span>
          </h1>
          <p className="text-[#3f4740] font-medium">{wishlist.length} products saved</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((product) => (
            <div key={product._id} className="group bg-white rounded-[1.5rem] overflow-hidden border border-[#2A5A4A]/10 shadow-sm hover:shadow-[0_8px_30px_rgb(42,90,74,0.08)] transition-all duration-500 transform hover:-translate-y-1 flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#FDF9F1] flex-shrink-0 p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden relative shadow-inner">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="absolute top-6 left-6 bg-[#E3B8B2] px-3 py-1 rounded-full text-[10px] font-bold text-[#1B3B30] uppercase tracking-wider z-10 shadow-sm">
                  {product.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow bg-white">
                <h3 className="text-xl font-serif text-[#1B3B30] mb-2 line-clamp-1 group-hover:text-[#2A5A4A] transition-colors">{product.name}</h3>
                <p className="text-sm text-[#3f4740] mb-4 line-clamp-2 flex-grow">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2 pb-4">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#1B3B30]">₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/products/${product._id}`}
                    className="flex-1 bg-[#FDF9F1] hover:bg-[#E3B8B2]/30 text-[#2A5A4A] py-2.5 rounded-xl font-bold transition-colors border border-[#2A5A4A]/20 flex items-center justify-center text-sm"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-semibold transition-colors duration-300 text-center text-sm border border-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
