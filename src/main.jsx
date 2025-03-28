import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Product from './pages/Product';
import './App.css';
import Slug from './components/Carousel/Slug';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Logout from './pages/Logout';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import BlogSlug from './components/Blog/BlogSlug';
import Checkout from './components/Checkout/Checkout';
import { CartProvider } from './context/CartContext';
import Profile from './pages/Profile';
import { ThemeProvider } from './context/ThemeContext';
import Nursery from './pages/Nursery';
import Shipping from './pages/Shipping';
import OrderSummary from './pages/OrderSummary';
import Blog from './pages/Blog';
import ForgotPassword from './pages/ForgotPassword';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='nursery' element={<Nursery />} />
      <Route path='checkout' element={<Checkout />} />
      <Route path='shipping' element={<Shipping />} />
      <Route path='order-summary' element={<OrderSummary />} />
      <Route path='plants' element={<Product />} />
      <Route path="/plant/:slug" element={<Slug />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogSlug />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/logout" element={<Logout />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>
);
