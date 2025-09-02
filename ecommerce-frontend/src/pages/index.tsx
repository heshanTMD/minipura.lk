import React from 'react'
import ProductList from '../components/product/ProductList'
import Navbar from '../components/common/Navbar'
import Footer from '../components/footer/Footer'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f4f4f5]">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-2 text-[#18181b]">Welcome to Our E-commerce Store</h1>
          <p className="text-lg text-[#71717a] mb-6">
            Discover the best products at unbeatable prices. Fast shipping and secure checkout!
          </p>
          <a
            href="#products"
            className="inline-block bg-[#18181b] text-white px-6 py-3 rounded shadow hover:bg-[#333] transition"
          >
            Shop Now
          </a>
        </section>
        <section id="products">
          <h2 className="text-2xl font-bold mb-4 text-[#18181b]">Featured Products</h2>
          <ProductList />
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage