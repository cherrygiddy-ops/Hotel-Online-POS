import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import categoryService from "@/services/CategoryService";
import { CategoryRequestDto } from "@/entities/CategoryRequestDto";
import { CategoryResponseDto } from "@/entities/CategoryResponseDto";
import { axiosInstance } from "@/services/ApiClient";

// ✅ Fetch categories
export const useCategories = () => {
  return useQuery<CategoryResponseDto[], Error>({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

// ✅ Add category
export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryResponseDto, Error, string>({
    mutationFn: (name: string) => axiosInstance
      .post<CategoryResponseDto>("/auth/categories", name)
      .then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
