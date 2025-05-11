import { create } from "zustand";
import { NeonClientApi } from "../common/NeonApiClient";

interface AuthState {
  isAuthenticated: boolean;
  borrowedUserId:number | null;
  setBorrowedUserId: (id: number | null) => void;
  auth: (id:number|null) => void;
  login: (email: string, password: string) => Promise<number>;
  logout: () => void;
}
const client = new NeonClientApi();
export const auth: () => Promise<{isAuthenticated:boolean, borrowedUserId:number|null}> = async () => {
  try {
    const result = await client.accessTokenAuth({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
    });
    return {isAuthenticated:result.statusCode === 200, borrowedUserId:result.borrowedUserId};
  } catch (error) {
    return {isAuthenticated:false, borrowedUserId:null};
  }
};
export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  borrowedUserId: null,
  setBorrowedUserId: (id) => {},
  auth: (id:number | null) => {
    set({ isAuthenticated: true });
    set({borrowedUserId: id});
  },
  login: async (email: string, password: string) => {
    console.log(email);
    const result = await client.loginAuth({ userId: email, password });
    if (result.statusCode === 200) {
      set({ isAuthenticated: true });
    }
    set({borrowedUserId: result.borrowedUserId})
    return result.statusCode;
  },
  logout: () => {
    localStorage.removeItem("income-expense-history-accessToken");
    set({ isAuthenticated: false });
  },
}));
