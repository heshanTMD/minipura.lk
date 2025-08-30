import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProductById } from "@/utils/api";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/footer/Footer";

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const data = await getProductById(id);
          setProduct(data);
        } catch (err) {
          setError("Failed to fetch product details.");
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {product ? (
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <img src={product.image} alt={product.title} className="w-full h-auto" />
            <p className="text-xl font-semibold">${product.price}</p>
            <p className="mt-4">{product.description}</p>
            <button className="mt-4 p-2 bg-blue-500 text-white rounded">Add to Cart</button>
          </div>
        ) : (
          <p>Product not found.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;