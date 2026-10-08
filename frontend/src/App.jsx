import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import { CartProvider, useCart } from "./context/CartContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCart();
  
  if (loading) return null; // Or a loading spinner
  
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCart();
  
  if (loading) return null;
  
  return !isLoggedIn ? children : <Navigate to="/home" replace />;
};

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="font-sans antialiased text-gray-900 min-h-screen flex flex-col relative overflow-hidden">
          {/* Subtle botanical background decoration */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#2A5A4A]/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob pointer-events-none"></div>
          <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#E3B8B2]/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 pointer-events-none"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-[#2A5A4A]/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 pointer-events-none"></div>
          
          <Navbar />
          <main className="flex-grow pt-28 px-4 sm:px-6 lg:px-8 relative z-10">
            <Routes>
              {/* Public Routes - Only accessible when NOT logged in */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              
              {/* Semi-Public Routes - Accessible to anyone */}
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              
              {/* Protected Routes - Only accessible when logged in */}
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
