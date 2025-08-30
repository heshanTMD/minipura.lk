import React from 'react'
import ProductList from '../components/product/ProductList'
import Navbar from '../components/common/Navbar'
import Footer from '../components/footer/Footer'

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our E-commerce Store</h1>
        <ProductList />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage