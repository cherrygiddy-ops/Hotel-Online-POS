import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminProductsPage() {
  const { productsQuery, createProduct, updateProduct, deleteProduct } = useProducts();

  const [form, setForm] = useState({ name: "", price: "", categoryId: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", categoryId: "" });

  if (productsQuery.isLoading) return <p>Loading...</p>;
  if (productsQuery.error) return <p>Error: {productsQuery.error.message}</p>;

  const handleAdd = () => {
    const priceNum = Number(form.price);
    const categoryNum = Number(form.categoryId);
    if (!form.name || priceNum <= 0 || categoryNum <= 0) return;

    createProduct.mutate({ name: form.name, price: priceNum, categoryId: categoryNum });
    setForm({ name: "", price: "", categoryId: "" });
  };

  const handleUpdate = (id: string) => {
    const priceNum = Number(editForm.price);
    const categoryNum = Number(editForm.categoryId);
    if (!editForm.name || priceNum <= 0 || categoryNum <= 0) return;

    updateProduct.mutate({ id, payload: { name: editForm.name, price: priceNum, categoryId: categoryNum } });
    setEditingId(null);
    setEditForm({ name: "", price: "", categoryId: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Products</h1>

      {/* Add Product Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="number" placeholder="Enter product price (Kes)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <Input type="number" placeholder="Enter category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Products List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productsQuery.data?.length ? (
              productsQuery.data.map((p) => (
                <tr key={p.id} className="border-t">
                  {editingId === p.id ? (
                    <>
                      <td className="p-2">
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      </td>
                      <td className="p-2">
                        <Input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} />
                      </td>
                      <td className="p-2">
                        <Input type="number" value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })} />
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(p.id)}>Save</Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>Cancel</Button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{p.name}</td>
                      <td className="p-2">Kes {p.price}</td>
                      <td className="p-2">{p.categoryId}</td>
                      <td className="p-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingId(p.id);
                            setEditForm({ name: p.name, price: String(p.price), categoryId: String(p.categoryId) });
                          }}
                        >
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteProduct.mutate(p.id)}>Delete</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No products yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
