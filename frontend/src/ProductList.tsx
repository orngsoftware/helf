import React, { useState, useEffect } from 'react';
import { getAllProducts, getProductByID } from './services/main'; 

interface Product {
  id: string | number;
  name: string;
  price: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch product by ID when an individual product is clicked
  const handleProductClick = async (productId: string | number) => {
    try {
      const product = await getProductByID(productId);
      alert(`Product: ${product.name}, Price: $${product.price}`);
    } catch (err) {
      alert('Failed to fetch product details');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id} onClick={() => handleProductClick(product.id)}>
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
