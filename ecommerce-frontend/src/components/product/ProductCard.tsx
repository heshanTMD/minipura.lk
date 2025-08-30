import React from 'react';

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  price: number;
  onAddToCart: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, image, price, onAddToCart }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <img src={image} alt={title} className="w-full h-48 object-cover rounded-md" />
      <h2 className="mt-2 text-lg font-semibold">{title}</h2>
      <p className="text-xl font-bold">${price.toFixed(2)}</p>
      <button
        onClick={() => onAddToCart(id)}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;