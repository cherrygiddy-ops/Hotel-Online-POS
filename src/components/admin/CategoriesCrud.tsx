import React, { useState } from "react";
import { useCategories, useAddCategory } from "@/hooks/useCategories";

const CategoriesCrud: React.FC = () => {
  const { data: categories, isLoading, error } = useCategories();
  const addCategoryMutation = useAddCategory();

  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    if (newCategory.trim()) {
      addCategoryMutation.mutate(newCategory.trim());
      setNewCategory("");
    }
  };

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
  if (error) return <p className="text-red-500">Error loading categories</p>;

  return (
    <div className="p-6 w-full max-w-5xl mx-auto bg-white rounded shadow">
  <h2 className="text-2xl font-bold mb-4">Categories</h2>

  {/* Add category */}
  <div className="flex flex-col sm:flex-row mb-4">
    <input
      type="text"
      value={newCategory}
      onChange={(e) => setNewCategory(e.target.value)}
      placeholder="New category name"
      className="w-full sm:flex-1 border rounded px-3 py-2 mb-2 sm:mb-0 sm:mr-2"
    />
    <button
      onClick={handleAdd}
      disabled
      className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded 
                 opacity-50 cursor-not-allowed"
    >
      Add
    </button>
  </div>

  {/* List categories */}
  <ul className="space-y-2 text-left">
    {categories?.map((cat) => (
      <li
        key={cat.id}
        className="flex justify-between items-center border-b pb-2"
      >
        <span>{cat.name}</span>
      </li>
    ))}
  </ul>
</div>

  );
};

export default CategoriesCrud;
