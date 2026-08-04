import { create } from "zustand";

 interface ProductQuery {
  categoryId?: number;
  sortOrder?: string;
  keyword?: string;
}

interface ProductQueryStore {
  productQuery: ProductQuery;
  setCategory: (category: number) => void;
  setSearchText: (keyword: string) => void;
  setSortOrder: (sortOrder: string) => void;
  reset: () => void;
}

const useProductQueryStore = create<ProductQueryStore>((set) => ({
  productQuery: {},
  setSearchText: (keyword) =>
    set(() => ({ productQuery: { keyword: keyword } })),
  setCategory: (categoryId) =>
    set((store) => ({ productQuery: { ...store.productQuery, categoryId } })),
  setSortOrder: (sortOrder) =>
    set((store) => ({ productQuery: { ...store.productQuery, sortOrder } })),
  reset: () => set(() => ({ productQuery: {} })),
}));

export default useProductQueryStore;