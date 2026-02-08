import { create } from "zustand";
import { NeonClientApi } from "../common/NeonApiClient";
import {
  getMonthlyReportResponse,
  incomeExpenseHistory,
  monthlyReport,
  monthlyReportEx,
  TransactionMode,
} from "../type/NeonApiInterface";

interface AuthState {
  mode: TransactionMode;
  setMode: (mode: TransactionMode) => void;
  monthlyReport: monthlyReport;
  setMonthlyReport: (obj: monthlyReport) => void;
  incomeExpenseHistory: incomeExpenseHistory[];
  setIncomeExpenseHistory: (obj: incomeExpenseHistory[]) => void;
  isLoading: Boolean;
  setIsLoading: (value: Boolean) => void;
}
const client = new NeonClientApi();

export const getMonthlyReport = async (
  userId?: string,
  mode: TransactionMode = "borrowing",
): Promise<monthlyReportEx> => {
  try {
    if (!userId || userId === "all") {
      const result = await client.getMonthlyReport({
        userInfo: {
          accessToken:
            localStorage.getItem("income-expense-history-accessToken") || "",
        },
        mode,
      });
      return result;
    }
    const result = await client.getMonthlyReport({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
      borrowed_user_id: userId,
      mode,
    });
    return result;
  } catch (error) {
    return { taskId: 0, status: "error", monthlyReport: [] };
  }
};
export const getIncomeExpenseHistory = async (
  userId?: string,
  mode: TransactionMode = "borrowing",
): Promise<incomeExpenseHistory[]> => {
  try {
    if (!userId || userId == "all") {
      const result = await client.getIncomeExpenseHistory({
        userInfo: {
          accessToken:
            localStorage.getItem("income-expense-history-accessToken") || "",
        },
        mode,
      });
      return result;
    }
    const result = await client.getIncomeExpenseHistory({
      userInfo: {
        accessToken:
          localStorage.getItem("income-expense-history-accessToken") || "",
      },
      borrowed_user_id: userId,
      mode,
    });
    return result;
  } catch (error) {
    return [];
  }
};
export const useDashBoard = create<AuthState>((set) => ({
  mode: "borrowing",
  setMode: (mode) => set({ mode }),
  monthlyReport: [],
  setMonthlyReport: (obj) => {
    set({ monthlyReport: obj });
  },
  incomeExpenseHistory: [],
  setIncomeExpenseHistory: (obj) => {
    set({ incomeExpenseHistory: obj });
  },
  isLoading: true,
  setIsLoading: (value) => set({ isLoading: value }),
}));
