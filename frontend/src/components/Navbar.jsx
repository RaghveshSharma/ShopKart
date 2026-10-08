import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems, isLoggedIn, clearCart } = useCart();

  const handleLogout = async () => {
    try {
      await api.post("/customers/logout");
      clearCart();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="fixed w-full z-50 top-4 px-4 sm:px-6 lg:px-8">
      <nav className="glass-panel rounded-full px-8 py-3 flex justify-between items-center max-w-7xl mx-auto shadow-md border border-[#DCA9A5]/30">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-[#235347]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
          <Link to={isLoggedIn ? "/home" : "/"} className="text-2xl font-serif font-black text-[#235347] tracking-tight uppercase">
            ShopKart
          </Link>
        </div>
        
        <div className="flex space-x-6 items-center">
          <Link to="/products" className="hidden md:block text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider">
            Shop
          </Link>
          
          {isLoggedIn && (
            <>
              <Link to="/wishlist" className="hidden md:block text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider">
                Wishlist
              </Link>
              <Link to="/orders" className="hidden md:block text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider">
                Orders
              </Link>
            </>
          )}
          
          <div className="w-px h-6 bg-[#2A5A4A]/20 hidden md:block mx-2"></div>
          
          <Link to="/cart" className="relative text-[#3f4740] hover:text-[#235347] transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {isLoggedIn && totalItems > 0 && (
              <span className="absolute 0 top-0 right-0 bg-[#235347] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider">
                Login
              </Link>
              <Link to="/register" className="text-sm font-semibold text-[#3f4740] hover:text-[#235347] transition-colors uppercase tracking-wider">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
