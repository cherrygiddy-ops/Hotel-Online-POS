
import { useQuery } from "@tanstack/react-query";
import categoryService from "@/services/CategoryService";
import { Category } from "@/entities/Category";

const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
    staleTime: 24 * 60 * 60 * 1000,
    //initialData:categoriesData
  })
};

export default useCategories;
