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
import { CartProvider } from "./context/CartContext";

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-success/:id" element={<OrderDetails />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
