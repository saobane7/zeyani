import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminProvider } from "@/hooks/useAdmin";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import Auth from "./pages/Auth";
import OrderHistory from "./pages/OrderHistory";
import SizeGuide from "./pages/SizeGuide";
import MentionsLegales from "./pages/MentionsLegales";
import Confidentialite from "./pages/Confidentialite";
import CGV from "./pages/CGV";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import NewProduct from "./pages/admin/NewProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/Orders";
import AdminSettings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AdminProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/produit/:slug" element={<Product />} />
                <Route path="/notre-histoire" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/mes-commandes" element={<OrderHistory />} />
                <Route path="/guide-des-tailles" element={<SizeGuide />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/confidentialite" element={<Confidentialite />} />
                <Route path="/cgv" element={<CGV />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/produits" element={<AdminProducts />} />
                <Route path="/admin/produits/nouveau" element={<NewProduct />} />
                <Route path="/admin/produits/:id" element={<EditProduct />} />
                <Route path="/admin/commandes" element={<AdminOrders />} />
                <Route path="/admin/parametres" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AdminProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
