// src/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type User from "../entities/UserContext";
import { axiosInstance } from "../services/ApiClient";
import LoginService from "../services/LoginService";
import { useAuthStore } from "@/Store/AuthStore";


const useLogin = () => {
  const setAccessToken = useAuthStore(s=>s.setAccessToken)
  const toast = useToast();
  const navigate = useNavigate();
 

  return useMutation<{ token: string },AxiosError,{ email: string; password: string }>({
    mutationFn: async (payload) => {
      return await LoginService.login(payload); // returns JwtResponseDto
    },
    onSuccess: async (data) => {
      setAccessToken(data.token);
      const userRes = await axiosInstance.get<User>("/auth/currentUser", {
        headers: { Authorization: `Bearer ${data.token}` },
      });
       useAuthStore.setState({ user: userRes.data, loading: false });
      toast({
        title: "Login successful!",
        description: "Welcome ....",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/");
    },
    onError: (error) => {
      const message =
        typeof error.response?.data === "string"
          ? error.response.data
          : (error.response?.data as { message?: string })?.message ||
            error.message ||
            "Please try again.";

      toast({
        title: "Login failed",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    },
  });
};

export default useLogin;
