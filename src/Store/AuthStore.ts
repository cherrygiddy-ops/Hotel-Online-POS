import User from "@/entities/UserContext";
import { axiosInstance } from "@/services/ApiClient";
import { create } from "zustand";
import { persist } from "zustand/middleware";



interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setAccessToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      loading: true,

      setAccessToken: (token) => set({ accessToken: token }),

      login: async (email, password) => {
        try {
          const res = await axiosInstance.post<{ token: string }>(
            "/auth/login",
            {
              email,
              password,
            }
          );
          const token = res.data.token;
          set({ accessToken: token });

          const userRes = await axiosInstance.get<User>("/auth/currentUser", {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: userRes.data, loading: false });
        } catch {
          set({ user: null, accessToken: null, loading: false });
        }
      },

      logout: async () => {
        await axiosInstance.post("/auth/logout");
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
