import { useProducts } from "@/hooks/useProducts";

export default function AdminProductsPage() {
  const { productsQuery, createProduct, updateProduct, deleteProduct } = useProducts();

  if (productsQuery.isLoading) return <p>Loading...</p>;
  if (productsQuery.error) return <p>Error: {productsQuery.error.message}</p>;

  return (
    <div>
      <h1>Products</h1>
      <button
        onClick={() =>
          createProduct.mutate({ name: "Latte", price: 4, categoryId: 1 })
        }
      >
        Add Latte
      </button>
      <ul>
        {productsQuery.data?.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
            <button onClick={() => updateProduct.mutate({ id: p.id, payload: { price: p.price + 1 } })}>
              Increase Price
            </button>
            <button onClick={() => deleteProduct.mutate(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
