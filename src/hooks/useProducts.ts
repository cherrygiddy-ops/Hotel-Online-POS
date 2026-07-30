// src/hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import type { AxiosError } from "axios";
import { Product } from "@/entities/Product";
import ProductService from "@/services/ProductService";

export const useProducts = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  // Fetch products
  const productsQuery = useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: ProductService.getAll,
  });

  // Create product
  const createProduct = useMutation<Product, AxiosError, Omit<Product, "id">>({
    mutationFn: ProductService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product added",
        description: `${data.name} created successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Add failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });

  // Update product
  const updateProduct = useMutation<Product, AxiosError, { id: number; payload: Partial<Product> }>({
    mutationFn: ({ id, payload }) => ProductService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product updated",
        description: `${data.name} updated successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });

  // Delete product
  const deleteProduct = useMutation<void, AxiosError, number>({
    mutationFn: ProductService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Product deleted",
        description: "Product removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });

  return {
    productsQuery,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
