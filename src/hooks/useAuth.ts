import { create } from "zustand";
import { NeonClientApi } from "../common/NeonApiClient";

interface AuthState {
  isAuthenticated: boolean;
  auth: () => void;
  login: (email: string, password: string) => Promise<number>;
  logout: () => void;
}
const client = new NeonClientApi();
export const auth: () => Promise<boolean> = async () => {
  try {
    const result = await client.accessTokenAuth({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
    });
    return result === 200;
  } catch (error) {
    return false;
  }
};
export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  auth: () => {
    set({ isAuthenticated: true });
  },
  login: async (email: string, password: string) => {
    console.log(email);
    const result = await client.loginAuth({ userId: email, password });
    if (result === 200) {
      set({ isAuthenticated: true });
    }
    return result;
  },
  logout: () => {
    localStorage.removeItem("income-expense-history-accessToken");
    set({ isAuthenticated: false });
  },
}));
