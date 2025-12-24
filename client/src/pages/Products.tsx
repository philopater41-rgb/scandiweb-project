import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ProductCard, Loading } from '../components';
import { useDataContext } from '../DataContext';
import { GET_PRODUCTS } from '../graphql/queries';
import { Product } from '../types';

function Products() {
  const { selectedCategory } = useDataContext();

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    variables: { category: selectedCategory },
    skip: !selectedCategory,
  });

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  const products: Product[] = data?.products || [];

  return (
    <main className="mt-14">
      <h1 className="heading-h1 !mb-12 !uppercase">{selectedCategory}</h1>

      {!!products.length && (
        <section className="grid grid-cols-auto-fill-350 gap-x-4 gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Products;
