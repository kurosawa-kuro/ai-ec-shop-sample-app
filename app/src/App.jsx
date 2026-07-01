import { MotionConfig } from 'motion/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FlyingCartItem from './components/FlyingCartItem'
import Header from './components/Header'
import Footer from './components/Footer'
import Top from './pages/Top'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Concierge from './pages/Concierge'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Complete from './pages/Complete'
import Orders from './pages/Orders'
import AdminDemo from './pages/AdminDemo'
import About from './pages/About'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Top />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/concierge" element={<Concierge />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin-demo" element={<AdminDemo />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        <FlyingCartItem />
      </BrowserRouter>
    </MotionConfig>
  )
}
