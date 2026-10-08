import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toggleWishlist } from "../services/wishlist.service";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product, isInitiallySaved = false }) => {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const cartItem = cartItems.find(item => item.product._id === product._id);

  useEffect(() => {
    setIsSaved(isInitiallySaved);
  }, [isInitiallySaved]);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      setErrorMsg("");
      const res = await toggleWishlist(product._id);
      setIsSaved(res.saved);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      setErrorMsg(err.message || "Failed to save");
      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="group bg-white rounded-[1.5rem] overflow-hidden flex flex-col h-full relative border border-[#2A5A4A]/10 shadow-sm hover:shadow-[0_8px_30px_rgb(42,90,74,0.08)] transition-all duration-500 transform hover:-translate-y-1">
      
      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        disabled={isSaving}
        className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-[#2A5A4A] shadow-sm hover:bg-[#FDF9F1] hover:scale-105 transition-all border border-[#2A5A4A]/10"
      >
        {isSaving ? (
          <span className="text-xs">⏳</span>
        ) : isSaved ? (
          <svg className="w-5 h-5 text-[#E3B8B2]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        )}
      </button>

      {/* Image Container */}
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

      {/* Content Container */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <h3 className="text-xl font-serif text-[#1B3B30] mb-2 line-clamp-1 group-hover:text-[#2A5A4A] transition-colors">{product.name}</h3>
        <p className="text-sm text-[#3f4740] mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        {errorMsg && <p className="text-xs text-red-500 mb-2 font-semibold bg-red-50 p-2 rounded-lg">{errorMsg}</p>}

        <div className="flex items-center justify-between mt-auto pt-2 pb-4">
          <div>
            <span className="text-2xl font-serif font-bold text-[#1B3B30]">₹{product.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="text-right">
            {product.stock > 0 ? (
              <span className="text-xs font-medium text-[#2A5A4A] bg-[#2A5A4A]/10 px-2.5 py-1 rounded-md">
                {product.stock} left
              </span>
            ) : (
              <span className="text-xs font-medium text-red-700 bg-red-100/80 px-2.5 py-1 rounded-md">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={async () => {
              setIsAdding(true);
              const res = await addToCart(product._id);
              if (!res.success) {
                if (res.message === 'unauthorized') {
                  navigate("/login");
                } else {
                  setErrorMsg(res.message);
                  setTimeout(() => setErrorMsg(""), 3000);
                }
              }
              setIsAdding(false);
            }}
            disabled={isAdding || product.stock === 0 || (cartItem && cartItem.quantity >= product.stock)}
            className="flex-1 bg-[#2A5A4A] text-white py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md disabled:bg-gray-300 transform hover:-translate-y-0.5 transition-all text-sm flex items-center justify-center gap-1.5"
          >
            {isAdding ? "Adding..." : (cartItem ? "Add Another" : "Add to Cart")}
          </button>
          
          <Link
            to={`/products/${product._id}`}
            className="w-12 bg-[#FDF9F1] hover:bg-[#E3B8B2]/30 text-[#2A5A4A] py-2.5 rounded-xl font-bold transition-colors border border-[#2A5A4A]/20 flex items-center justify-center"
            title="View Details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
